"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transact = void 0;
const tslib_1 = require("tslib");
const ethers_1 = require("ethers");
const observables_1 = require("../observables/");
const types_1 = require("../types");
const constants_1 = require("../utils/constants");
const transactionMap_1 = require("../observables/transactionMap");
/* Encode the calls: */ // TODO: this could probably be refactored to look better
const _encodeCalls = (calls, ladle) => calls.map((call) => {
    /* 'pre-encode' routed/module calls if required */
    if (call.operation === types_1.LadleActions.Fn.ROUTE || call.operation === types_1.LadleActions.Fn.MODULE) {
        if (call.fnName && call.targetContract) {
            const encodedFn = call.targetContract.interface.encodeFunctionData(call.fnName, call.args);
            if (call.operation === types_1.LadleActions.Fn.ROUTE)
                return ladle.interface.encodeFunctionData(types_1.LadleActions.Fn.ROUTE, [call.targetContract.address, encodedFn]);
            if (call.operation === types_1.LadleActions.Fn.MODULE)
                return ladle.interface.encodeFunctionData(types_1.LadleActions.Fn.MODULE, [call.targetContract.address, encodedFn]);
        }
        throw new Error('Function name and contract target required for routing / module interaction');
    }
    /* else */
    return ladle.interface.encodeFunctionData(call.operation, call.args);
});
/* Get the sum of the VALUE of all calls */
const _totalBatchValue = (calls) => calls.reduce((sum, call) => {
    var _a, _b;
    return sum.add(((_a = call.overrides) === null || _a === void 0 ? void 0 : _a.value) ? ethers_1.BigNumber.from((_b = call === null || call === void 0 ? void 0 : call.overrides) === null || _b === void 0 ? void 0 : _b.value) : constants_1.ZERO_BN);
}, constants_1.ZERO_BN);
/* Handle the transaction error */
const _handleTxError = () => {
};
/* handle case when user or wallet rejects the tx (before submission) */
const _handleTxRejection = (err, processCode) => {
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
const transact = (calls, processCode) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    (0, transactionMap_1.updateProcess)({ processCode, stage: types_1.ProcessStage.TRANSACTION_REQUESTED });
    /* Bring in observables */
    const { ladle } = observables_1.yieldProtocol$.value;
    const account = observables_1.account$.value;
    const provider = observables_1.provider$.value;
    const { forceTransactions } = observables_1.appConfig$.value;
    /* Get the signer */
    const signer = account ? provider.getSigner(account) : provider.getSigner(0);
    /* Set the connected contract instance, ladle by default */
    const ladleContract = ladle.connect(signer);
    const encodedCalls = _encodeCalls(calls, ladleContract);
    const batchValue = _totalBatchValue(calls);
    let gasEst;
    // let gasEst: boolean = false;
    try {
        gasEst = yield ladleContract.estimateGas.batch(encodedCalls, { value: batchValue });
        console.log('Auto Gas estimate: ', gasEst.mul(120).div(100).toString());
    }
    catch (e) {
        /* handle if the tx if going to fail and transactions aren't forced */
        gasEst = ethers_1.BigNumber.from(1000000);
        if (!forceTransactions)
            console.log('transaction will fail'); // handleTxWillFail(e.error, processCode, e.transaction);
    }
    let tx;
    let res;
    try {
        /* first try the transaction with connected wallet and catch any 'pre-chain'/'pre-tx' errors */
        try {
            tx = yield ladleContract.batch(encodedCalls, {
                value: batchValue,
                gasLimit: gasEst.mul(120).div(100),
            });
            /* update process list > Tx Pending */
            (0, transactionMap_1.updateProcess)({
                processCode,
                stage: types_1.ProcessStage.TRANSACTION_PENDING,
                tx: Object.assign(Object.assign({}, tx), { receipt: null, status: types_1.TxState.PENDING }),
            });
        }
        catch (e) {
            /* this case is when user rejects tx OR wallet rejects tx */
            _handleTxRejection(e, processCode);
        }
        /* wait for the tx to complete */
        res = yield tx.wait();
        /* check the tx status ( failed/success ) */
        const txSuccess = res.status === 1 || false;
        /* update process list > Tx Complete + status */
        (0, transactionMap_1.updateProcess)({
            processCode,
            stage: types_1.ProcessStage.PROCESS_COMPLETE,
            tx: Object.assign(Object.assign({}, tx), { receipt: res, status: txSuccess ? types_1.TxState.SUCCESSFUL : types_1.TxState.FAILED }),
        });
    }
    catch (e) {
        /* catch tx errors */
        //  _handleTxError('Transaction failed', e.transaction, processCode);
        console.log(' Error', e.transaction, processCode);
    }
});
exports.transact = transact;
//# sourceMappingURL=transact.js.map