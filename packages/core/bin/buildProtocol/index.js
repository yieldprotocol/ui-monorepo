"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildProtocol = void 0;
const tslib_1 = require("tslib");
const contracts = tslib_1.__importStar(require("../contracts"));
const protocol_1 = require("../config/protocol");
const buildOracles_1 = require("./buildOracles");
const buildModules_1 = require("./buildModules");
const buildAssetsRoot_1 = require("./buildAssetsRoot");
const buildSeriesRoot_1 = require("./buildSeriesRoot");
const buildStrategiesRoot_1 = require("./buildStrategiesRoot");
const buildProtocol = (provider, chainId, appConfig) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    /* 1. build the base protocol components */
    const _baseAddresses = protocol_1.baseAddresses.get(chainId);
    const cauldron = contracts.Cauldron__factory.connect(_baseAddresses.Cauldron, provider);
    const ladle = contracts.Ladle__factory.connect(_baseAddresses.Ladle, provider);
    const witch = contracts.Witch__factory.connect(_baseAddresses.Witch, provider);
    /* 2. Build the oralceMap */
    const oracleMap = (0, buildOracles_1.buildOracleMap)(provider, chainId);
    /* 3. Build the moduleMap */
    const moduleMap = (0, buildModules_1.buildModuleMap)(provider, chainId);
    /* 4. Build the AssetRootMap - note: async */
    const assetRootMap = yield (0, buildAssetsRoot_1.buildAssetMap)(cauldron, ladle, provider, chainId, appConfig);
    /* 5. Build the seriesRootMAp - note : async */
    const seriesRootMap = yield (0, buildSeriesRoot_1.buildSeriesMap)(cauldron, ladle, assetRootMap, provider, chainId, appConfig);
    /* 6. Build the stategyRootMAp - note : async */
    const strategyRootMap = yield (0, buildStrategiesRoot_1.buildStrategyMap)(provider, chainId, appConfig); // TODO this could be loaded at same time as seriesMap
    return {
        protocolVersion: process.env.YIELD_UI_VERSION || '0.0.0',
        cauldron,
        ladle,
        witch,
        oracleMap,
        moduleMap,
        assetRootMap,
        seriesRootMap,
        strategyRootMap
    };
});
exports.buildProtocol = buildProtocol;
//# sourceMappingURL=index.js.map