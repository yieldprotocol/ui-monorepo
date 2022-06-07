"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSeriesMap = void 0;
const tslib_1 = require("tslib");
const date_fns_1 = require("date-fns");
const contracts = tslib_1.__importStar(require("../contracts"));
const appUtils_1 = require("../utils/appUtils");
const yieldUtils_1 = require("../utils/yieldUtils");
const buildSeriesMap = (cauldron, ladle, assetRootMap, provider, chainId, browserCaching) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    /* Check for cached assets or start with empty array */
    const seriesList = (browserCaching && (0, appUtils_1.getBrowserCachedValue)(`${chainId}_series`)) || [];
    /* Check the last time the assets were fetched */
    const lastSeriesUpdate = (browserCaching && (0, appUtils_1.getBrowserCachedValue)(`${chainId}_lastSeriesUpdate`)) || 'earliest';
    /* get poolAdded events and series events at the same time */
    const seriesAddedFilter = cauldron.filters.SeriesAdded();
    const poolAddedfilter = ladle.filters.PoolAdded();
    const [seriesAddedEvents, poolAddedEvents] = yield Promise.all([
        cauldron.queryFilter(seriesAddedFilter, lastSeriesUpdate, 'latest'),
        ladle.queryFilter(poolAddedfilter, lastSeriesUpdate, 'latest'),
    ]);
    /* Create a array from the seriesAdded event data or hardcoded series data if available */
    const seriesAdded = seriesAddedEvents.map((evnt) => evnt);
    /* Create a map from the poolAdded event data or hardcoded pool data if available */
    const poolMap = new Map(poolAddedEvents.map((e) => e.args)); // event values);
    /* Add in any extra static series */
    try {
        yield Promise.all(seriesAdded
            .filter((_evnt) => !['23'].includes(_evnt.args.seriesId)) // ignore if on the ignore list
            .map((_evnt) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const { seriesId: id, baseId, fyToken } = _evnt.args;
            const { maturity } = yield cauldron.series(id);
            const baseTokenAddress = assetRootMap.get(baseId).address;
            if (poolMap.has(id)) {
                // only add series if it has a pool
                const poolAddress = poolMap.get(id);
                const poolContract = contracts.Pool__factory.connect(poolAddress, provider);
                const fyTokenContract = contracts.FYToken__factory.connect(fyToken, provider);
                const [name, symbol, version, decimals, poolName, poolVersion, poolSymbol, ts, g1, g2] = yield Promise.all([
                    fyTokenContract.name(),
                    fyTokenContract.symbol(),
                    fyTokenContract.version(),
                    fyTokenContract.decimals(),
                    poolContract.name(),
                    poolContract.version(),
                    poolContract.symbol(),
                    poolContract.ts(),
                    poolContract.g1(),
                    poolContract.g2(),
                    // poolContract.decimals(),
                ]);
                const newSeries = {
                    id,
                    baseId,
                    maturity,
                    name,
                    symbol,
                    version,
                    address: fyToken,
                    fyTokenAddress: fyToken,
                    decimals: decimals,
                    poolAddress,
                    poolVersion,
                    poolName,
                    poolSymbol,
                    baseTokenAddress,
                    ts,
                    g1,
                    g2,
                    createdBlock: _evnt.blockNumber,
                    createdTxHash: _evnt.transactionHash,
                    /* calc'd and display vals */
                    maturity_: (0, date_fns_1.format)(new Date(maturity * 1000), 'dd MMMM yyyy'),
                    displayName: (0, date_fns_1.format)(new Date(maturity * 1000), 'dd MMM yyyy'),
                    displayNameMobile: `${(0, yieldUtils_1.nameFromMaturity)(maturity, 'MMM yyyy')}`,
                };
                seriesList.push(newSeries);
            }
        })));
    }
    catch (e) {
        console.log('Error fetching series data: ', e);
    }
    // Log the new assets in the cache
    (0, appUtils_1.setBrowserCachedValue)(`${chainId}_series`, seriesList);
    // Set the 'last checked' block
    const _blockNum = yield provider.getBlockNumber(); // TODO: maybe lose this
    (0, appUtils_1.setBrowserCachedValue)(`${chainId}_lastSeriesUpdate`, _blockNum);
    /* create a map from the asset list */
    const seriesRootMap = new Map(seriesList.map((s) => [s.id, s]));
    console.log(`Yield Protocol SERIES data updated [Block: ${_blockNum}]`);
    return seriesRootMap;
});
exports.buildSeriesMap = buildSeriesMap;
//# sourceMappingURL=buildSeriesMap.js.map