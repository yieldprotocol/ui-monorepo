import { Observable } from 'rxjs';
import { IAsset, ISelected, ISeries, IStrategy, IVault } from '../types';
export declare const selectedø: Observable<ISelected>;
/**
 *  Functions to selecting elements
 */
export declare const selectBase: (asset?: IAsset | string) => Promise<void>;
export declare const selectIlk: (asset?: IAsset | string) => Promise<void>;
export declare const selectSeries: (series: ISeries | string, futureSeries?: boolean) => Promise<void>;
export declare const selectVault: (vault?: IVault | string) => Promise<void>;
export declare const selectStrategy: (strategy?: IStrategy | string) => Promise<void>;
