"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateYieldProtocol = exports.yieldProtocolø = exports.yieldProtocol$ = void 0;
const tslib_1 = require("tslib");
const rxjs_1 = require("rxjs");
const contracts = tslib_1.__importStar(require("../contracts"));
const appConfig_1 = require("./appConfig");
// TODO: try to get rid of this init? 
const _blankProtocol = {
    protocolVersion: '0.0.0',
    chainId: 1,
    cauldron: contracts.Cauldron__factory.connect('', appConfig_1.appConfig$.value.defaultProvider),
    ladle: contracts.Ladle__factory.connect('', appConfig_1.appConfig$.value.defaultProvider),
    witch: contracts.Witch__factory.connect('', appConfig_1.appConfig$.value.defaultProvider),
    oracleMap: new Map([]),
    moduleMap: new Map([]),
    assetRootMap: new Map([]),
    seriesRootMap: new Map([]),
    strategyRootMap: new Map([]),
};
/** @internal */
exports.yieldProtocol$ = new rxjs_1.BehaviorSubject(_blankProtocol);
exports.yieldProtocolø = exports.yieldProtocol$.pipe((0, rxjs_1.share)());
const updateYieldProtocol = (newProtocol) => {
    exports.yieldProtocol$.next(newProtocol); // update to whole new protocol
};
exports.updateYieldProtocol = updateYieldProtocol;
//# sourceMappingURL=yieldProtocol.js.map