"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildModuleMap = void 0;
const tslib_1 = require("tslib");
const contracts = tslib_1.__importStar(require("../contracts"));
const constants_1 = require("../utils/constants");
const protocol_1 = require("../config/protocol");
const observables_1 = require("../observables");
const buildModuleMap = (provider) => {
    /** Get addresses of the module contracts */
    const _moduleAddresses = protocol_1.moduleAddresses.get(observables_1.chainId$.value);
    /** Inititiate contracts (and distribution as a map) */
    const moduleMap = new Map([]);
    /** Common modules for all chains */
    moduleMap.set('WrapEtherModule', contracts.WrapEtherModule__factory.connect(_moduleAddresses.WrapEtherModule, provider));
    /** Modules Contracts For Ethereum Chains */
    if (protocol_1.supportedChains.get(constants_1.ETHEREUM).includes(observables_1.chainId$.value)) {
        // Modules
        moduleMap.set('ConvexLadleModule', contracts.ConvexLadleModule__factory.connect(_moduleAddresses.ConvexLadleModule, provider));
    }
    /** Modules For Arbitrum Chains */
    if (protocol_1.supportedChains.get(constants_1.ARBITRUM).includes(observables_1.chainId$.value)) {
        // Modules
    }
    return moduleMap;
};
exports.buildModuleMap = buildModuleMap;
//# sourceMappingURL=buildModuleMap.js.map