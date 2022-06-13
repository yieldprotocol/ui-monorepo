"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sign = void 0;
const tslib_1 = require("tslib");
const eth_permit_1 = require("eth-permit");
const contracts_1 = require("../contracts");
const observables_1 = require("../observables");
const userSettings_1 = require("../observables/userSettings");
const types_1 = require("../types");
const constants_1 = require("../utils/constants");
const transactionMap_1 = require("../observables/transactionMap");
const yieldUtils_1 = require("../utils/yieldUtils");
// const _handleSignSuccess = (reqSig: ISignData, processCode:string ) => {
//     /* update the processMap to indicate the signing was successfull */
//     updateProcess({
//       processCode,
//       signMap: new Map(transactionMap$.value.signMap.set(getSignId(reqSig), { signData: reqSig, status: TxState.SUCCESSFUL })),
//     });
// };
const _handleSignError = (err, processCode) => {
    /* End the process on signature rejection or sign failure */
    (0, transactionMap_1.resetProcess)(processCode);
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
const sign = (requestedSignatures, processCode, chainId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    /* Get the values from the SUBJECTS $$ */
    const account = observables_1.account$.value;
    const accountProvider = observables_1.accountProvider$.value;
    const { maxApproval, approvalMethod } = userSettings_1.userSettings$.value;
    /* First, filter out any ignored calls */
    const _requestedSigs = requestedSignatures.filter((_rs) => !_rs.ignoreIf);
    /* Build out the signMap for this process */
    const _signMap = new Map(_requestedSigs.map((s) => [(0, yieldUtils_1.getSignId)(s), { signData: s, status: types_1.TxState.PENDING }]));
    /* update the process with a list of signatures required, and start the process*/
    (0, transactionMap_1.updateProcess)({
        processCode,
        signMap: new Map(_signMap),
        stage: types_1.ProcessStage.SIGNING_APPROVAL_REQUESTED,
    });
    const isContractWallet = (account && (yield accountProvider.getCode(account)) !== '0x0') || '0x';
    console.log(isContractWallet);
    const signer = account
        ? accountProvider.getSigner(account)
        : accountProvider.getSigner(0); // TODO: signer is WRONG here.
    const _processedSigs = _requestedSigs.map((reqSig) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a;
        /**
         * CASE 1:  ERC2612 Permit style (and approval by transaction not  selected)
         * */
        if (!isContractWallet &&
            approvalMethod === types_1.ApprovalMethod.SIG &&
            reqSig.target.tokenType === types_1.TokenType.ERC20_Permit) {
            /* get the  ERC2612 signed data */
            const _amount = maxApproval ? constants_1.MAX_256 : (_a = reqSig.amount) === null || _a === void 0 ? void 0 : _a.toString();
            const { v, r, s, value, deadline } = yield (0, eth_permit_1.signERC2612Permit)(accountProvider, 
            /* build domain */
            reqSig.domain || {
                // uses custom domain if provided, else use created Domain
                name: reqSig.target.name,
                version: reqSig.target.version,
                chainId,
                verifyingContract: reqSig.target.address,
            }, account, reqSig.spender, _amount).catch((err) => _handleSignError(err, processCode));
            const args = [
                reqSig.target.address,
                reqSig.spender,
                reqSig.amount,
                deadline,
                v,
                r,
                s,
            ];
            return {
                operation: types_1.LadleActions.Fn.FORWARD_PERMIT,
                args,
                ignoreIf: false, // Never ignore a successfully completed signature
            };
        }
        /**
         * CASE 2:  DAI Permit style (and approval by transaction not  selected)
         * */
        if (!isContractWallet &&
            approvalMethod === types_1.ApprovalMethod.SIG &&
            reqSig.target.tokenType === types_1.TokenType.ERC20_DaiPermit) {
            /* Get the sign data */
            const { v, r, s, nonce, expiry, allowed } = yield (0, eth_permit_1.signDaiPermit)(accountProvider, 
            /* build domain */
            {
                name: reqSig.target.name,
                version: reqSig.target.version,
                chainId,
                verifyingContract: reqSig.target.address,
            }, account, reqSig.spender).catch((err) => _handleSignError(err, processCode));
            const args = [
                reqSig.target.address,
                reqSig.spender,
                nonce,
                expiry,
                allowed,
                v,
                r,
                s,
            ];
            /* update the entry in the processMap to indicate the signing was successfull */
            (0, transactionMap_1.updateProcess)({
                processCode,
                signMap: new Map(_signMap.set((0, yieldUtils_1.getSignId)(reqSig), { signData: reqSig, status: types_1.TxState.SUCCESSFUL })),
            });
            return {
                operation: types_1.LadleActions.Fn.FORWARD_DAI_PERMIT,
                args,
                ignoreIf: false, // Never ignore a successfully completed signature
            };
        }
        /**
         * CASE 3: FALLBACK / DEFAULT CASE: Approval by transaction ( on transaction success return blank ICallData value (IGNORED_CALLDATA). )
         * */
        if (reqSig.target.tokenType === types_1.TokenType.ERC1155_) {
            /* if token type is ERC1155 then set approval 'ApprovalForAll' */
            const connectedERC1155 = contracts_1.ERC1155__factory.connect(reqSig.target.address, signer);
            yield connectedERC1155
                .setApprovalForAll(reqSig.spender, true)
                .catch((err) => _handleSignError(err, processCode));
            /* update the processMap to indicate the signing was successfull */
            (0, transactionMap_1.updateProcess)({
                processCode,
                signMap: new Map(_signMap.set((0, yieldUtils_1.getSignId)(reqSig), { signData: reqSig, status: types_1.TxState.SUCCESSFUL })),
            });
        }
        else {
            /* else use a regular approval */
            const connectedERC20 = contracts_1.ERC20Permit__factory.connect(reqSig.target.address, signer);
            yield connectedERC20
                .approve(reqSig.spender, reqSig.amount)
                .catch((err) => _handleSignError(err, processCode));
            /* update the processMap to indicate the signing was successfull */
            (0, transactionMap_1.updateProcess)({
                processCode,
                signMap: new Map(_signMap.set((0, yieldUtils_1.getSignId)(reqSig), { signData: reqSig, status: types_1.TxState.SUCCESSFUL })),
            });
        }
        /* Approval transaction complete: return a dummy ICalldata ( which will ALWAYS get ignored )*/
        return constants_1.IGNORED_CALLDATA;
    }));
    /* Returns the processed list of txs required as ICallData[] if all successful (  may as well filter out ignored values here too ) */
    const signedList = yield Promise.all(_processedSigs);
    return signedList.filter((x) => !x.ignoreIf);
});
exports.sign = sign;
//# sourceMappingURL=sign.js.map