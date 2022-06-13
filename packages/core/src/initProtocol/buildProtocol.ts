import { ethers } from 'ethers';
import { IAssetRoot, IYieldProtocol } from '../types';

import * as contracts from '../contracts';

import { baseAddresses } from '../config/protocol';

import { buildOracleMap } from './buildOracleMap';
import { buildModuleMap } from './buildModuleMap';

import { buildAssetMap } from './buildAssetMap';
import { buildSeriesMap } from './buildSeriesMap';
import { buildStrategyMap } from './buildStrategyMap';
import { chainId$ } from '../observables/connection';

export const buildProtocol = async (
  provider: ethers.providers.BaseProvider,
  chainId: number,
  cacheProtocol: boolean = true
): Promise<IYieldProtocol> => {

  /* 1. build the base protocol components */
  const _baseAddresses = baseAddresses.get(chainId);
  const cauldron = contracts.Cauldron__factory.connect(_baseAddresses!.Cauldron, provider) as contracts.Cauldron;
  const ladle = contracts.Ladle__factory.connect(_baseAddresses!.Ladle, provider) as contracts.Ladle;
  const witch = contracts.Witch__factory.connect(_baseAddresses!.Witch, provider) as contracts.Witch;
  
  /* 2. Build the oralceMap */
  const oracleMap = buildOracleMap(provider, chainId);
  /* 3. Build the moduleMap */
  const moduleMap = buildModuleMap(provider, chainId);

  /* 4. Build the AssetRootMap - note: async */
  const assetRootMap: Map<string, IAssetRoot> = await buildAssetMap(
    cauldron,
    ladle,
    provider,
    chainId,
    cacheProtocol
  );

  /* 5. Build the seriesRootMAp - note : async */
  const seriesRootMap = await buildSeriesMap(cauldron, ladle, assetRootMap, provider, chainId, cacheProtocol);

  /* 6. Build the stategyRootMAp - note : async */
  const strategyRootMap = await buildStrategyMap(provider, chainId, cacheProtocol); // TODO this could be loaded at same time as seriesMap

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
};
