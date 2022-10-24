"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectStrategy = exports.selectVault = exports.selectSeries = exports.selectIlk = exports.selectBase = exports.selectedø = void 0;
const tslib_1 = require("tslib");
const rxjs_1 = require("rxjs");
const assetsConfig_1 = require("../config/assetsConfig");
const appConfig_1 = require("./appConfig");
const assets_1 = require("./assets");
const messages_1 = require("./messages");
const series_1 = require("./series");
const strategies_1 = require("./strategies");
const vaults_1 = require("./vaults");
const initSelection = {
    base: null,
    ilk: null,
    series: null,
    futureSeries: null,
    vault: null,
    strategy: null,
};
const selected$ = new rxjs_1.BehaviorSubject(initSelection);
exports.selectedø = selected$.pipe((0, rxjs_1.shareReplay)(1));
/**
 * Set first of array as default series(base gets automatically selected based on the series choice,
 * this automatically selects the base)
 * */
messages_1.internalMessagesø
    .pipe((0, rxjs_1.filter)((messages) => messages.has('seriesLoaded')), (0, rxjs_1.take)(1), // only take one for first load
(0, rxjs_1.withLatestFrom)(series_1.seriesø, appConfig_1.appConfigø))
    .subscribe(([, series, appConfig]) => {
    const nonMatureSeries = Array.from(series.values()).filter((s) => !s.isMature());
    (0, exports.selectSeries)(appConfig.defaultSeriesId || nonMatureSeries[0]);
});
/**
 * Set the selected Ilk once on load (either )
 * TODO: add the selected Ilk preference to the the default app config.
 * */
messages_1.internalMessagesø
    .pipe((0, rxjs_1.filter)((messages) => messages.has('assetsLoaded')), (0, rxjs_1.take)(1) // only take one for first load
// withLatestFrom(assetsø, appConfigø)
)
    .subscribe(([]) => {
    (0, exports.selectIlk)(assetsConfig_1.WETH);
});
/**
 *  Functions to selecting elements
 */
const selectBase = (asset) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const assetMap = yield (0, rxjs_1.lastValueFrom)(assets_1.assetsø.pipe((0, rxjs_1.first)()));
    const seriesMap = yield (0, rxjs_1.lastValueFrom)(series_1.seriesø.pipe((0, rxjs_1.first)()));
    const base = (asset === null || asset === void 0 ? void 0 : asset.id) ? asset : assetMap.get(asset);
    /* only switch the base if the asset in question is a valid YIELD base */
    if (!(base === null || base === void 0 ? void 0 : base.isYieldBase)) {
        (0, messages_1.sendMsg)({ message: 'Not a Yield base asset' });
    }
    else {
        /* Update the selected$ */
        selected$.next(Object.assign(Object.assign({}, selected$.value), { base: base || null, 
            /* if a base is selected, then auto select the first 'mature' series that has that base */
            series: [...seriesMap.values()].find((s) => s.baseId === base.id && !s.isMature()) || null }));
        console.log(base ? `Selected Base: ${base.id}` : 'Bases unselected');
    }
});
exports.selectBase = selectBase;
const selectIlk = (asset) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const assetMap = yield (0, rxjs_1.lastValueFrom)(assets_1.assetsø.pipe((0, rxjs_1.first)()));
    const ilk = (asset === null || asset === void 0 ? void 0 : asset.id) ? asset : assetMap.get(asset);
    /* Update the selected$ */
    selected$.next(Object.assign(Object.assign({}, selected$.value), { ilk: ilk || null }));
    console.log(ilk ? `Selected Ilk: ${ilk.id}` : 'Ilks unselected');
});
exports.selectIlk = selectIlk;
const selectSeries = (series, futureSeries = false) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const assetMap = yield (0, rxjs_1.lastValueFrom)(assets_1.assetsø.pipe((0, rxjs_1.first)()));
    const seriesMap = yield (0, rxjs_1.lastValueFrom)(series_1.seriesø.pipe((0, rxjs_1.first)()));
    /* Try to get the series if argument is a string */
    const _series = (series === null || series === void 0 ? void 0 : series.id) ? series : seriesMap.get(series);
    /* Update the selected$  (either series or futureSeries) */
    futureSeries
        ? selected$.next(Object.assign(Object.assign({}, selected$.value), { futureSeries: _series || null }))
        : selected$.next(Object.assign(Object.assign({}, selected$.value), { series: _series || null, 
            /* Ensure the selectBase always matches the selected series */
            base: assetMap.get(_series.baseId) || selected$.value.base }));
    /* log to console */
    console.log(_series
        ? `Selected ${futureSeries ? '' : 'future '} Series: ${_series.id}`
        : `${futureSeries ? '' : 'future '} Series unselected`);
});
exports.selectSeries = selectSeries;
const selectVault = (vault) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const assetMap = yield (0, rxjs_1.lastValueFrom)(assets_1.assetsø.pipe((0, rxjs_1.first)()));
    const seriesMap = yield (0, rxjs_1.lastValueFrom)(series_1.seriesø.pipe((0, rxjs_1.first)()));
    const vaultMap = yield (0, rxjs_1.lastValueFrom)(vaults_1.vaultsø.pipe((0, rxjs_1.first)()));
    if (vault) {
        const _vault = vault.id ? vault : vaultMap.get(vault);
        /* Update the selected$ */
        selected$.next(Object.assign(Object.assign({}, selected$.value), { vault: _vault || null, 
            /* Ensure the other releant components match the vault */
            base: assetMap.get(_vault.baseId) || selected$.value.base, ilk: assetMap.get(_vault.ilkId) || selected$.value.ilk, series: seriesMap.get(_vault.seriesId) || selected$.value.series }));
    }
    /* if undefined sent in, deselect vault only */
    !vault && selected$.next(Object.assign(Object.assign({}, selected$.value), { vault: null }));
    console.log(vault ? `Selected Vault: ${(vault === null || vault === void 0 ? void 0 : vault.id) || vault}` : 'Vault Unselected');
});
exports.selectVault = selectVault;
const selectStrategy = (strategy) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (strategy) {
        const assetMap = yield (0, rxjs_1.lastValueFrom)(assets_1.assetsø.pipe((0, rxjs_1.first)()));
        const seriesMap = yield (0, rxjs_1.lastValueFrom)(series_1.seriesø.pipe((0, rxjs_1.first)()));
        const strategyMap = yield (0, rxjs_1.lastValueFrom)(strategies_1.strategiesø.pipe((0, rxjs_1.first)()));
        const _strategy = strategy.id ? strategy : strategyMap.get(strategy);
        /* Update the selected$ */
        selected$.next(Object.assign(Object.assign({}, selected$.value), { strategy: _strategy || null, 
            /* Ensure the other releant components match the vault */
            base: assetMap.get(_strategy.baseId) || selected$.value.base, series: seriesMap.get(_strategy.currentSeriesId) || selected$.value.series }));
    }
    /* if undefined sent in, deselect vault only */
    !strategy && selected$.next(Object.assign(Object.assign({}, selected$.value), { vault: null }));
    console.log(strategy ? `Selected Strategy: ${(strategy === null || strategy === void 0 ? void 0 : strategy.id) || strategy}` : 'Vaults unselected');
});
exports.selectStrategy = selectStrategy;
/* Watch the selected base id make sure they match the strategy, if not, unselect the strategy */
// selectedø
// .pipe(
//   filter((selected) => !!selected.strategy)
// )
// .subscribe(
//   (selected) => {
//     selected.base?.id !== selected.strategy?.baseId && selected$.next({ ...selected$.value, strategy: null});
//   }
// );
//# sourceMappingURL=selected.js.map