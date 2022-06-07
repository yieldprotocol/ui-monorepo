"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partialRemoveReturnø = exports.isPartialRemoveRequiredø = exports.isBuyAndPoolPossibleø = exports.hasMatchingVaultø = exports.maximumRemoveLiquidityø = exports.maximumAddLiquidityø = void 0;
const rxjs_1 = require("rxjs");
const observables_1 = require("../observables");
const utils_1 = require("../utils");
const input_1 = require("./input");
// maxPool,
// poolPercentPreview,
// canBuyAndPool, // boolean
// matchingVaultExists, // boolean
// maxRemoveNoVault,  
// maxRemoveWithVault,
// partialRemoveRequired, // boolean
// removeBaseReceived,
// removeFyTokenReceived,
// removeBaseReceived_,
// removeFyTokenReceived_,
exports.maximumAddLiquidityø = (0, rxjs_1.combineLatest)([input_1.repayInputø, observables_1.selectedø]).pipe((0, rxjs_1.map)(([input, selected]) => {
    console.log(input, selected);
    return utils_1.ZERO_BN;
}));
exports.maximumRemoveLiquidityø = (0, rxjs_1.combineLatest)([input_1.repayInputø, observables_1.selectedø]).pipe((0, rxjs_1.map)(([input, selected]) => {
    console.log(input, selected);
    return utils_1.ZERO_BN;
}));
exports.hasMatchingVaultø = (0, rxjs_1.combineLatest)([input_1.repayInputø, observables_1.selectedø]).pipe((0, rxjs_1.map)(([input, selected]) => {
    console.log(input, selected);
    return false;
}));
exports.isBuyAndPoolPossibleø = (0, rxjs_1.combineLatest)([input_1.repayInputø, observables_1.selectedø]).pipe((0, rxjs_1.map)(([input, selected]) => {
    console.log(input, selected);
    return false;
}));
exports.isPartialRemoveRequiredø = (0, rxjs_1.combineLatest)([input_1.repayInputø, observables_1.selectedø]).pipe((0, rxjs_1.map)(([input, selected]) => {
    console.log(input, selected);
    return false;
}));
/**
 *
 * Indicates the amount of [0] Base and [1] fyTokens that will be returned when partially removing liquidity tokens
 *
 * */
exports.partialRemoveReturnø = (0, rxjs_1.combineLatest)([input_1.repayInputø, observables_1.selectedø]).pipe((0, rxjs_1.map)(([input, selected]) => {
    console.log(input, selected);
    return [];
}));
//# sourceMappingURL=poolView.js.map