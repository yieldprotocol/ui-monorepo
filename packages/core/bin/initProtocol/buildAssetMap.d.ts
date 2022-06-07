import { ethers } from 'ethers';
import { IAssetRoot } from '../types';
import * as contracts from '../contracts';
export declare const buildAssetMap: (cauldron: contracts.Cauldron, ladle: contracts.Ladle, provider: ethers.providers.BaseProvider, chainId: number, browserCaching: boolean) => Promise<Map<string, IAssetRoot>>;
