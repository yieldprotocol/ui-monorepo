"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetProcess = exports.updateProcess = exports.transactionsø = void 0;
const rxjs_1 = require("rxjs");
const types_1 = require("../types");
const transactionMap$ = new rxjs_1.BehaviorSubject(new Map([]));
exports.transactionsø = transactionMap$.pipe((0, rxjs_1.share)());
/* Update a process  */
const updateProcess = (process) => {
    const prevProcess = transactionMap$.value.get(process.processCode);
    const updatedProcess = transactionMap$.value.set(process.processCode, Object.assign(Object.assign({}, prevProcess), process));
    transactionMap$.next(new Map(updatedProcess));
};
exports.updateProcess = updateProcess;
/* utility function to reset a process */
const resetProcess = (processCode) => {
    transactionMap$.next(new Map(transactionMap$.value.set(processCode, {
        processCode,
        tx: undefined,
        signMap: new Map([]),
        stage: types_1.ProcessStage.PROCESS_INACTIVE,
        txHash: undefined,
        timeout: false,
        processActive: false,
    })));
};
exports.resetProcess = resetProcess;
//# sourceMappingURL=transactions.js.map