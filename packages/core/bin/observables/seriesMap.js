"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._updateSeries = exports.updateSeries = exports.seriesMapø = exports.seriesMap$ = void 0;
const tslib_1 = require("tslib");
const rxjs_1 = require("rxjs");
const ethers_1 = require("ethers");
const ui_math_1 = require("@yield-protocol/ui-math");
const contracts = tslib_1.__importStar(require("../contracts"));
const types_1 = require("../types");
const account_1 = require("./account");
const provider_1 = require("./provider");
const yieldProtocol_1 = require("./yieldProtocol");
const assets_1 = require("../config/assets");
const messages_1 = require("./messages");
/** @internal */
exports.seriesMap$ = new rxjs_1.BehaviorSubject(new Map([]));
exports.seriesMapø = exports.seriesMap$.pipe((0, rxjs_1.share)());
/* Update series function */
const updateSeries = (seriesList, account) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const list = (seriesList === null || seriesList === void 0 ? void 0 : seriesList.length) ? seriesList : Array.from(exports.seriesMap$.value.values());
    list.map((series) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const seriesUpdate = yield (0, exports._updateSeries)(series, account);
        exports.seriesMap$.next(new Map(exports.seriesMap$.value.set(series.id, seriesUpdate))); // note: new Map to enforce ref update
    }));
});
exports.updateSeries = updateSeries;
/* Observe YieldProtocol$ changes, an update map accordingly */
yieldProtocol_1.yieldProtocol$
    .pipe((0, rxjs_1.filter)((protocol) => protocol.seriesRootMap.size > 0), (0, rxjs_1.withLatestFrom)(provider_1.provider$))
    .subscribe(([_protocol, _provider]) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    /* 'Charge' all the series (using the current provider) */
    const chargedList = Array.from(_protocol.seriesRootMap.values()).map((s) => _chargeSeries(s, _provider));
    /* Update the assets with dynamic/user data */
    yield (0, exports.updateSeries)(chargedList);
    (0, messages_1.sendMsg)({ message: 'Series Loaded', type: types_1.MessageType.INTERNAL });
}));
/* Observe provider$ changes, and update map accordingly ('charge assets/series' with live contracts & listeners ) */
// provider$.pipe(withLatestFrom(seriesMap$)).subscribe(([provider, seriesMap]) => {
//   console.log('Series map updated' ) // [provider, seriesMap]);
// });
/* Observe Account$ changes ('update dynamic/User Data') */
account_1.account$.pipe((0, rxjs_1.withLatestFrom)(exports.seriesMap$)).subscribe(([account]) => {
    console.log('account changed:', account);
});
/**
 * Internal Functions
 * */
/* Add on extra/calculated SERIES info, contract instances and methods (no async calls) */
const _chargeSeries = (series, provider) => {
    /* contracts need to be added in again in when charging because the cached state only holds strings */
    const poolContract = contracts.Pool__factory.connect(series.poolAddress, provider);
    const fyTokenContract = contracts.FYToken__factory.connect(series.fyTokenAddress, provider);
    return Object.assign(Object.assign({}, series), { poolContract,
        fyTokenContract, 
        /* attach the various built-in functions required (can't be cached yet)  */
        getTimeTillMaturity: () => series.maturity - Math.round(new Date().getTime() / 1000), isMature: () => series.maturity - Math.round(new Date().getTime() / 1000) <= 0, 
        /* pre-set the allowance fns */
        getFyTokenAllowance: (acc, spender) => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return fyTokenContract.allowance(acc, spender); }), getPoolAllowance: (acc, spender) => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return poolContract.allowance(acc, spender); }) });
};
/**
 * Dynamic asset info not related to a user
 * */
const _updateSeries = (series, account) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    /* Get all the data simultanenously in a promise.all */
    const [baseReserves, fyTokenReserves, totalSupply, fyTokenRealReserves] = yield Promise.all([
        series.poolContract.getBaseBalance(),
        series.poolContract.getFYTokenBalance(),
        series.poolContract.totalSupply(),
        series.fyTokenContract.balanceOf(series.poolAddress),
    ]);
    const rateCheckAmount = ethers_1.ethers.utils.parseUnits(assets_1.ETH_BASED_ASSETS.includes(series.baseId) ? '.001' : '1', series.decimals);
    /* Calculates the base/fyToken unit selling price */
    const _sellRate = (0, ui_math_1.sellFYToken)(baseReserves, fyTokenReserves, rateCheckAmount, (0, ui_math_1.secondsToFrom)(series.maturity.toString()), series.ts, series.g2, series.decimals);
    const apr = (0, ui_math_1.calculateAPR)((0, ui_math_1.floorDecimal)(_sellRate), rateCheckAmount, series.maturity) || '0';
    /* Setup users asset info if there is an account */
    let accountData = {};
    if (account) {
        const [poolTokens, fyTokenBalance] = yield Promise.all([
            series.poolContract.balanceOf(account),
            series.fyTokenContract.balanceOf(account),
        ]);
        const poolPercent = (0, ui_math_1.mulDecimal)((0, ui_math_1.divDecimal)(poolTokens, totalSupply), '100');
        accountData = Object.assign(Object.assign({}, series), { poolTokens,
            fyTokenBalance, poolTokens_: ethers_1.ethers.utils.formatUnits(poolTokens, series.decimals), fyTokenBalance_: ethers_1.ethers.utils.formatUnits(fyTokenBalance, series.decimals), poolPercent });
    }
    return Object.assign(Object.assign(Object.assign({}, series), { baseReserves, baseReserves_: ethers_1.ethers.utils.formatUnits(baseReserves, series.decimals), fyTokenReserves,
        fyTokenRealReserves,
        totalSupply, totalSupply_: ethers_1.ethers.utils.formatUnits(totalSupply, series.decimals), apr: `${Number(apr).toFixed(2)}` }), accountData);
});
exports._updateSeries = _updateSeries;
//# sourceMappingURL=seriesMap.js.map