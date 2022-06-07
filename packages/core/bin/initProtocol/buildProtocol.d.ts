import { ethers } from 'ethers';
import { IYieldProtocol } from '../types';
export declare const buildProtocol: (provider: ethers.providers.BaseProvider, cacheProtocol?: boolean) => Promise<IYieldProtocol>;
