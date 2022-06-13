import { ethers } from 'ethers';
import { format } from 'date-fns';

import { IAssetRoot, ISeriesRoot } from '../types';
import * as contracts from '../contracts';

import { PoolAddedEvent } from '../contracts/Ladle';
import { SeriesAddedEvent } from '../contracts/Cauldron';

import { getBrowserCachedValue, setBrowserCachedValue } from '../utils/appUtils';
import { nameFromMaturity } from '../utils/yieldUtils';
import { chainId$ } from '../observables';

export const buildSeriesMap = async (
  cauldron: contracts.Cauldron,
  ladle: contracts.Ladle,
  assetRootMap: Map<string, IAssetRoot>,
  provider: ethers.providers.BaseProvider,
  chainId: number,
  browserCaching: boolean
): Promise<Map<string, ISeriesRoot>> => {

  /* Check for cached assets or start with empty array */
  const seriesList: any[] = (browserCaching && getBrowserCachedValue(`${chainId}_series`)) || [];
  /* Check the last time the assets were fetched */
  const lastSeriesUpdate = (browserCaching && getBrowserCachedValue(`${chainId}_lastSeriesUpdate`)) || 'earliest';

  /* get poolAdded events and series events at the same time */
  const seriesAddedFilter = cauldron.filters.SeriesAdded();
  const poolAddedfilter = ladle.filters.PoolAdded();

  const [seriesAddedEvents, poolAddedEvents] = await Promise.all([
    cauldron.queryFilter(seriesAddedFilter, lastSeriesUpdate, 'latest'),
    ladle.queryFilter(poolAddedfilter, lastSeriesUpdate, 'latest'),
  ]);

  /* Create a array from the seriesAdded event data or hardcoded series data if available */
  const seriesAdded = seriesAddedEvents.map((evnt: SeriesAddedEvent) => evnt);
  /* Create a map from the poolAdded event data or hardcoded pool data if available */
  const poolMap = new Map(poolAddedEvents.map((e: PoolAddedEvent) => e.args)); // event values);

  /* Add in any extra static series */
  try {
    await Promise.all(
      seriesAdded
        .filter((_evnt: any) => !['23'].includes(_evnt.args.seriesId)) // ignore if on the ignore list
        .map(async (_evnt: any): Promise<void> => {
          const { seriesId: id, baseId, fyToken } = _evnt.args;
          const { maturity } = await cauldron.series(id);
          const baseTokenAddress = assetRootMap.get(baseId)!.address;

          if (poolMap.has(id)) {
            // only add series if it has a pool
            const poolAddress = poolMap.get(id);
            const poolContract = contracts.Pool__factory.connect(poolAddress as string, provider);
            const fyTokenContract = contracts.FYToken__factory.connect(fyToken, provider);
            const [name, symbol, version, decimals, poolName, poolVersion, poolSymbol, ts, g1, g2] = await Promise.all([
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
              maturity_: format(new Date(maturity * 1000), 'dd MMMM yyyy'),
              displayName: format(new Date(maturity * 1000), 'dd MMM yyyy'),
              displayNameMobile: `${nameFromMaturity(maturity, 'MMM yyyy')}`,
            };

            seriesList.push(newSeries);
          }
        })
    );
  } catch (e) {
    console.log('Error fetching series data: ', e);
  }

  // Log the new assets in the cache
  setBrowserCachedValue(`${chainId}_series`, seriesList);
  // Set the 'last checked' block
  const _blockNum = await provider.getBlockNumber(); // TODO: maybe lose this
  setBrowserCachedValue(`${chainId}_lastSeriesUpdate`, _blockNum);

  /* create a map from the asset list */
  const seriesRootMap: Map<string, ISeriesRoot> = new Map(seriesList.map((s: any) => [s.id, s]));

  console.log( seriesRootMap); 
  
  console.log(`Yield Protocol SERIES data updated [Block: ${_blockNum}]`);

  return seriesRootMap;
};
