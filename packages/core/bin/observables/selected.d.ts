import { Observable } from 'rxjs';
import { IAsset, ISeries, IStrategy, IVault } from '../types';
export interface ISelected {
    base: IAsset | null;
    ilk: IAsset | null;
    series: ISeries | null;
    vault: IVault | null;
    strategy: IStrategy | null;
    futureSeries: ISeries | null;
}
export declare const selectedø: Observable<ISelected>;
/**
 *  Functions to selecting elements
 */
export declare const selectBase: (asset?: IAsset | string) => Promise<void>;
export declare const selectIlk: (asset?: IAsset | string) => Promise<void>;
export declare const selectSeries: (series: ISeries | string, futureSeries?: boolean) => Promise<void>;
export declare const selectVault: (vault?: IVault | string) => Promise<void>;
export declare const selectStrategy: (strategy?: IStrategy | string) => Promise<void>;
