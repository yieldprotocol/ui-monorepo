import { BehaviorSubject, Observable } from 'rxjs';
import { IVault, IVaultRoot } from '../types';
/** @internal */
export declare const vaultMap$: BehaviorSubject<Map<string, IVault>>;
export declare const vaultMapø: Observable<Map<string, IVault>>;
export declare const updateVaults: (vaultList?: IVault[] | IVaultRoot[]) => Promise<void>;
