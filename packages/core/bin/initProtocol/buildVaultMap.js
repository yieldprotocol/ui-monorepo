"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildVaultMap = void 0;
const tslib_1 = require("tslib");
const appUtils_1 = require("../utils/appUtils");
const yieldUtils_1 = require("../utils/yieldUtils");
/**
 *
 * Build the Vault map from Cauldron events
 *
 * */
const buildVaultMap = (yieldProtocol, account, browserCaching = true) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { cauldron, seriesRootMap, assetRootMap, chainId } = yieldProtocol;
    /* Check for cached assets or start with empty array */
    const cachedVaults = (browserCaching && (0, appUtils_1.getBrowserCachedValue)(`${chainId}_vaults#${account}`)) || [];
    /* Check the last time the assets were fetched */
    const lastVaultUpdate = (browserCaching && (0, appUtils_1.getBrowserCachedValue)(`${chainId}_lastVaultUpdate#${account}`)) || 'earliest';
    /** vaults can either be 'built' or 'given by a third party, so both events neded to be checked */
    const vaultsBuiltFilter = cauldron.filters.VaultBuilt(null, account, null);
    const vaultsReceivedfilter = cauldron.filters.VaultGiven(null, account);
    const [vaultsBuilt, vaultsReceived] = yield Promise.all([
        cauldron.queryFilter(vaultsBuiltFilter, lastVaultUpdate, 'latest'),
        cauldron.queryFilter(vaultsReceivedfilter, lastVaultUpdate, 'latest'),
    ]);
    const builtVaults = vaultsBuilt.map((_evnt) => {
        const { vaultId, ilkId, seriesId } = _evnt.args;
        const series = seriesRootMap.get(seriesId);
        const ilk = assetRootMap.get(ilkId);
        return {
            id: vaultId,
            seriesId,
            baseId: (series === null || series === void 0 ? void 0 : series.baseId) || '',
            ilkId,
            displayName: (0, yieldUtils_1.generateVaultName)(vaultId),
            baseDecimals: series === null || series === void 0 ? void 0 : series.decimals,
            ilkDecimals: ilk === null || ilk === void 0 ? void 0 : ilk.decimals,
            createdBlock: _evnt.blockNumber,
            createdTxHash: _evnt.transactionHash,
        };
    });
    const recievedVaults = yield Promise.all(vaultsReceived.map((_evnt) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const { vaultId: id } = _evnt.args;
        const { ilkId, seriesId } = yield cauldron.vaults(id);
        const series = seriesRootMap.get(seriesId);
        const ilk = assetRootMap.get(ilkId);
        return {
            id,
            seriesId,
            baseId: (series === null || series === void 0 ? void 0 : series.baseId) || '',
            ilkId,
            displayName: (0, yieldUtils_1.generateVaultName)(id),
            baseDecimals: series === null || series === void 0 ? void 0 : series.decimals,
            ilkDecimals: ilk === null || ilk === void 0 ? void 0 : ilk.decimals,
            createdBlock: _evnt.blockNumber,
            createdTxHash: _evnt.transactionHash,
        };
    })));
    /* combine built and given vault lists  */
    const vaultList = [...cachedVaults, ...builtVaults, ...recievedVaults];
    // Log the new assets in the cache
    (0, appUtils_1.setBrowserCachedValue)(`${chainId}_vaults#${account}`, vaultList);
    // Set the 'last checked' block
    // const _blockNum = await provider.getBlockNumber(); // TODO: maybe lose this
    (0, appUtils_1.setBrowserCachedValue)(`${chainId}_lastVaultUpdate#${account}`, 1);
    /* create a map from the 'charged' asset list */
    const vaultRootMap = new Map(vaultList.map((v) => [v.id, v]));
    console.log(`User VAULT data updated [Block: ${'somethign'}]`);
    return vaultRootMap;
});
exports.buildVaultMap = buildVaultMap;
//# sourceMappingURL=buildVaultMap.js.map