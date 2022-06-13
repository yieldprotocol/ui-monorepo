"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStrategies = exports.strategyMapø = exports.strategyMap$ = void 0;
const tslib_1 = require("tslib");
const rxjs_1 = require("rxjs");
const ethers_1 = require("ethers");
const ui_math_1 = require("@yield-protocol/ui-math");
const contracts = tslib_1.__importStar(require("../contracts"));
const types_1 = require("../types");
const connection_1 = require("./connection");
const yieldProtocol_1 = require("./yieldProtocol");
const seriesMap_1 = require("./seriesMap");
const constants_1 = require("../utils/constants");
const messages_1 = require("./messages");
/** @internal */
exports.strategyMap$ = new rxjs_1.BehaviorSubject(new Map([]));
exports.strategyMapø = exports.strategyMap$.pipe((0, rxjs_1.share)());
/* Update strategies function */
const updateStrategies = (strategyList) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const list = (strategyList === null || strategyList === void 0 ? void 0 : strategyList.length) ? strategyList : Array.from(exports.strategyMap$.value.values());
    list.map((_strategy) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const strategyUpdate = yield _updateStrategy(_strategy, seriesMap_1.seriesMap$.value, connection_1.account$.value);
        exports.strategyMap$.next(new Map(exports.strategyMap$.value.set(_strategy.id, strategyUpdate))); // note: new Map to enforce ref update
    }));
});
exports.updateStrategies = updateStrategies;
/* Observe YieldProtocolø changes, and update map accordingly */
yieldProtocol_1.yieldProtocolø
    .pipe((0, rxjs_1.filter)((protocol) => protocol.strategyRootMap.size > 0), (0, rxjs_1.withLatestFrom)(connection_1.providerø))
    .subscribe(([_protocol, _provider]) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    /* 'Charge' all the assets (using the current provider) */
    const chargedList = Array.from(_protocol.strategyRootMap.values()).map((st) => _chargeStrategy(st, _provider));
    /* Update the assets with dynamic/user data */
    yield (0, exports.updateStrategies)(chargedList);
    (0, messages_1.sendMsg)({ message: 'Strategies Loaded.', type: types_1.MessageType.INTERNAL });
    (0, messages_1.sendMsg)({ message: 'Protocol Ready...', type: types_1.MessageType.INTERNAL, id: 'protocolLoaded' });
}));
/* Observe providerø changes, and update map accordingly ('charge assets/series' with live contracts & listeners ) */
// providerø
// .pipe(withLatestFrom(strategyMap$))
// .subscribe(([provider, seriesMap] ) => {
//   console.log( [provider, seriesMap] )
// })
// /* Observe Account$ changes ('update dynamic/User Data') */
// account$
// .pipe(withLatestFrom(strategyMap$))
// .subscribe( ([account ]) => {
//   console.log( 'account changed:', account )
// })
/* Add on extra/calculated Strategy info, contract instances and methods (no async calls) */
const _chargeStrategy = (strategy, provider) => {
    const _strategy = contracts.Strategy__factory.connect(strategy.address, provider);
    return Object.assign(Object.assign({}, strategy), { strategyContract: _strategy, getAllowance: (acc, spender) => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return _strategy.allowance(acc, spender); }) });
};
const _updateStrategy = (strategy, seriesMap, account) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    /* Dynamic strategy info ( not related to a user ) */
    /* Get all the data simultanenously in a promise.all */
    const [strategyTotalSupply, currentSeriesId, currentPoolAddr, nextSeriesId] = yield Promise.all([
        strategy.strategyContract.totalSupply(),
        strategy.strategyContract.seriesId(),
        strategy.strategyContract.pool(),
        strategy.strategyContract.nextSeriesId(),
    ]);
    const currentSeries = seriesMap.get(currentSeriesId);
    const nextSeries = seriesMap.get(nextSeriesId);
    /* Init supplys and balances as zero unless htere is a currnet series */
    let [poolTotalSupply, strategyPoolBalance, currentInvariant, initInvariant] = [constants_1.ZERO_BN, constants_1.ZERO_BN, constants_1.ZERO_BN, constants_1.ZERO_BN];
    if (currentSeries) {
        [poolTotalSupply, strategyPoolBalance] = yield Promise.all([
            currentSeries.poolContract.totalSupply(),
            currentSeries.poolContract.balanceOf(strategy.address),
        ]);
        [currentInvariant, initInvariant] = currentSeries.isMature() ? [constants_1.ZERO_BN, constants_1.ZERO_BN] : [constants_1.ZERO_BN, constants_1.ZERO_BN];
        // strategyPoolPercent = mulDecimal(divDecimal(strategyPoolBalance, poolTotalSupply), '100');
    }
    const returnRate = currentInvariant && currentInvariant.sub(initInvariant);
    /* User strategy info */
    let accountData = {};
    if (account) {
        const [accountBalance, accountPoolBalance] = yield Promise.all([
            strategy.strategyContract.balanceOf(account),
            currentSeries === null || currentSeries === void 0 ? void 0 : currentSeries.poolContract.balanceOf(account),
        ]);
        const accountStrategyPercent = (0, ui_math_1.mulDecimal)((0, ui_math_1.divDecimal)(accountBalance, strategyTotalSupply || '0'), '100');
        accountData = Object.assign(Object.assign({}, strategy), { accountBalance, accountBalance_: ethers_1.ethers.utils.formatUnits(accountBalance, strategy.decimals), accountPoolBalance,
            accountStrategyPercent });
    }
    return Object.assign(Object.assign(Object.assign({}, strategy), { strategyTotalSupply, strategyTotalSupply_: ethers_1.ethers.utils.formatUnits(strategyTotalSupply, strategy.decimals), poolTotalSupply, poolTotalSupply_: ethers_1.ethers.utils.formatUnits(poolTotalSupply, strategy.decimals), strategyPoolBalance, strategyPoolBalance_: ethers_1.ethers.utils.formatUnits(strategyPoolBalance, strategy.decimals), currentSeriesId,
        currentPoolAddr,
        nextSeriesId,
        currentSeries,
        nextSeries, initInvariant: initInvariant || ethers_1.BigNumber.from('0'), currentInvariant: currentInvariant || ethers_1.BigNumber.from('0'), returnRate, returnRate_: returnRate.toString(), active: true }), accountData);
});
//# sourceMappingURL=strategyMap.js.map