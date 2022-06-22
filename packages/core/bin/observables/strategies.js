"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStrategies = exports.strategiesø = void 0;
const tslib_1 = require("tslib");
const rxjs_1 = require("rxjs");
const ethers_1 = require("ethers");
const ui_math_1 = require("@yield-protocol/ui-math");
const contracts = tslib_1.__importStar(require("../contracts"));
const types_1 = require("../types");
const connection_1 = require("./connection");
const yieldProtocol_1 = require("./yieldProtocol");
const constants_1 = require("../utils/constants");
const messages_1 = require("./messages");
const yieldUtils_1 = require("../utils/yieldUtils");
const strategyMap$ = new rxjs_1.BehaviorSubject(new Map([]));
exports.strategiesø = strategyMap$.pipe((0, rxjs_1.shareReplay)(1));
/* Update strategies function */
const updateStrategies = (provider, strategyList, account, accountDataOnly = false) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    /* If strategyList parameter is empty/undefined, update all the straetegies in the strategyMap */
    const list = (strategyList === null || strategyList === void 0 ? void 0 : strategyList.length) ? strategyList : Array.from(strategyMap$.value.values());
    yield Promise.all(list.map((strategy) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        /* if account data only, just return the strategy */
        const strategyUpdate = accountDataOnly ? strategy : yield _updateInfo(strategy, provider);
        /* if account provided, append account data */
        const strategyUpdateAll = account ? yield _updateAccountInfo(strategyUpdate, account) : strategyUpdate;
        strategyMap$.next(new Map(strategyMap$.value.set(strategy.id, strategyUpdateAll))); // note: new Map to enforce ref update
    })));
});
exports.updateStrategies = updateStrategies;
/* Observe YieldProtocolø changes, and update map accordingly */
yieldProtocol_1.yieldProtocolø
    .pipe((0, rxjs_1.filter)((protocol) => protocol.strategyRootMap.size > 0), (0, rxjs_1.withLatestFrom)(connection_1.providerø, connection_1.accountø))
    .subscribe(([_protocol, _provider, _account]) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    /* 'Charge' all the assets (using the current provider) */
    const chargedList = Array.from(_protocol.strategyRootMap.values()).map((st) => _chargeStrategy(st, _provider));
    /* Update the assets with dynamic/user data */
    yield (0, exports.updateStrategies)(_provider, chargedList, _account);
    console.log('Strategy loading complete.');
    (0, messages_1.sendMsg)({ message: 'Strategies Loaded.', type: types_1.MessageType.INTERNAL, id: 'strategiesLoaded' });
}));
/**
 * Observe Account$ changes ('update dynamic/User Data')
 * */
connection_1.accountø.pipe((0, rxjs_1.withLatestFrom)(exports.strategiesø, connection_1.providerø)).subscribe(([account, stratMap, provider]) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (account && stratMap.size) {
        yield (0, exports.updateStrategies)(provider, Array.from(stratMap.values()), account, true);
        console.log('Strategies updated with new account info.');
    }
}));
/* Add on extra/calculated Strategy info, contract instances and methods (no async calls) */
const _chargeStrategy = (strategy, provider) => {
    const _strategy = contracts.Strategy__factory.connect(strategy.address, provider);
    return Object.assign(Object.assign({}, strategy), { strategyContract: _strategy, getAllowance: (acc, spender) => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return _strategy.allowance(acc, spender); }) });
};
const _updateInfo = (strategy, provider // TODO: this provider is a pimple, but required :(
) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    /**
     * Dynamic strategy info ( not related to a user )
     * */
    /* Get all the data simultanenously in a promise.all */
    const [strategyTotalSupply, currentSeriesId, currentPoolAddr, nextSeriesId] = yield Promise.all([
        strategy.strategyContract.totalSupply(),
        strategy.strategyContract.seriesId(),
        strategy.strategyContract.pool(),
        strategy.strategyContract.nextSeriesId(),
    ]);
    const strategyPoolContract = contracts.Pool__factory.connect(currentPoolAddr, provider);
    /* Init supplys and balances as zero unless htere is a currnet series */
    let [poolTotalSupply, strategyPoolBalance, currentInvariant, initInvariant] = [constants_1.ZERO_BN, constants_1.ZERO_BN, constants_1.ZERO_BN, constants_1.ZERO_BN];
    [poolTotalSupply, strategyPoolBalance] = yield Promise.all([
        strategyPoolContract.totalSupply(),
        strategyPoolContract.balanceOf(strategy.address),
    ]);
    // [currentInvariant, initInvariant] = currentSeries.isMature() ? [ZERO_BN, ZERO_BN] : [ZERO_BN, ZERO_BN];
    // strategyPoolPercent = mulDecimal(divDecimal(strategyPoolBalance, poolTotalSupply), '100');
    const returnRate = currentInvariant && currentInvariant.sub(initInvariant);
    return Object.assign(Object.assign({}, strategy), { strategyTotalSupply: (0, yieldUtils_1.bnToW3Number)(strategyTotalSupply, strategy.decimals), strategyPoolContract, strategyPoolBalance: (0, yieldUtils_1.bnToW3Number)(strategyPoolBalance, strategy.decimals), currentSeriesId,
        currentPoolAddr,
        nextSeriesId, initInvariant: initInvariant || ethers_1.BigNumber.from('0'), currentInvariant: currentInvariant || ethers_1.BigNumber.from('0'), returnRate: (0, yieldUtils_1.bnToW3Number)(returnRate, strategy.decimals), active: true });
});
/**
 *
 * Dynamic strategy info with a user
 *
 * */
const _updateAccountInfo = (strategy, account) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    /* Get all the data simultanenously in a promise.all */
    const [accountBalance, accountPoolBalance] = yield Promise.all([
        strategy.strategyContract.balanceOf(account),
        ((_a = strategy.strategyPoolContract) === null || _a === void 0 ? void 0 : _a.balanceOf(account)) || constants_1.ZERO_BN,
    ]);
    const accountStrategyPercent = (0, ui_math_1.mulDecimal)((0, ui_math_1.divDecimal)(accountBalance, ((_b = strategy.strategyTotalSupply) === null || _b === void 0 ? void 0 : _b.bn) || '0'), '100');
    return Object.assign(Object.assign({}, strategy), { accountBalance: (0, yieldUtils_1.bnToW3Number)(accountBalance, strategy.decimals), accountPoolBalance: (0, yieldUtils_1.bnToW3Number)(accountPoolBalance, strategy.decimals), accountStrategyPercent });
});
//# sourceMappingURL=strategies.js.map