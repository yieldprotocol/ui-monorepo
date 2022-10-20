"use strict";
/**
 * @module
 * Inputs
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRemoveLiqInput = exports.removeLiquidityInputø = exports.removeLiquidityInput$ = exports.updateAddLiqInput = exports.addLiquidityInputø = exports.addLiquidityInput$ = exports.updateCloseInput = exports.closeInputø = exports.closeInput$ = exports.updateLendInput = exports.lendInputø = exports.lendInput$ = exports.updateRepayInput = exports.repayInputø = exports.repayInput$ = exports.updateCollateralInput = exports.collateralInputø = exports.collateralInput$ = exports.updateBorrowInput = exports.borrowInputø = exports.borrowInput$ = void 0;
const rxjs_1 = require("rxjs");
const observables_1 = require("../observables");
const yieldUtils_1 = require("../utils/yieldUtils");
const constants_1 = require("../utils/constants");
const _getValueFromInputEvent = (event) => {
    return event.pipe((0, rxjs_1.tap)((event) => console.log('event.target', event.target)), (0, rxjs_1.map)((event) => event.target.value));
};
/** @internal */
exports.borrowInput$ = new rxjs_1.BehaviorSubject('0');
/**
 * Borrow input
 * @category Input
 * */
exports.borrowInputø = (0, rxjs_1.combineLatest)([exports.borrowInput$, observables_1.selectedø]).pipe((0, rxjs_1.distinctUntilChanged)(), (0, rxjs_1.map)(([inp, { base }]) => {
    if (inp) {
        const tokenValue = (0, yieldUtils_1.inputToTokenValue)(inp, base === null || base === void 0 ? void 0 : base.decimals);
        return (0, yieldUtils_1.bnToW3bNumber)(tokenValue, base === null || base === void 0 ? void 0 : base.decimals, base === null || base === void 0 ? void 0 : base.digitFormat);
    }
    ;
    return constants_1.ZERO_W3B;
}), (0, rxjs_1.share)());
/* Manual input update escape hatch (for example, when using react that doesn't have direct DOM access) */
const updateBorrowInput = (input) => exports.borrowInput$.next(input);
exports.updateBorrowInput = updateBorrowInput;
/** @internal */
exports.collateralInput$ = new rxjs_1.BehaviorSubject('0');
/**
 * Collateral input
 * @category Input
 * */
exports.collateralInputø = (0, rxjs_1.combineLatest)([exports.collateralInput$, observables_1.selectedø]).pipe((0, rxjs_1.map)(([inp, { ilk }]) => {
    if (inp) {
        const tokenValue = (0, yieldUtils_1.inputToTokenValue)(inp, ilk === null || ilk === void 0 ? void 0 : ilk.decimals);
        return (0, yieldUtils_1.bnToW3bNumber)(tokenValue, ilk === null || ilk === void 0 ? void 0 : ilk.decimals, ilk === null || ilk === void 0 ? void 0 : ilk.digitFormat);
    }
    ;
    return constants_1.ZERO_W3B;
}), (0, rxjs_1.share)());
/* Manual input update escape hatch (for example, when using react that doesn't have direct DOM access) */
const updateCollateralInput = (input) => exports.collateralInput$.next(input);
exports.updateCollateralInput = updateCollateralInput;
/** @internal */
exports.repayInput$ = new rxjs_1.Subject();
/**
 * Repayment input
 * @category Input
 * */
exports.repayInputø = (0, rxjs_1.combineLatest)([exports.repayInput$, observables_1.selectedø]).pipe((0, rxjs_1.map)(([inp, { base }]) => {
    if (inp) {
        const tokenValue = (0, yieldUtils_1.inputToTokenValue)(inp, base === null || base === void 0 ? void 0 : base.decimals);
        return (0, yieldUtils_1.bnToW3bNumber)(tokenValue, base === null || base === void 0 ? void 0 : base.decimals, base === null || base === void 0 ? void 0 : base.digitFormat);
    }
    ;
    return constants_1.ZERO_W3B;
}));
/* Manual input update escape hatch (for example, when using react that doesn't have direct DOM access) */
const updateRepayInput = (input) => exports.repayInput$.next(input);
exports.updateRepayInput = updateRepayInput;
/** @internal */
exports.lendInput$ = new rxjs_1.BehaviorSubject('');
/**
 * Lending input
 * @category Input
*/
exports.lendInputø = (0, rxjs_1.combineLatest)([exports.lendInput$, observables_1.selectedø]).pipe((0, rxjs_1.map)(([inp, { base }]) => {
    if (inp) {
        const tokenValue = (0, yieldUtils_1.inputToTokenValue)(inp, base === null || base === void 0 ? void 0 : base.decimals);
        return (0, yieldUtils_1.bnToW3bNumber)(tokenValue, base === null || base === void 0 ? void 0 : base.decimals, base === null || base === void 0 ? void 0 : base.digitFormat);
    }
    ;
    return constants_1.ZERO_W3B;
}));
/* Manual input update escape hatch (for example, when using react that doesn't have direct DOM access) */
const updateLendInput = (input) => exports.lendInput$.next(input);
exports.updateLendInput = updateLendInput;
/** @internal */
exports.closeInput$ = new rxjs_1.BehaviorSubject('');
/**
 * Close Position input
 * @category Input
*/
exports.closeInputø = (0, rxjs_1.combineLatest)([exports.closeInput$, observables_1.selectedø]).pipe((0, rxjs_1.map)(([inp, { base }]) => {
    if (inp) {
        const tokenValue = (0, yieldUtils_1.inputToTokenValue)(inp, base === null || base === void 0 ? void 0 : base.decimals);
        return (0, yieldUtils_1.bnToW3bNumber)(tokenValue, base === null || base === void 0 ? void 0 : base.decimals, base === null || base === void 0 ? void 0 : base.digitFormat);
    }
    ;
    return constants_1.ZERO_W3B;
}));
/* Manual input update escape hatch (for example, when using react that doesn't have direct DOM access) */
const updateCloseInput = (input) => exports.closeInput$.next(input);
exports.updateCloseInput = updateCloseInput;
/** @internal */
exports.addLiquidityInput$ = new rxjs_1.BehaviorSubject('');
/**
 * Add liquidity input
 * @category Input
 *  */
exports.addLiquidityInputø = (0, rxjs_1.combineLatest)([exports.addLiquidityInput$, observables_1.selectedø]).pipe((0, rxjs_1.map)(([inp, { base }]) => {
    if (inp) {
        const tokenValue = (0, yieldUtils_1.inputToTokenValue)(inp, base === null || base === void 0 ? void 0 : base.decimals);
        return (0, yieldUtils_1.bnToW3bNumber)(tokenValue, base === null || base === void 0 ? void 0 : base.decimals, base === null || base === void 0 ? void 0 : base.digitFormat);
    }
    ;
    return constants_1.ZERO_W3B;
}));
/** Manual input update escape hatch (for example, when using react that doesn't have direct DOM access) */
const updateAddLiqInput = (input) => exports.addLiquidityInput$.next(input);
exports.updateAddLiqInput = updateAddLiqInput;
/** @internal */
exports.removeLiquidityInput$ = new rxjs_1.BehaviorSubject('');
/**
 * Remove liquidity input
 * @category Input
 * */
exports.removeLiquidityInputø = (0, rxjs_1.combineLatest)([exports.removeLiquidityInput$, observables_1.selectedø]).pipe((0, rxjs_1.map)(([inp, { base }]) => {
    if (inp) {
        const tokenValue = (0, yieldUtils_1.inputToTokenValue)(inp, base === null || base === void 0 ? void 0 : base.decimals);
        return (0, yieldUtils_1.bnToW3bNumber)(tokenValue, base === null || base === void 0 ? void 0 : base.decimals, base === null || base === void 0 ? void 0 : base.digitFormat);
    }
    ;
    return constants_1.ZERO_W3B;
}));
/** Manual input update escape hatch (for example, when using react that doesn't have direct DOM access) */
const updateRemoveLiqInput = (input) => exports.removeLiquidityInput$.next(input);
exports.updateRemoveLiqInput = updateRemoveLiqInput;
/**
 *
 * EXPERIMENTAL: set up automatic listeners for plain html apps
 *
 * */
if (typeof window !== 'undefined') {
    /* If there is a borrowInput html element, subcribe to that event */
    const _borrowInputElement = document.getElementById('borrowInput');
    _borrowInputElement &&
        (0, rxjs_1.fromEvent)(_borrowInputElement, 'input')
            .pipe(_getValueFromInputEvent)
            .subscribe((val) => {
            exports.borrowInput$.next(val);
        });
    /* If there is a borrowInput html element, subcribe to that event */
    const _repayInputElement = document.getElementById('repayInput');
    _repayInputElement &&
        (0, rxjs_1.fromEvent)(_repayInputElement, 'input')
            .pipe(_getValueFromInputEvent)
            .subscribe((val) => {
            exports.repayInput$.next(val);
        });
    /* If there is a borrowInput html element, subcribe to that event */
    const _poolInputElement = document.getElementById('poolInput');
    _poolInputElement &&
        (0, rxjs_1.fromEvent)(_poolInputElement, 'input')
            .pipe(_getValueFromInputEvent)
            .subscribe((val) => {
            exports.addLiquidityInput$.next(val);
        });
    /* If there is a collateralInput html element, subcribe to that event */
    const _collateralInputElement = document.getElementById('collateralInput');
    _collateralInputElement &&
        (0, rxjs_1.fromEvent)(_collateralInputElement, 'input')
            .pipe(_getValueFromInputEvent)
            .subscribe((val) => {
            exports.collateralInput$.next(val);
        });
}
//# sourceMappingURL=input.js.map