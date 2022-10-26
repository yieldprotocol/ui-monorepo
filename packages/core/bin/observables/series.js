"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSeries = exports.seriesø = void 0;
const tslib_1 = require("tslib");
const rxjs_1 = require("rxjs");
const ethers_1 = require("ethers");
const ui_math_1 = require("@yield-protocol/ui-math");
const contracts = tslib_1.__importStar(require("@yield-protocol/ui-contracts"));
const types_1 = require("../types");
const connection_1 = require("./connection");
const protocol_1 = require("./protocol");
const assetsConfig_1 = require("../config/assetsConfig");
const messages_1 = require("./messages");
const yieldUtils_1 = require("../utils/yieldUtils");
const seriesMap$ = new rxjs_1.BehaviorSubject(new Map([]));
/**
 * SeriesMap observable and update function.
 */
exports.seriesø = seriesMap$.pipe((0, rxjs_1.shareReplay)(1));
const updateSeries = (seriesList, account, accountDataOnly = false) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const list = (seriesList === null || seriesList === void 0 ? void 0 : seriesList.length) ? seriesList : Array.from(seriesMap$.value.values());
    yield Promise.all(list.map((series) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        /* if account data only, just return the series */
        const seriesUpdate = accountDataOnly ? series : yield _updateDynamicInfo(series);
        /* if account provided, append account data */
        const seriesUpdateAll = account ? yield _updateAccountInfo(seriesUpdate, account) : seriesUpdate;
        seriesMap$.next(new Map(seriesMap$.value.set(series.id, seriesUpdateAll))); // note: new Map to enforce ref update
    })));
});
exports.updateSeries = updateSeries;
/**
 * Observe protocolø changes, if protocol changes in any way, update series map accordingly
 * */
(0, rxjs_1.combineLatest)([protocol_1.protocolø, connection_1.providerø])
    .pipe((0, rxjs_1.filter)(([protocol]) => protocol.seriesRootMap.size > 0), (0, rxjs_1.withLatestFrom)(connection_1.accountø))
    .subscribe(([[_protocol, _provider], _account]) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    /* 'Charge' all the series (using the current provider) */
    const chargedList = Array.from(_protocol.seriesRootMap.values()).map((s) => _chargeSeries(s, _provider));
    /* Update the series with dynamic/user data */
    yield (0, exports.updateSeries)(chargedList, _account);
    console.log('Series loading complete.');
    (0, messages_1.sendMsg)({ message: 'Series Loaded.', type: types_1.MessageType.INTERNAL, id: 'seriesLoaded' });
}));
/**
 * Observe Accountø changes ('update dynamic/User Data')
 * */
connection_1.accountø.pipe((0, rxjs_1.withLatestFrom)(exports.seriesø)).subscribe(([account, seriesMap]) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (account && seriesMap.size) {
        yield (0, exports.updateSeries)(Array.from(seriesMap.values()), account, true);
        console.log('Series updated with new account info.');
        (0, messages_1.sendMsg)({ message: 'Series account info updated.', type: types_1.MessageType.INTERNAL, origin: 'seriesMap' });
    }
}));
// /**
//  * Set some event listeners on the fytoken contract for the account
//  * */
//  combineLatest([protocolø, accountø ]).subscribe(([protocol, account] ) => {
//   if ( account ) {
//     /* subscribe for updates */ 
//       console.log( 'Adding in lisneter here', protocol.seriesRootMap )
//   // } else if ( seriesMap.size > 0  ) {
//   //   /* unsubscribe */
//   //   console.log( 'removing lisneter here ')
//   } else {
//     console.log( 'asdasd')
//   }
//  })
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
 *
 * */
const _updateDynamicInfo = (series) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    /* Get all the data simultanenously in a promise.all */
    const [baseReserves, fyTokenReserves, totalSupply, fyTokenRealReserves] = yield Promise.all([
        series.poolContract.getBaseBalance(),
        series.poolContract.getFYTokenBalance(),
        series.poolContract.totalSupply(),
        series.fyTokenContract.balanceOf(series.poolAddress),
    ]);
    const rateCheckAmount = ethers_1.ethers.utils.parseUnits(assetsConfig_1.ETH_BASED_ASSETS.includes(series.baseId) ? '.001' : '1', series.decimals);
    /* Calculates the base/fyToken unit selling price */
    const _sellRate = (0, ui_math_1.sellFYToken)(baseReserves, fyTokenReserves, rateCheckAmount, (0, ui_math_1.secondsToFrom)(series.maturity.toString()), series.ts, series.g2, series.decimals);
    const apr = (0, ui_math_1.calculateAPR)((0, ui_math_1.floorDecimal)(_sellRate), rateCheckAmount, series.maturity) || '0';
    return Object.assign(Object.assign({}, series), { baseReserves: (0, yieldUtils_1.bnToW3bNumber)(baseReserves, series.decimals), fyTokenReserves: (0, yieldUtils_1.bnToW3bNumber)(fyTokenReserves, series.decimals), fyTokenRealReserves: (0, yieldUtils_1.bnToW3bNumber)(fyTokenRealReserves, series.decimals), totalSupply: (0, yieldUtils_1.bnToW3bNumber)(totalSupply, series.decimals), apr: `${Number(apr).toFixed(2)}` });
});
/**
 *
 * Dynamic series info with a user
 *
 * */
const _updateAccountInfo = (series, account) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    /* Get all the data simultanenously in a promise.all */
    const [poolTokens, fyTokenBalance] = yield Promise.all([
        series.poolContract.balanceOf(account),
        series.fyTokenContract.balanceOf(account),
    ]);
    const poolPercent = (0, ui_math_1.mulDecimal)((0, ui_math_1.divDecimal)(poolTokens, series.totalSupply.big), '100');
    return Object.assign(Object.assign({}, series), { poolTokens: (0, yieldUtils_1.bnToW3bNumber)(poolTokens, series.decimals), fyTokenBalance: (0, yieldUtils_1.bnToW3bNumber)(fyTokenBalance, series.decimals), poolPercent });
});
//# sourceMappingURL=series.js.map