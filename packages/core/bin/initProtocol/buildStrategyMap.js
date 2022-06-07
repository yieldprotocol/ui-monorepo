"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildStrategyMap = void 0;
const tslib_1 = require("tslib");
const contracts = tslib_1.__importStar(require("../contracts"));
const protocol_1 = require("../config/protocol");
const appUtils_1 = require("../utils/appUtils");
const buildStrategyMap = (provider, chainId, browserCaching) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const _strategyAddresses = protocol_1.strategyAddresses.get(chainId);
    const strategyList = (browserCaching && (0, appUtils_1.getBrowserCachedValue)(`${chainId}_strategies`)) || [];
    try {
        yield Promise.all(_strategyAddresses.map((strategyAddr) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            /* if the strategy is NOT already in the cache : */
            if (strategyList.findIndex((_s) => _s.address === strategyAddr) === -1) {
                const Strategy = contracts.Strategy__factory.connect(strategyAddr, provider);
                const [name, symbol, baseId, decimals, version] = yield Promise.all([
                    Strategy.name(),
                    Strategy.symbol(),
                    Strategy.baseId(),
                    Strategy.decimals(),
                    Strategy.version(),
                ]);
                const newStrategy = {
                    id: strategyAddr,
                    address: strategyAddr,
                    symbol,
                    name,
                    version,
                    baseId,
                    decimals,
                };
                // update state and cache
                strategyList.push(newStrategy);
            }
        })));
    }
    catch (e) {
        console.log('Error fetching strategy data: ', e);
    }
    // Log the new assets in the cache
    (0, appUtils_1.setBrowserCachedValue)(`${chainId}_strategies`, strategyList);
    // Set the 'last checked' block
    const _blockNum = yield provider.getBlockNumber(); // TODO: maybe lose this
    (0, appUtils_1.setBrowserCachedValue)(`${chainId}_lastStrategyUpdate`, _blockNum);
    /* create a map from the 'charged' asset list */
    const strategyRootMap = new Map(strategyList.map((s) => [s.id, s]));
    console.log(`Yield Protocol STRATEGY data updated [Block: ${_blockNum}]`);
    return strategyRootMap;
});
exports.buildStrategyMap = buildStrategyMap;
//# sourceMappingURL=buildStrategyMap.js.map