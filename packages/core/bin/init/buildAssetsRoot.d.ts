import { ethers } from 'ethers';
import { IAssetRoot, IYieldConfig } from '../types';
import * as contracts from '../contracts';
export declare const buildAssetMap: (cauldron: contracts.Cauldron, ladle: contracts.Ladle, provider: ethers.providers.BaseProvider, chainId: number, appConfig: IYieldConfig) => Promise<Map<string, IAssetRoot>>;
