"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maximumLendRollø = exports.lendPostionValueø = exports.lendValueAtMaturityø = exports.maximumCloseø = exports.isLendingLimitedø = exports.maximumLendø = void 0;
const ui_math_1 = require("@yield-protocol/ui-math");
const rxjs_1 = require("rxjs");
const observables_1 = require("../observables");
const utils_1 = require("../utils");
const input_1 = require("./input");
// TODO: apy,
/**
 * Get the maximum lendable to the protocol based on selected series
 * @category Lend
 * */
exports.maximumLendø = observables_1.selectedø.pipe((0, rxjs_1.map)(({ series, base }) => {
    if (!!series) {
        /* checks the protocol limits  (max Base allowed in ) */
        const _maxBaseIn = (0, ui_math_1.maxBaseIn)(series.baseReserves, series.fyTokenReserves, series.getTimeTillMaturity(), series.ts, series.g1, series.decimals);
        return (base === null || base === void 0 ? void 0 : base.balance.lt(_maxBaseIn)) ? base.balance : _maxBaseIn;
    }
    /* In the odd case that no series is selected, the return zero as max lend */
    return utils_1.ZERO_BN;
}));
/**
 * Flag indicating if lending is limited by the protocol based on both account blaance ( and possibly input? )
 * @category Lend
 * */
exports.isLendingLimitedø = (0, rxjs_1.combineLatest)([exports.maximumLendø, observables_1.selectedø]).pipe((0, rxjs_1.map)(([maxLend, { base }]) => {
    // if (input.gt(maxLend)) return true;
    if (base === null || base === void 0 ? void 0 : base.balance.gt(maxLend))
        return true;
    return false;
}));
/**
 * Maximum allowable when closing a lending posiiton
 * @category Lend | Close
 * */
exports.maximumCloseø = observables_1.selectedø.pipe((0, rxjs_1.map)(({ series }) => {
    var _a;
    /* If the series is mature, simply sned back the fyToken value (always closable) */
    if (series && series.isMature())
        return series.fyTokenBalance;
    /* else process */
    const value = (0, ui_math_1.sellFYToken)(series.baseReserves, series.fyTokenReserves, series.fyTokenBalance || utils_1.ZERO_BN, series.getTimeTillMaturity(), series.ts, series.g2, series.decimals);
    const baseReservesWithMargin = series.baseReserves.mul(9999).div(10000); // TODO: figure out why we can't use the base reserves exactly (margin added to facilitate transaction)
    /* If the trade isn't possible, set the max close as total base reserves */
    if (value.lte(utils_1.ZERO_BN) && ((_a = series.fyTokenBalance) === null || _a === void 0 ? void 0 : _a.gt(series.baseReserves)))
        return baseReservesWithMargin;
    if (value.lte(utils_1.ZERO_BN))
        return utils_1.ZERO_BN;
    /* else, closing is not limited so return the trade value */
    return value;
}));
/**
 * Predicted Base Value at maturity based on the [[input]] provided.
 * @category Lend
 * */
exports.lendValueAtMaturityø = (0, rxjs_1.combineLatest)([input_1.lendInputø, observables_1.selectedø]).pipe((0, rxjs_1.map)(([input, { series }]) => {
    const { baseReserves, fyTokenReserves } = series;
    const valueAtMaturity = (0, ui_math_1.sellBase)(baseReserves, fyTokenReserves, input, series.getTimeTillMaturity(), series.ts, series.g1, series.decimals);
    return valueAtMaturity;
}));
/**
 * Get the base value of the existing lending position. i.e. the CURRENT base value of the fyTokens held by the user
 * @category Lend
 * */
exports.lendPostionValueø = observables_1.selectedø.pipe((0, rxjs_1.map)(({ series }) => {
    /* If the series is mature, simply send back the fyToken value (always closable) */
    if (series && series.isMature())
        return series.fyTokenBalance;
    /* else process */
    const value = (0, ui_math_1.sellFYToken)(series.baseReserves, series.fyTokenReserves, series.fyTokenBalance || utils_1.ZERO_BN, series.getTimeTillMaturity(), series.ts, series.g2, series.decimals);
    // TODO: check this flow... shoudl we return ZERO. I think so, because if a trade is not possible the value IS 0.
    return value.lte(utils_1.ZERO_BN) ? utils_1.ZERO_BN : value;
}));
/**
 * Maximum rollable base
 * @category Lend | Roll
 * */
exports.maximumLendRollø = observables_1.selectedø.pipe(
/* only do calcs if there is a future series selected */
(0, rxjs_1.filter)((selected) => !!selected.futureSeries && !!selected.series), (0, rxjs_1.map)(({ futureSeries, series }) => {
    const _maxBaseIn = (0, ui_math_1.maxBaseIn)(futureSeries.baseReserves, futureSeries.fyTokenReserves, futureSeries.getTimeTillMaturity(), futureSeries.ts, futureSeries.g1, futureSeries.decimals);
    const _fyTokenValue = series.isMature()
        ? series.fyTokenBalance || utils_1.ZERO_BN
        : (0, ui_math_1.sellFYToken)(series.baseReserves, series.fyTokenReserves, series.fyTokenBalance || utils_1.ZERO_BN, series.getTimeTillMaturity(), series.ts, series.g2, series.decimals);
    /* if the protocol is limited return the max rollab as the max base in */
    if (_maxBaseIn.lte(_fyTokenValue))
        return _maxBaseIn;
    /* else */
    return _fyTokenValue;
}));
//# sourceMappingURL=lendView.js.map