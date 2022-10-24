"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSettings = exports.userSettingsø = void 0;
const rxjs_1 = require("rxjs");
const config_1 = require("../config");
const userSettings$ = new rxjs_1.BehaviorSubject(config_1.defaultConfig.defaultUserSettings);
exports.userSettingsø = userSettings$.pipe((0, rxjs_1.shareReplay)(1));
const updateUserSettings = (settings) => {
    userSettings$.next(Object.assign(Object.assign({}, userSettings$.value), settings));
};
exports.updateUserSettings = updateUserSettings;
//# sourceMappingURL=userSettings.js.map