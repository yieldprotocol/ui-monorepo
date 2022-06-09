import { IVaultRoot, IYieldProtocol } from '../types';
import { getBrowserCachedValue, setBrowserCachedValue } from '../utils/appUtils';
import { VaultBuiltEvent, VaultGivenEvent } from '../contracts/Cauldron';
import { generateVaultName } from '../utils/yieldUtils';
import { chainId$ } from '../observables';

/**
 *
 * Build the Vault map from Cauldron events
 *
 * */
export const buildVaultMap = async (
  yieldProtocol: IYieldProtocol,
  account: string,
  browserCaching: boolean = true
): Promise<Map<string, IVaultRoot>> => {
  const { cauldron, seriesRootMap, assetRootMap } = yieldProtocol;

  /* Check for cached assets or start with empty array */
  const cachedVaults: any[] = (browserCaching && getBrowserCachedValue(`${chainId$.value}_vaults#${account}`)) || [];
  /* Check the last time the assets were fetched */
  const lastVaultUpdate = (browserCaching && getBrowserCachedValue(`${chainId$.value}_lastVaultUpdate#${account}`)) || 'earliest';

  /** vaults can either be 'built' or 'given by a third party, so both events neded to be checked */
  const vaultsBuiltFilter = cauldron.filters.VaultBuilt(null, account, null);
  const vaultsReceivedfilter = cauldron.filters.VaultGiven(null, account);

  const [vaultsBuilt, vaultsReceived] = await Promise.all([
    cauldron.queryFilter(vaultsBuiltFilter, lastVaultUpdate, 'latest'),
    cauldron.queryFilter(vaultsReceivedfilter, lastVaultUpdate, 'latest'),
  ]);

  const builtVaults = vaultsBuilt.map((_evnt: VaultBuiltEvent): IVaultRoot => {
    const { vaultId, ilkId, seriesId } = _evnt.args;
    const series = seriesRootMap.get(seriesId);
    const ilk = assetRootMap.get(ilkId);
    return {
      id: vaultId,
      seriesId,
      baseId: series?.baseId || '',
      ilkId,
      displayName: generateVaultName(vaultId),
      baseDecimals: series?.decimals!,
      ilkDecimals: ilk?.decimals!,
      createdBlock: _evnt.blockNumber,
      createdTxHash: _evnt.transactionHash,
    };
  });

  const recievedVaults = await Promise.all(
    vaultsReceived.map(async (_evnt: VaultGivenEvent): Promise<IVaultRoot> => {
      const { vaultId: id } = _evnt.args;
      const { ilkId, seriesId } = await cauldron.vaults(id);
      const series = seriesRootMap.get(seriesId);
      const ilk = assetRootMap.get(ilkId);
      return {
        id,
        seriesId,
        baseId: series?.baseId || '',
        ilkId,
        displayName: generateVaultName(id),
        baseDecimals: series?.decimals!,
        ilkDecimals: ilk?.decimals!,
        createdBlock: _evnt.blockNumber,
        createdTxHash: _evnt.transactionHash,
      };
    })
  );

  /* combine built and given vault lists  */
  const vaultList = [...cachedVaults, ...builtVaults, ...recievedVaults];

  // Log the new assets in the cache
  setBrowserCachedValue(`${chainId$.value}_vaults#${account}`, vaultList);
  // Set the 'last checked' block

  // const _blockNum = await provider.getBlockNumber(); // TODO: maybe lose this
  setBrowserCachedValue(`${chainId$.value}_lastVaultUpdate#${account}`, 1);

  /* create a map from the 'charged' asset list */
  const vaultRootMap: Map<string, IVaultRoot> = new Map(vaultList.map((v: any) => [v.id as string, v]));

  console.log(`User VAULT data updated [Block: ${'somethign'}]`);

  return vaultRootMap;
};
