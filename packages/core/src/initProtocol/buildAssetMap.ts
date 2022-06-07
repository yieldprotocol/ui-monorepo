import { ethers } from 'ethers';
import { IAssetInfo, IAssetRoot, TokenType } from '../types';
import * as contracts from '../contracts';

import { ASSETS, UNKNOWN } from '../config/assets';
import { JoinAddedEvent } from '../contracts/Ladle';
import { AssetAddedEvent } from '../contracts/Cauldron';
import { getBrowserCachedValue, setBrowserCachedValue } from '../utils/appUtils';

export const buildAssetMap = async (
  cauldron: contracts.Cauldron,
  ladle: contracts.Ladle,
  provider: ethers.providers.BaseProvider,
  chainId: number,
  browserCaching: boolean
): Promise<Map<string, IAssetRoot>> => {

  /* Check for cached assets or start with empty array */
  const assetList: any[] = (browserCaching && getBrowserCachedValue(`${chainId}_assets`)) || [];
  /* Check the last time the assets were fetched */
  const lastAssetUpdate = (browserCaching && getBrowserCachedValue(`${chainId}_lastAssetUpdate`)) || 'earliest';

  /* Get all the assetAdded, oracleAdded and joinAdded events and series events at the same time */
  const assetAddedFilter = cauldron.filters.AssetAdded();
  const joinAddedfilter = ladle.filters.JoinAdded();

  const [assetAddedEvents, joinAddedEvents] = await Promise.all([
    cauldron.queryFilter(assetAddedFilter, lastAssetUpdate, 'latest'),
    ladle.queryFilter(joinAddedfilter, lastAssetUpdate, 'latest'),
  ]);
  
  /* Create a map from the joinAdded event data or hardcoded join data if available */
  const joinMap = new Map( joinAddedEvents.map((e: JoinAddedEvent) => e.args ) ); // event values);
  /* Create a array from the assetAdded event data or hardcoded asset data if available */
  const assetsAdded = assetAddedEvents.map( (evnt: AssetAddedEvent) => evnt );

  try {
    await Promise.all(
      assetsAdded.map(async (_evnt: any ) => {
        const { assetId: id, asset: address } = _evnt.args;
        /* Get the basic hardcoded token info, if tooken is known, else get 'UNKNOWN' token */
        const assetInfo = ASSETS.has(id) ? (ASSETS.get(id) as IAssetInfo) : (ASSETS.get(UNKNOWN) as IAssetInfo);
        let { name, symbol, decimals, version } = assetInfo;

        /* On first load checks & corrects the ERC20 name/symbol/decimals (if possible ) */
        if (
          assetInfo.tokenType === TokenType.ERC20_ ||
          assetInfo.tokenType === TokenType.ERC20_Permit ||
          assetInfo.tokenType === TokenType.ERC20_DaiPermit
        ) {
          const contract = contracts.ERC20__factory.connect(address, provider);
          try {
            [name, symbol, decimals] = await Promise.all([contract.name(), contract.symbol(), contract.decimals()]);
          } catch (e) {

            console.warn(
              address,
              ': ERC20 contract auto-validation unsuccessfull. Please manually ensure symbol and decimals are correct.'
            );

          }
        }

        /* Checks & corrects the version for ERC20Permit/ DAI permit tokens */
        if (assetInfo.tokenType === TokenType.ERC20_Permit || assetInfo.tokenType === TokenType.ERC20_DaiPermit) {
          const contract = contracts.ERC20Permit__factory.connect(address, provider);
          try {
            version = await contract.version();
          } catch (e) {
            console.warn(
              address,
              ': contract VERSION auto-validation unsuccessfull. Please manually ensure version is correct.'
            );
          }
        }

        /* Check if an unwrapping handler is provided, if so, the token is considered to be a wrapped token */
        const isWrappedToken = assetInfo.unwrapHandlerAddresses?.has(chainId);
        /* Check if a wrapping handler is provided, if so, wrapping is required */
        const wrappingRequired = assetInfo.wrapHandlerAddresses?.has(chainId);

        const newAsset = {
          ...assetInfo,
          id,
          address,
          name,
          symbol,
          decimals,
          version,

          /* Redirect the id/join if required due to using wrapped tokens */
          joinAddress: assetInfo.proxyId ? joinMap.get(assetInfo.proxyId) : joinMap.get(id),

          isWrappedToken,
          wrappingRequired,
          proxyId: assetInfo.proxyId || id, // set proxyId  (or as baseId if undefined)

          /* Default setting of assetInfo fields if required */
          displaySymbol: assetInfo.displaySymbol || symbol,
          showToken: assetInfo.showToken || false,

          /* set 2 decimals as the default digit format */
          digitFormat: assetInfo.digitFormat || 2,

          /* asset creation info */
          createdBlock: _evnt.blockNumber,
          createdTxHash: _evnt.transactionHash
        };

        /* push the new asset to the List */
        assetList.push(newAsset);
      })
    );
  } catch (e) {
    console.log('Error fetching Asset data: ', e);
  }

  // Log the new assets in the cache
  setBrowserCachedValue(`${chainId}_assets`, assetList);
  // Set the 'last checked' block
  const _blockNum = await provider.getBlockNumber(); // TODO: maybe lose this
  setBrowserCachedValue(`${chainId}_lastAssetUpdate`, _blockNum );

  /* create a map from the 'charged' asset list */
  // const assetRootMap: Map<string, IAssetRoot> = new Map(assetList.map((a: any) => [a.id, _chargeAsset(a, provider)]));
  const assetRootMap: Map<string, IAssetRoot> = new Map(assetList.map((a: any) => [a.id, a]));

  console.log(`Yield Protocol ASSET data updated [Block: ${_blockNum }]`);

  return assetRootMap;
};