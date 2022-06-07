"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.approve = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("../contracts");
const account_1 = require("../observables/account");
const provider_1 = require("../observables/provider");
const types_1 = require("../types");
const transactionMap_1 = require("../observables/transactionMap");
/* Handle the transaction error */
const _handleApproveError = () => {
};
/* handle case when user or wallet rejects the tx (before submission) */
const _handleApproveRejection = (err, processCode) => {
    (0, transactionMap_1.resetProcess)(processCode);
    /* If user cancelled/rejected the tx */
    if (err.code === 4001) {
        (0, transactionMap_1.updateProcess)({ processCode, stage: 0, error: { error: err, message: 'Transaction rejected by user.' } });
    }
    else {
        /* Else, the transaction was likely cancelled by the wallet/provider before getting submitted */
        const _msg = err.data.message.includes()
            ? `${err.data.message.split('VM Exception while processing transaction: revert').pop()}`
            : `Something went wrong.`;
        (0, transactionMap_1.updateProcess)({ processCode, stage: 0, error: { error: err, message: _msg } });
        /* Always log error to the console */
        console.log(err);
    }
};
const approve = (requestedSig, processCode) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    /* Bring in observables */
    const account = account_1.account$.value;
    const provider = provider_1.provider$.value;
    const { target, spender, amount } = requestedSig;
    console.log(processCode);
    /* Get the signer */
    const signer = account ? provider.getSigner(account) : provider.getSigner(0);
    let approvalTx;
    try {
        approvalTx = target.tokenType === types_1.TokenType.ERC1155_
            ? yield contracts_1.ERC1155__factory.connect(target.address, signer).setApprovalForAll(spender, true)
            : yield contracts_1.ERC20Permit__factory.connect(target.address, signer).approve(spender, amount);
    }
    catch (e) {
        console.log(e);
    }
});
exports.approve = approve;
//# sourceMappingURL=approve.js.map