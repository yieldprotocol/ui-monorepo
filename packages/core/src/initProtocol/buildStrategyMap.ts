import { ethers } from 'ethers';

import { IStrategyRoot } from '../types';
import * as contracts from '../contracts';

import { strategyAddresses } from '../config/protocol';
import { getBrowserCachedValue, setBrowserCachedValue } from '../utils/appUtils';


export const buildStrategyMap = async (
  provider: ethers.providers.BaseProvider,
  chainId: number,
  browserCaching: boolean
): Promise<Map<string, IStrategyRoot>> => {

  const _strategyAddresses = strategyAddresses.get(chainId);
  const strategyList: any[] = (browserCaching && getBrowserCachedValue(`${chainId}_strategies`)) || [];

  try {
    await Promise.all(
      _strategyAddresses!.map(async (strategyAddr) => {
        /* if the strategy is NOT already in the cache : */
        if (strategyList.findIndex((_s: any) => _s.address === strategyAddr) === -1) {
          const Strategy = contracts.Strategy__factory.connect(strategyAddr, provider);
          const [name, symbol, baseId, decimals, version] = await Promise.all([
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
      })
    );
  } catch (e) {
    console.log('Error fetching strategy data: ', e);
  }

  // Log the new assets in the cache
  setBrowserCachedValue(`${chainId}_strategies`, strategyList);
  // Set the 'last checked' block
  const _blockNum = await provider.getBlockNumber(); // TODO: maybe lose this
  setBrowserCachedValue(`${chainId}_lastStrategyUpdate`, _blockNum );

  /* create a map from the 'charged' asset list */
  const strategyRootMap: Map<string, IStrategyRoot> = new Map(
    strategyList.map((s: any) => [s.id, s])
  );

  console.log(`Yield Protocol STRATEGY data updated [Block: ${_blockNum }]`);

  return strategyRootMap;
};
