import { ethers } from 'ethers';
import { IYieldConfig, IYieldProtocol } from '../types';
export declare const buildProtocol: (provider: ethers.providers.BaseProvider, chainId: number, appConfig: IYieldConfig) => Promise<IYieldProtocol>;
