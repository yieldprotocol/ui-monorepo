import { ethers } from 'ethers';
import { ISeriesRoot, IYieldConfig } from '../types';
export declare const buildSeriesMap: (cauldron: Cauldron, provider: ethers.providers.BaseProvider, chainId: number, appConfig: IYieldConfig) => Promise<Map<string, ISeriesRoot>>;
