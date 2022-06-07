import { ethers, Contract, PayableOverrides, BigNumber, ContractTransaction } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { ERC1155__factory, ERC20Permit__factory, Ladle } from '../contracts';
import { account$ } from '../observables/account';
import { appConfig$ } from '../observables/appConfig';
import { provider$ } from '../observables/provider';
import { yieldProtocol$ } from '../observables/yieldProtocol';
import { IAsset, ICallData, ISignData, IYieldProcess, LadleActions, ProcessStage, TokenType, TxState } from '../types';
import { ZERO_BN } from '../utils/constants';
import { resetProcess, transactionMap$, updateProcess } from '../observables/transactionMap';

/* Handle the transaction error */ 
const _handleApproveError = () => {


};

/* handle case when user or wallet rejects the tx (before submission) */
const _handleApproveRejection = (err: any, processCode: string) => {
  resetProcess(processCode);
  /* If user cancelled/rejected the tx */
  if (err.code === 4001) {
    updateProcess({ processCode, stage: 0, error: { error: err, message: 'Transaction rejected by user.' } });
  } else {
    /* Else, the transaction was likely cancelled by the wallet/provider before getting submitted */
    const _msg = err.data.message.includes()
      ? `${err.data.message.split('VM Exception while processing transaction: revert').pop()}`
      : `Something went wrong.`;
    updateProcess({ processCode, stage: 0, error: { error: err, message: _msg } });
    /* Always log error to the console */
    console.log(err);
  }
};

export const approve = async (requestedSig: ISignData, processCode: string) => {
  
  /* Bring in observables */
  const account = account$.value;
  const provider = provider$.value as Web3Provider;
  
  const {target, spender, amount } = requestedSig;

  console.log(processCode)

  /* Get the signer */
  const signer = account ? provider.getSigner(account) : provider.getSigner(0);

  let approvalTx;
  try {
    approvalTx = target.tokenType === TokenType.ERC1155_ 
        ? await ERC1155__factory.connect(target.address, signer).setApprovalForAll(spender, true)
        : await ERC20Permit__factory.connect(target.address, signer).approve(spender, amount as string)
  } catch (e) {

      console.log(e)
  }
  
};