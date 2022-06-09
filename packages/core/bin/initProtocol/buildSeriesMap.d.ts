import { ethers } from 'ethers';
import { IAssetRoot, ISeriesRoot } from '../types';
import * as contracts from '../contracts';
export declare const buildSeriesMap: (cauldron: contracts.Cauldron, ladle: contracts.Ladle, assetRootMap: Map<string, IAssetRoot>, provider: ethers.providers.BaseProvider, browserCaching: boolean) => Promise<Map<string, ISeriesRoot>>;
