"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maximumLendRollø = exports.lendPostionValueø = exports.lendValueAtMaturityø = exports.maximumCloseø = exports.isLendingLimitedø = exports.maximumLendø = void 0;
const ui_math_1 = require("@yield-protocol/ui-math");
const rxjs_1 = require("rxjs");
const observables_1 = require("../observables");
const utils_1 = require("../utils");
const constants_1 = require("../utils/constants");
const yieldUtils_1 = require("../utils/yieldUtils");
const input_1 = require("./input");
// TODO: apy,
/**
 * Get the maximum lendable to the protocol based on selected series
 * @category Lend
 * */
exports.maximumLendø = observables_1.selectedø.pipe((0, rxjs_1.map)(({ series, base }) => {
    if (!!series) {
        /* checks the protocol limits  (max Base allowed in ) */
        const _maxBaseIn = (0, ui_math_1.maxBaseIn)(series.baseReserves.bn, series.fyTokenReserves.bn, series.getTimeTillMaturity(), series.ts, series.g1, series.decimals);
        return (base === null || base === void 0 ? void 0 : base.balance.bn.lt(_maxBaseIn))
            ? base.balance
            : (0, yieldUtils_1.bnToW3Number)(_maxBaseIn, base === null || base === void 0 ? void 0 : base.decimals, base === null || base === void 0 ? void 0 : base.digitFormat);
    }
    /* In the odd case that no series is selected, the return zero as max lend */
    return constants_1.ZERO_W3NUMBER;
}));
/**
 * Flag indicating if lending is limited by the protocol based on both account blaance ( and possibly input? )
 * @category Lend
 * */
exports.isLendingLimitedø = (0, rxjs_1.combineLatest)([exports.maximumLendø, observables_1.selectedø]).pipe((0, rxjs_1.map)(([maxLend, { base }]) => {
    // if (input.gt(maxLend)) return true;
    if (base === null || base === void 0 ? void 0 : base.balance.bn.gt(maxLend.bn))
        return true;
    return false;
}));
/**
 * Maximum allowable when closing a lending posiiton
 * @category Lend | Close
 * */
exports.maximumCloseø = observables_1.selectedø.pipe((0, rxjs_1.map)(({ series }) => {
    var _a, _b;
    /* If the series is mature, simply sned back the fyToken value (always closable) */
    if (series && series.isMature())
        return series.fyTokenBalance;
    /* else process */
    const value = (0, ui_math_1.sellFYToken)(series.baseReserves.bn, series.fyTokenReserves.bn, ((_a = series.fyTokenBalance) === null || _a === void 0 ? void 0 : _a.bn) || utils_1.ZERO_BN, series.getTimeTillMaturity(), series.ts, series.g2, series.decimals);
    const baseReservesWithMargin = series.baseReserves.bn.mul(9999).div(10000); // TODO: figure out why we can't use the base reserves exactly (margin added to facilitate transaction)
    /* If the trade isn't possible, set the max close as total base reserves */
    if (value.lte(utils_1.ZERO_BN) && ((_b = series.fyTokenBalance) === null || _b === void 0 ? void 0 : _b.bn.gt(series.baseReserves.bn)))
        return (0, yieldUtils_1.bnToW3Number)(baseReservesWithMargin, series === null || series === void 0 ? void 0 : series.decimals);
    if (value.lte(utils_1.ZERO_BN))
        return constants_1.ZERO_W3NUMBER;
    /* else, closing is not limited so return the trade value */
    return (0, yieldUtils_1.bnToW3Number)(value, series === null || series === void 0 ? void 0 : series.decimals);
}));
/**
 * Predicted Base Value at maturity based on the [[input]] provided.
 * @category Lend
 * */
exports.lendValueAtMaturityø = (0, rxjs_1.combineLatest)([input_1.lendInputø, observables_1.selectedø]).pipe((0, rxjs_1.map)(([input, { series }]) => {
    const { baseReserves, fyTokenReserves } = series;
    const valueAtMaturity = (0, ui_math_1.sellBase)(baseReserves.bn, fyTokenReserves.bn, input.bn, series.getTimeTillMaturity(), series.ts, series.g1, series.decimals);
    return (0, yieldUtils_1.bnToW3Number)(valueAtMaturity, series === null || series === void 0 ? void 0 : series.decimals);
}));
/**
 * Get the base value of the existing lending position. i.e. the CURRENT base value of the fyTokens held by the user
 * @category Lend
 * */
exports.lendPostionValueø = observables_1.selectedø.pipe((0, rxjs_1.map)(({ series }) => {
    var _a;
    /* If the series is mature, simply send back the fyToken value (always closable) */
    if (series && series.isMature())
        return series.fyTokenBalance;
    /* else process */
    const value = (0, ui_math_1.sellFYToken)(series.baseReserves.bn, series.fyTokenReserves.bn, ((_a = series.fyTokenBalance) === null || _a === void 0 ? void 0 : _a.bn) || utils_1.ZERO_BN, series.getTimeTillMaturity(), series.ts, series.g2, series.decimals);
    // TODO: check this flow... shoudl we return ZERO. I think so, because if a trade is not possible the value IS 0.
    return value.lte(utils_1.ZERO_BN) ? constants_1.ZERO_W3NUMBER : (0, yieldUtils_1.bnToW3Number)(value, series === null || series === void 0 ? void 0 : series.decimals);
}));
/**
 * Maximum rollable base
 * @category Lend | Roll
 * */
exports.maximumLendRollø = observables_1.selectedø.pipe(
/* only do calcs if there is a future series selected */
(0, rxjs_1.filter)((selected) => !!selected.futureSeries && !!selected.series), (0, rxjs_1.map)(({ futureSeries, series }) => {
    var _a, _b;
    const _maxBaseIn = (0, ui_math_1.maxBaseIn)(futureSeries.baseReserves.bn, futureSeries.fyTokenReserves.bn, futureSeries.getTimeTillMaturity(), futureSeries.ts, futureSeries.g1, futureSeries.decimals);
    const _fyTokenValue = series.isMature()
        ? ((_a = series.fyTokenBalance) === null || _a === void 0 ? void 0 : _a.bn) || utils_1.ZERO_BN
        : (0, ui_math_1.sellFYToken)(series.baseReserves.bn, series.fyTokenReserves.bn, ((_b = series.fyTokenBalance) === null || _b === void 0 ? void 0 : _b.bn) || utils_1.ZERO_BN, series.getTimeTillMaturity(), series.ts, series.g2, series.decimals);
    /* if the protocol is limited return the max rollab as the max base in */
    if (_maxBaseIn.lte(_fyTokenValue))
        return (0, yieldUtils_1.bnToW3Number)(_maxBaseIn, series === null || series === void 0 ? void 0 : series.decimals);
    /* else */
    return (0, yieldUtils_1.bnToW3Number)(_fyTokenValue, series === null || series === void 0 ? void 0 : series.decimals);
}));
//# sourceMappingURL=lendView.js.map