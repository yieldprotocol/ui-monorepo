import { Observable } from 'rxjs';
import { IVault, IVaultRoot } from '../types';
export declare const vaultsø: Observable<Map<string, IVault>>;
export declare const updateVaults: (vaultList?: IVault[] | IVaultRoot[], suppressEventLogQueries?: boolean) => Promise<void>;
