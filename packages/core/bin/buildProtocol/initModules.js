"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildModuleMap = void 0;
const tslib_1 = require("tslib");
const contracts = tslib_1.__importStar(require("@yield-protocol/ui-contracts"));
const config_1 = require("../config");
const buildModuleMap = (provider, chainId) => {
    /** Get addresses of the module contracts */
    const _moduleAddresses = config_1.moduleAddresses.get(chainId);
    /** Inititiate contracts (and distribution as a map) */
    const moduleMap = new Map([]);
    /** Common modules for all chains */
    moduleMap.set('WrapEtherModule', contracts.WrapEtherModule__factory.connect(_moduleAddresses.WrapEtherModule, provider));
    /** Modules Contracts For Ethereum Chains */
    if (chainId === 1) { // supportedChains.get(ETHEREUM)!.includes(chainId)) {
        // Modules
        moduleMap.set('ConvexLadleModule', contracts.ConvexLadleModule__factory.connect(_moduleAddresses.ConvexLadleModule, provider));
    }
    /** Modules For Arbitrum Chains */
    // if (supportedChains.get(ARBITRUM)!.includes(chainId)) {
    //   // Modules
    // }
    return moduleMap;
};
exports.buildModuleMap = buildModuleMap;
//# sourceMappingURL=initModules.js.map