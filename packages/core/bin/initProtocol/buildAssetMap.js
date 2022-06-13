"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAssetMap = void 0;
const tslib_1 = require("tslib");
const types_1 = require("../types");
const contracts = tslib_1.__importStar(require("../contracts"));
const assets_1 = require("../config/assets");
const appUtils_1 = require("../utils/appUtils");
const buildAssetMap = (cauldron, ladle, provider, chainId, browserCaching) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    /* Check for cached assets or start with empty array */
    const assetList = (browserCaching && (0, appUtils_1.getBrowserCachedValue)(`${chainId}_assets`)) || [];
    /* Check the last time the assets were fetched */
    const lastAssetUpdate = (browserCaching && (0, appUtils_1.getBrowserCachedValue)(`${chainId}_lastAssetUpdate`)) || 'earliest';
    /* Get all the assetAdded, oracleAdded and joinAdded events and series events at the same time */
    const assetAddedFilter = cauldron.filters.AssetAdded();
    const joinAddedfilter = ladle.filters.JoinAdded();
    const [assetAddedEvents, joinAddedEvents] = yield Promise.all([
        cauldron.queryFilter(assetAddedFilter, lastAssetUpdate, 'latest'),
        ladle.queryFilter(joinAddedfilter, lastAssetUpdate, 'latest'),
    ]);
    /* Create a map from the joinAdded event data or hardcoded join data if available */
    const joinMap = new Map(joinAddedEvents.map((e) => e.args)); // event values);
    /* Create a array from the assetAdded event data or hardcoded asset data if available */
    const assetsAdded = assetAddedEvents.map((evnt) => evnt);
    try {
        yield Promise.all(assetsAdded.map((_evnt) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const { assetId: id, asset: address } = _evnt.args;
            /* Get the basic hardcoded token info, if tooken is known, else get 'UNKNOWN' token */
            const assetInfo = assets_1.ASSETS.has(id) ? assets_1.ASSETS.get(id) : assets_1.ASSETS.get(assets_1.UNKNOWN);
            let { name, symbol, decimals, version } = assetInfo;
            /* On first load checks & corrects the ERC20 name/symbol/decimals (if possible ) */
            if (assetInfo.tokenType === types_1.TokenType.ERC20_ ||
                assetInfo.tokenType === types_1.TokenType.ERC20_Permit ||
                assetInfo.tokenType === types_1.TokenType.ERC20_DaiPermit) {
                const contract = contracts.ERC20__factory.connect(address, provider);
                try {
                    [name, symbol, decimals] = yield Promise.all([contract.name(), contract.symbol(), contract.decimals()]);
                }
                catch (e) {
                    console.warn(address, ': ERC20 contract auto-validation unsuccessfull. Please manually ensure symbol and decimals are correct.');
                }
            }
            /* Checks & corrects the version for ERC20Permit/ DAI permit tokens */
            if (assetInfo.tokenType === types_1.TokenType.ERC20_Permit || assetInfo.tokenType === types_1.TokenType.ERC20_DaiPermit) {
                const contract = contracts.ERC20Permit__factory.connect(address, provider);
                try {
                    version = yield contract.version();
                }
                catch (e) {
                    console.warn(address, ': contract VERSION auto-validation unsuccessfull. Please manually ensure version is correct.');
                }
            }
            /* Check if an unwrapping handler is provided, if so, the token is considered to be a wrapped token */
            const isWrappedToken = (_a = assetInfo.unwrapHandlerAddresses) === null || _a === void 0 ? void 0 : _a.has(chainId);
            /* Check if a wrapping handler is provided, if so, wrapping is required */
            const wrappingRequired = (_b = assetInfo.wrapHandlerAddresses) === null || _b === void 0 ? void 0 : _b.has(chainId);
            const newAsset = Object.assign(Object.assign({}, assetInfo), { id,
                address,
                name,
                symbol,
                decimals,
                version, 
                /* Redirect the id/join if required due to using wrapped tokens */
                joinAddress: assetInfo.proxyId ? joinMap.get(assetInfo.proxyId) : joinMap.get(id), isWrappedToken,
                wrappingRequired, proxyId: assetInfo.proxyId || id, 
                /* Default setting of assetInfo fields if required */
                displaySymbol: assetInfo.displaySymbol || symbol, showToken: assetInfo.showToken || false, 
                /* set 2 decimals as the default digit format */
                digitFormat: assetInfo.digitFormat || 2, 
                /* asset creation info */
                createdBlock: _evnt.blockNumber, createdTxHash: _evnt.transactionHash });
            /* push the new asset to the List */
            assetList.push(newAsset);
        })));
    }
    catch (e) {
        console.log('Error fetching Asset data: ', e);
    }
    // Log the new assets in the cache
    (0, appUtils_1.setBrowserCachedValue)(`${chainId}_assets`, assetList);
    // Set the 'last checked' block
    const _blockNum = yield provider.getBlockNumber(); // TODO: maybe lose this
    (0, appUtils_1.setBrowserCachedValue)(`${chainId}_lastAssetUpdate`, _blockNum);
    /* create a map from the 'charged' asset list */
    // const assetRootMap: Map<string, IAssetRoot> = new Map(assetList.map((a: any) => [a.id, _chargeAsset(a, provider)]));
    const assetRootMap = new Map(assetList.map((a) => [a.id, a]));
    console.log(`Yield Protocol ASSET data updated [Block: ${_blockNum}]`);
    console.log(assetRootMap);
    return assetRootMap;
});
exports.buildAssetMap = buildAssetMap;
//# sourceMappingURL=buildAssetMap.js.map