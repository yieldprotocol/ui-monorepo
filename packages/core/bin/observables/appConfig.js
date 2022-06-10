"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateYieldConfig = exports.appConfigø = exports.appConfig$ = void 0;
const tslib_1 = require("tslib");
const rxjs_1 = require("rxjs");
/* Handle configuration */
const yield_config_1 = tslib_1.__importDefault(require("../config/yield.config"));
/** @internal */
exports.appConfig$ = new rxjs_1.BehaviorSubject(yield_config_1.default);
/**
 * This app config is not actually exposed, it closes after gathering env. Ie. it is simply used to handle setting up the environment.
 * Any appConfig changes AFTER init are handled exclussively by the appConfig$ subject - not via this observable.
 */
exports.appConfigø = exports.appConfig$.pipe((0, rxjs_1.take)(1), // Only do this once on app load.
(0, rxjs_1.map)((config) => {
    // /* if in a browser environment */
    // if (typeof window !== 'undefined') {
    //   if ((window as any).ethereum) {
    //     // first try from the injected provider
    //     const injectedId = await (window as any).ethereum.request({ method: 'eth_chainId' });
    //     console.log('InjectedID', injectedId);
    //     chainId$.next(parseInt(injectedId, 16));
    //   }
    //   const fromCache = getBrowserCachedValue(`lastChainIdUsed`);
    //   chainId$.next(fromCache); // second, from the last id used in the cache
    // }
    // /* in a non-browser environment */
    // chainId$.next(appConfig$.value.defaultChainId); // defaults to the defaultChainId in the settings
    setTimeout(() => config, 5000);
    return config;
}), 
// takeUntil(appConfig$),
(0, rxjs_1.finalize)(() => console.log('App Environment Configured.')));
const updateYieldConfig = (appConfig) => {
    exports.appConfig$.next(Object.assign(Object.assign({}, yield_config_1.default), appConfig));
};
exports.updateYieldConfig = updateYieldConfig;
//# sourceMappingURL=appConfig.js.map