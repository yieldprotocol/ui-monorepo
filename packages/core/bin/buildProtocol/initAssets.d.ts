import { ethers } from 'ethers';
import { IAssetRoot, IYieldConfig } from '../types';
export declare const buildAssetMap: (chainId: number, provider: ethers.providers.BaseProvider, appConfig: IYieldConfig) => Promise<Map<string, IAssetRoot>>;
