"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateYieldConfig = exports.appConfig$ = void 0;
const tslib_1 = require("tslib");
const rxjs_1 = require("rxjs");
/* Handle configuration */
const yield_config_1 = tslib_1.__importDefault(require("../config/yield.config"));
/** @internal */
exports.appConfig$ = new rxjs_1.BehaviorSubject(yield_config_1.default);
const updateYieldConfig = (appConfig) => {
    exports.appConfig$.next(Object.assign(Object.assign({}, yield_config_1.default), appConfig));
};
exports.updateYieldConfig = updateYieldConfig;
//# sourceMappingURL=appConfig.js.map