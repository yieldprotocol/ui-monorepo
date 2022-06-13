import { signDaiPermit, signERC2612Permit } from 'eth-permit';
import { ethers } from 'ethers';
import { ERC20Permit__factory, ERC1155__factory } from '../contracts';
import { account$, accountProvider$ } from '../observables';
import { userSettings$, userSettingsø } from '../observables/userSettings';
import {
  ISignData,
  ICallData,
  TokenType,
  LadleActions,
  ApprovalMethod,
  ProcessStage,
  TxState,
  IYieldSig,
} from '../types';
import { IGNORED_CALLDATA, MAX_256 } from '../utils/constants';
import { resetProcess, updateProcess} from '../observables/transactionMap';
import { getSignId } from '../utils/yieldUtils';

// const _handleSignSuccess = (reqSig: ISignData, processCode:string ) => {
//     /* update the processMap to indicate the signing was successfull */
//     updateProcess({
//       processCode,
//       signMap: new Map(transactionMap$.value.signMap.set(getSignId(reqSig), { signData: reqSig, status: TxState.SUCCESSFUL })),
//     });
// };

const _handleSignError = (err: Error, processCode: string) => {
  /* End the process on signature rejection or sign failure */
  resetProcess(processCode);
  console.log(err);
  return Promise.reject(err);
};

/**
 *
 * SIGNING
 *
 * 1. Build the signatures of provided by ISignData[], returns ICallData[] for a batched calls to ladle.
 * 2. (Optionally, Sends off the approval tx, on completion of all txs, returns an empty array).
 *
 * @param { ISignData[] } requestedSignatures
 * @param { string } processCode
 *
 * @returns { Promise<ICallData[]> }
 */

export const sign = async (requestedSignatures: ISignData[], processCode: string, chainId: number): Promise<ICallData[]> => {

  /* Get the values from the SUBJECTS $$ */
 const account = account$.value;
 const accountProvider = accountProvider$.value;
 const { maxApproval, approvalMethod } = userSettings$.value;

  /* First, filter out any ignored calls */
  const _requestedSigs = requestedSignatures.filter((_rs: ISignData) => !_rs.ignoreIf);

  /* Build out the signMap for this process */
  const _signMap: Map<string, IYieldSig> = new Map(
    _requestedSigs.map((s: ISignData) => [getSignId(s), { signData: s, status: TxState.PENDING }])
  );

  /* update the process with a list of signatures required, and start the process*/
  updateProcess({
    processCode,
    signMap: new Map(_signMap),
    stage: ProcessStage.SIGNING_APPROVAL_REQUESTED,
  });

  const isContractWallet = (account && (await accountProvider.getCode(account)) !== '0x0') || '0x';
  console.log(isContractWallet);

  const signer = account
    ? accountProvider.getSigner(account)
    : accountProvider.getSigner(0); // TODO: signer is WRONG here.

  const _processedSigs = _requestedSigs.map(async (reqSig: ISignData): Promise<ICallData> => {
    /**
     * CASE 1:  ERC2612 Permit style (and approval by transaction not  selected)
     * */
    if (
      !isContractWallet &&
      approvalMethod === ApprovalMethod.SIG &&
      reqSig.target.tokenType === TokenType.ERC20_Permit
    ) {
      /* get the  ERC2612 signed data */
      const _amount = maxApproval ? MAX_256 : reqSig.amount?.toString();
      const { v, r, s, value, deadline } = await signERC2612Permit(
        accountProvider,
        /* build domain */
        reqSig.domain || {
          // uses custom domain if provided, else use created Domain
          name: reqSig.target.name,
          version: reqSig.target.version,
          chainId,
          verifyingContract: reqSig.target.address,
        },
        account!,
        reqSig.spender,
        _amount
      ).catch((err: any) => _handleSignError(err, processCode));

      const args = [
        reqSig.target.address, // the asset id OR the seriesId (if signing fyToken)
        reqSig.spender,
        reqSig.amount,
        deadline,
        v,
        r as unknown as Buffer, // TODO: check typing
        s as unknown as Buffer,
      ] as LadleActions.Args.FORWARD_PERMIT;

      return {
        operation: LadleActions.Fn.FORWARD_PERMIT,
        args,
        ignoreIf: false, // Never ignore a successfully completed signature
      };
    }

    /**
     * CASE 2:  DAI Permit style (and approval by transaction not  selected)
     * */
    if (
      !isContractWallet &&
      approvalMethod === ApprovalMethod.SIG &&
      reqSig.target.tokenType === TokenType.ERC20_DaiPermit
    ) {
      /* Get the sign data */
      const { v, r, s, nonce, expiry, allowed } = await signDaiPermit(
        accountProvider,
        /* build domain */
        {
          name: reqSig.target.name,
          version: reqSig.target.version,
          chainId,
          verifyingContract: reqSig.target.address,
        },
        account!,
        reqSig.spender
      ).catch((err: any) => _handleSignError(err, processCode));

      const args = [
        reqSig.target.address,
        reqSig.spender,
        nonce,
        expiry,
        allowed, // TODO check use amount if provided, else defaults to MAX.
        v,
        r as unknown as Buffer, // TODO: check typing
        s as unknown as Buffer,
      ] as LadleActions.Args.FORWARD_DAI_PERMIT;

      /* update the entry in the processMap to indicate the signing was successfull */
      updateProcess({
        processCode,
        signMap: new Map(_signMap.set(getSignId(reqSig), { signData: reqSig, status: TxState.SUCCESSFUL })),
      });

      return {
        operation: LadleActions.Fn.FORWARD_DAI_PERMIT,
        args,
        ignoreIf: false, // Never ignore a successfully completed signature
      };
    }

    /**
     * CASE 3: FALLBACK / DEFAULT CASE: Approval by transaction ( on transaction success return blank ICallData value (IGNORED_CALLDATA). )
     * */
    if (reqSig.target.tokenType === TokenType.ERC1155_) {
      /* if token type is ERC1155 then set approval 'ApprovalForAll' */
      const connectedERC1155 = ERC1155__factory.connect(reqSig.target.address, signer);
      await connectedERC1155
        .setApprovalForAll(reqSig.spender, true)
        .catch((err: any) => _handleSignError(err, processCode));

      /* update the processMap to indicate the signing was successfull */
      updateProcess({
        processCode,
        signMap: new Map(_signMap.set(getSignId(reqSig), { signData: reqSig, status: TxState.SUCCESSFUL })),
      });

    } else {
      /* else use a regular approval */
      const connectedERC20 = ERC20Permit__factory.connect(reqSig.target.address, signer);
      await connectedERC20
        .approve(reqSig.spender, reqSig.amount as string)
        .catch((err: any) => _handleSignError(err, processCode));

      /* update the processMap to indicate the signing was successfull */
      updateProcess({
        processCode,
        signMap: new Map(_signMap.set(getSignId(reqSig), { signData: reqSig, status: TxState.SUCCESSFUL })),
      });
    }
    /* Approval transaction complete: return a dummy ICalldata ( which will ALWAYS get ignored )*/
    return IGNORED_CALLDATA;

  });

  /* Returns the processed list of txs required as ICallData[] if all successful (  may as well filter out ignored values here too ) */
  const signedList = await Promise.all(_processedSigs);

  return signedList.filter((x: ICallData) => !x.ignoreIf);

}
