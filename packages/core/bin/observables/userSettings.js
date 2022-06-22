"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSettings = exports.userSettingsø = void 0;
const tslib_1 = require("tslib");
const rxjs_1 = require("rxjs");
const yield_config_1 = tslib_1.__importDefault(require("../config/yield.config"));
const userSettings$ = new rxjs_1.BehaviorSubject(yield_config_1.default.defaultUserSettings);
exports.userSettingsø = userSettings$.pipe((0, rxjs_1.shareReplay)(1));
const updateUserSettings = (settings) => {
    userSettings$.next(Object.assign(Object.assign({}, userSettings$.value), settings));
};
exports.updateUserSettings = updateUserSettings;
//# sourceMappingURL=userSettings.js.map