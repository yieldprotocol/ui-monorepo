import { ethers } from 'ethers';
import { IStrategyRoot } from '../types';
export declare const buildStrategyMap: (provider: ethers.providers.BaseProvider, browserCaching: boolean) => Promise<Map<string, IStrategyRoot>>;
