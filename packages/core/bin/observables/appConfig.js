"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateYieldConfig = exports.appConfigø = exports.appConfig$ = void 0;
const tslib_1 = require("tslib");
const rxjs_1 = require("rxjs");
/* Handle configuration */
const yield_config_1 = tslib_1.__importDefault(require("../config/yield.config"));
/** @internal */
exports.appConfig$ = new rxjs_1.Subject();
/**
 * ONLY ON FIRST LOAD >> This app config is not actually exposed, it closes after gathering env. Ie. it is simply used to handle setting up the environment.
 * Any appConfig changes AFTER init are handled exclussively by the appConfig$ subject - not via this observable.
 */
exports.appConfigø = exports.appConfig$
    .pipe((0, rxjs_1.take)(1), // Only do this once on app load.
// delay(2000),
(0, rxjs_1.map)((config) => {
    // await ( new Promise(resolve => setTimeout(resolve, 5000)) ) ;
    console.log(config);
    return config;
}), 
// takeUntil(appConfig$),
(0, rxjs_1.finalize)(() => console.log('App Environment configured.')), (0, rxjs_1.share)());
const updateYieldConfig = (appConfig) => {
    exports.appConfig$.next(Object.assign(Object.assign({}, yield_config_1.default), appConfig));
};
exports.updateYieldConfig = updateYieldConfig;
//# sourceMappingURL=appConfig.js.map