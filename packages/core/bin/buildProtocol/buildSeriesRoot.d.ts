import { ethers } from 'ethers';
import { IAssetRoot, ISeriesRoot, IYieldConfig } from '../types';
export declare const buildSeriesMap: (cauldron: Cauldron, ladle: Ladle, assetRootMap: Map<string, IAssetRoot>, provider: ethers.providers.BaseProvider, chainId: number, appConfig: IYieldConfig) => Promise<Map<string, ISeriesRoot>>;
