import { IVaultRoot, IYieldConfig, IYieldProtocol } from '../types';
import { ethers } from 'ethers';
/**
 *
 * Build the Vault map from Cauldron events
 *
 * */
export declare const buildVaultMap: (yieldProtocol: IYieldProtocol, provider: ethers.providers.BaseProvider, account: string, chainId: number, appConfig: IYieldConfig) => Promise<Map<string, IVaultRoot>>;
