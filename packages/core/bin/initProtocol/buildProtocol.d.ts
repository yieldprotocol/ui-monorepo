import { ethers } from 'ethers';
import { IYieldProtocol } from '../types';
export declare const buildProtocol: (provider: ethers.providers.BaseProvider, chainId: number, cacheProtocol?: boolean) => Promise<IYieldProtocol>;
