import { Contract, ethers } from 'ethers';
import * as contracts from '../contracts';

import { ARBITRUM, ETHEREUM } from '../utils/constants';
import { moduleAddresses, supportedChains } from '../config/protocol';

export const buildModuleMap = (provider: ethers.providers.BaseProvider, chainId: number) => {
  /** Get addresses of the module contracts */
  const _moduleAddresses = moduleAddresses.get(chainId);

  /** Inititiate contracts (and distribution as a map) */
  const moduleMap = new Map<string, Contract>([]);

  /** Common modules for all chains */
  moduleMap.set(
    'WrapEtherModule',
    contracts.WrapEtherModule__factory.connect(_moduleAddresses!.WrapEtherModule, provider)
  );

  /** Modules Contracts For Ethereum Chains */
  if (supportedChains.get(ETHEREUM)!.includes(chainId)) {
    // Modules
    moduleMap.set(
      'ConvexLadleModule',
      contracts.ConvexLadleModule__factory.connect(_moduleAddresses!.ConvexLadleModule as string, provider)
    );
  }

  /** Modules For Arbitrum Chains */
  if (supportedChains.get(ARBITRUM)!.includes(chainId)) {
    // Modules
  }

  return  moduleMap;
};
