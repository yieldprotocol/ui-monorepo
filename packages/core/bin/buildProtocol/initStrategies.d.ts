import { ethers } from 'ethers';
import { IStrategyRoot, IYieldConfig } from '../types';
export declare const buildStrategyMap: (provider: ethers.providers.BaseProvider, chainId: number, appConfig: IYieldConfig) => Promise<Map<string, IStrategyRoot>>;
