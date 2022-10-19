import { ethers } from 'ethers';
import { IAssetRoot, ISeriesRoot, IYieldConfig } from '../types';
import * as contracts from '../contracts';
export declare const buildSeriesMap: (cauldron: contracts.Cauldron, ladle: contracts.Ladle, assetRootMap: Map<string, IAssetRoot>, provider: ethers.providers.BaseProvider, chainId: number, appConfig: IYieldConfig) => Promise<Map<string, ISeriesRoot>>;
