import { IVaultRoot, IYieldProtocol } from '../types';
/**
 *
 * Build the Vault map from Cauldron events
 *
 * */
export declare const buildVaultMap: (yieldProtocol: IYieldProtocol, account: string, browserCaching?: boolean) => Promise<Map<string, IVaultRoot>>;
