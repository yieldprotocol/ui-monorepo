import { ethers } from 'ethers';
import { ISeriesRoot, IYieldConfig } from '../types';
import { IAssetRoot } from './initAssets';
export declare const buildSeriesMap: (cauldron: Cauldron, ladle: Ladle, assetRootMap: Map<string, IAssetRoot>, provider: ethers.providers.BaseProvider, chainId: number, appConfig: IYieldConfig) => Promise<Map<string, ISeriesRoot>>;
