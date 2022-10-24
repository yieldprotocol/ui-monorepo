import { ethers } from 'ethers';
import { IAssetRoot, IYieldConfig, IYieldProtocol } from '../types';

import * as contracts from '@yield-protocol/ui-contracts';

import { baseAddresses } from '../config';

import { buildOracleMap } from './initOracles';
import { buildModuleMap } from './initModules';

import { buildAssetMap } from './initAssets';
import { buildSeriesMap } from './initSeries';
import { buildStrategyMap } from './initStrategies';

export const buildProtocol = async (
  provider: ethers.providers.BaseProvider,
  chainId: number,
  appConfig: IYieldConfig
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

  /* 4. Build the AssetRootMap - note : async */
  const assetRootMap:  Map<string, IAssetRoot> = await buildAssetMap(chainId);

  /* 5. Build the seriesRootMAp - note : async */
  const seriesRootMap = await buildSeriesMap(cauldron, ladle, assetRootMap, provider, chainId, appConfig);

  /* 6. Build the stategyRootMAp - note : async */
  const strategyRootMap = await buildStrategyMap(provider, chainId, appConfig); // TODO this could be loaded at same time as seriesMap

  return {
    protocolVersion: process.env.YIELD_UI_VERSION || '0.0.0',
    cauldron,
    ladle,
    witch,
    oracleMap,
    moduleMap,
    assetRootMap,
    seriesRootMap,
    strategyRootMap,
  };
};
