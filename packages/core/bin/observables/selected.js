"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectStrategy = exports.selectVault = exports.selectSeries = exports.selectIlk = exports.selectBase = exports.selectedø = exports.selected$ = void 0;
const rxjs_1 = require("rxjs");
const assets_1 = require("../config/assets");
const appConfig_1 = require("./appConfig");
const assets_2 = require("./assets");
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
/** @internal */
exports.selected$ = new rxjs_1.BehaviorSubject(initSelection);
exports.selectedø = exports.selected$.pipe((0, rxjs_1.shareReplay)(1));
/**
 * Set first of array as default series(base gets automatically selected based on the series choice,
 * this automatically selects the base)
 * */
messages_1.internalMessagesø.pipe((0, rxjs_1.filter)((messages) => messages.has('seriesLoaded')), (0, rxjs_1.take)(1), // only take one for first load
(0, rxjs_1.withLatestFrom)(series_1.seriesø, appConfig_1.appConfigø)).subscribe(([, [sMap], appConfig]) => {
    (0, exports.selectSeries)(appConfig.defaultSeriesId || [...sMap][0]);
});
/**
 * Set the selected Ilk once on load (either )
 * TODO: add the selected Ilk preference to the the default app config.
 * */
messages_1.internalMessagesø.pipe((0, rxjs_1.filter)((messages) => messages.has('assetsLoaded')), (0, rxjs_1.take)(1)).subscribe(([]) => {
    (0, exports.selectIlk)(assets_1.WETH);
});
/**
 *  Functions to selecting elements
 */
const selectBase = (asset) => {
    const base = (asset === null || asset === void 0 ? void 0 : asset.id) ? asset : assets_2.assetMap$.value.get(asset);
    /* only switch the base if the asset in question is a valid YIELD base */
    if (!(base === null || base === void 0 ? void 0 : base.isYieldBase)) {
        (0, messages_1.sendMsg)({ message: 'Not a Yield base asset' });
    }
    else {
        /* Update the selected$ */
        exports.selected$.next(Object.assign(Object.assign({}, exports.selected$.value), { base: base || null, 
            /* if a base is selected, then auto select the first 'mature' series that has that base */
            series: [...series_1.seriesMap$.value.values()].find((s) => s.baseId === base.id && !s.isMature()) || null }));
        console.log(base ? `Selected Base: ${base.id}` : 'Bases unselected');
    }
};
exports.selectBase = selectBase;
const selectIlk = (asset) => {
    const ilk = (asset === null || asset === void 0 ? void 0 : asset.id) ? asset : assets_2.assetMap$.value.get(asset);
    /* Update the selected$ */
    exports.selected$.next(Object.assign(Object.assign({}, exports.selected$.value), { ilk: ilk || null }));
    console.log(ilk ? `Selected Ilk: ${ilk.id}` : 'Ilks unselected');
};
exports.selectIlk = selectIlk;
const selectSeries = (series, futureSeries = false) => {
    /* Try to get the series if argument is a string */
    const _series = (series === null || series === void 0 ? void 0 : series.id) ? series : series_1.seriesMap$.value.get(series);
    /* Update the selected$  (either series or futureSeries) */
    futureSeries
        ? exports.selected$.next(Object.assign(Object.assign({}, exports.selected$.value), { futureSeries: _series || null }))
        : exports.selected$.next(Object.assign(Object.assign({}, exports.selected$.value), { series: _series || null, 
            /* Ensure the selectBase always matches the selected series */
            base: assets_2.assetMap$.value.get(_series.baseId) || exports.selected$.value.base }));
    /* log to console */
    console.log(_series
        ? `Selected ${futureSeries ? '' : 'future '} Series: ${_series.id}`
        : `${futureSeries ? '' : 'future '} Series unselected`);
};
exports.selectSeries = selectSeries;
const selectVault = (vault) => {
    if (vault) {
        const _vault = vault.id ? vault : vaults_1.vaultMap$.value.get(vault);
        /* Update the selected$ */
        exports.selected$.next(Object.assign(Object.assign({}, exports.selected$.value), { vault: _vault || null, 
            /* Ensure the other releant components match the vault */
            base: assets_2.assetMap$.value.get(_vault.baseId) || exports.selected$.value.base, ilk: assets_2.assetMap$.value.get(_vault.ilkId) || exports.selected$.value.ilk, series: series_1.seriesMap$.value.get(_vault.seriesId) || exports.selected$.value.series }));
    }
    /* if undefined sent in, deselect vault only */
    !vault && exports.selected$.next(Object.assign(Object.assign({}, exports.selected$.value), { vault: null }));
    console.log(vault ? `Selected Vault: ${(vault === null || vault === void 0 ? void 0 : vault.id) || vault}` : 'Vault Unselected');
};
exports.selectVault = selectVault;
const selectStrategy = (strategy) => {
    if (strategy) {
        const _strategy = strategy.id ? strategy : strategies_1.strategyMap$.value.get(strategy);
        /* Update the selected$ */
        exports.selected$.next(Object.assign(Object.assign({}, exports.selected$.value), { strategy: _strategy || null, 
            /* Ensure the other releant components match the vault */
            base: assets_2.assetMap$.value.get(_strategy.baseId) || exports.selected$.value.base }));
    }
    /* if undefined sent in, deselect vault only */
    !strategy && exports.selected$.next(Object.assign(Object.assign({}, exports.selected$.value), { vault: null }));
    console.log(strategy ? `Selected Strategy: ${(strategy === null || strategy === void 0 ? void 0 : strategy.id) || strategy}` : 'Vaults unselected');
};
exports.selectStrategy = selectStrategy;
//# sourceMappingURL=selected.js.map