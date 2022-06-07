"use strict";
/**
 * @module
 * Inputs
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRemoveLiqInput = exports.removeLiquidityInputø = exports.removeLiquidityInput$ = exports.updateAddLiqInput = exports.addLiquidityInputø = exports.addLiquidityInput$ = exports.updateCloseInput = exports.closeInputø = exports.closeInput$ = exports.updateLendInput = exports.lendInputø = exports.lendInput$ = exports.updateRepayInput = exports.repayInputø = exports.repayInput$ = exports.updateCollateralInput = exports.collateralInputø = exports.collateralInput$ = exports.updateBorrowInput = exports.borrowInputø = exports.borrowInput$ = void 0;
const rxjs_1 = require("rxjs");
const observables_1 = require("../observables");
const utils_1 = require("../utils");
const appConfig_1 = require("../observables/appConfig");
const yieldUtils_1 = require("../utils/yieldUtils");
const diagnostics = appConfig_1.appConfig$.value.diagnostics;
const _getValueFromInputEvent = (event) => {
    return event.pipe((0, rxjs_1.tap)((event) => console.log('event.target', event.target)), (0, rxjs_1.map)((event) => event.target.value));
};
/** @internal */
exports.borrowInput$ = new rxjs_1.BehaviorSubject('0');
/**
 * Borrow input
 * @category Input
 * */
exports.borrowInputø = exports.borrowInput$.pipe((0, rxjs_1.map)((inp) => {
    var _a;
    if (inp)
        return (0, yieldUtils_1.inputToTokenValue)(inp, (_a = observables_1.selected$.value.base) === null || _a === void 0 ? void 0 : _a.decimals);
    return utils_1.ZERO_BN;
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
exports.collateralInputø = exports.collateralInput$.pipe((0, rxjs_1.map)((inp) => {
    var _a;
    if (inp)
        return (0, yieldUtils_1.inputToTokenValue)(inp, (_a = observables_1.selected$.value.ilk) === null || _a === void 0 ? void 0 : _a.decimals);
    return utils_1.ZERO_BN;
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
exports.repayInputø = exports.repayInput$.pipe((0, rxjs_1.map)((inp) => {
    var _a;
    if (inp)
        return (0, yieldUtils_1.inputToTokenValue)(inp, (_a = observables_1.selected$.value.base) === null || _a === void 0 ? void 0 : _a.decimals);
    return utils_1.ZERO_BN;
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
exports.lendInputø = exports.lendInput$.pipe((0, rxjs_1.map)((inp) => {
    var _a;
    if (inp)
        return (0, yieldUtils_1.inputToTokenValue)(inp, (_a = observables_1.selected$.value.base) === null || _a === void 0 ? void 0 : _a.decimals);
    return utils_1.ZERO_BN;
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
exports.closeInputø = exports.closeInput$.pipe((0, rxjs_1.map)((inp) => {
    var _a;
    if (inp)
        return (0, yieldUtils_1.inputToTokenValue)(inp, (_a = observables_1.selected$.value.base) === null || _a === void 0 ? void 0 : _a.decimals);
    return utils_1.ZERO_BN;
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
exports.addLiquidityInputø = exports.addLiquidityInput$.pipe((0, rxjs_1.map)((inp) => {
    var _a;
    if (inp)
        return (0, yieldUtils_1.inputToTokenValue)(inp, (_a = observables_1.selected$.value.strategy) === null || _a === void 0 ? void 0 : _a.decimals);
    return utils_1.ZERO_BN;
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
exports.removeLiquidityInputø = exports.removeLiquidityInput$.pipe((0, rxjs_1.map)((inp) => {
    var _a;
    if (inp)
        return (0, yieldUtils_1.inputToTokenValue)(inp, (_a = observables_1.selected$.value.strategy) === null || _a === void 0 ? void 0 : _a.decimals);
    return utils_1.ZERO_BN;
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