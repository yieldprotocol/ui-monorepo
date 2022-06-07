"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildProtocol = void 0;
const tslib_1 = require("tslib");
const contracts = tslib_1.__importStar(require("../contracts"));
const protocol_1 = require("../config/protocol");
const buildOracleMap_1 = require("./buildOracleMap");
const buildModuleMap_1 = require("./buildModuleMap");
const buildAssetMap_1 = require("./buildAssetMap");
const buildSeriesMap_1 = require("./buildSeriesMap");
const buildStrategyMap_1 = require("./buildStrategyMap");
const buildProtocol = (provider, cacheProtocol = true) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    /** Set the chain id */
    const chainId = (yield provider.getNetwork()).chainId;
    console.log('Provider chain Id: ', chainId);
    /** Check the latest blocknumber */
    // const _blockNum = await provider.getBlockNumber();
    // console.log('Block Number: ', _blockNum);
    /* 1. build the base protocol components */
    const _baseAddresses = protocol_1.baseAddresses.get(chainId);
    const cauldron = contracts.Cauldron__factory.connect(_baseAddresses.Cauldron, provider);
    const ladle = contracts.Ladle__factory.connect(_baseAddresses.Ladle, provider);
    const witch = contracts.Witch__factory.connect(_baseAddresses.Witch, provider);
    /* 2. Build the oralceMap */
    const oracleMap = (0, buildOracleMap_1.buildOracleMap)(provider, chainId);
    /* 3. Build the moduleMap */
    const moduleMap = (0, buildModuleMap_1.buildModuleMap)(provider, chainId);
    /* 4. Build the AssetRootMap - note: async */
    const assetRootMap = yield (0, buildAssetMap_1.buildAssetMap)(cauldron, ladle, provider, chainId, cacheProtocol);
    /* 5. Build the seriesRootMAp - note : async */
    const seriesRootMap = yield (0, buildSeriesMap_1.buildSeriesMap)(cauldron, ladle, assetRootMap, provider, chainId, cacheProtocol);
    /* 6. Build the stategyRootMAp - note : async */
    const strategyRootMap = yield (0, buildStrategyMap_1.buildStrategyMap)(provider, chainId, cacheProtocol); // TODO this could be loaded at same time as seriesMap
    return {
        protocolVersion: process.env.YIELD_UI_VERSION || '0.0.0',
        chainId,
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
//# sourceMappingURL=buildProtocol.js.map