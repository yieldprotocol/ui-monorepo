import { Observable, BehaviorSubject } from 'rxjs';
import { IAsset, ISelected, ISeries, IStrategy, IVault } from '../types';
/** @internal */
export declare const selected$: BehaviorSubject<ISelected>;
export declare const selectedø: Observable<ISelected>;
/**
 *  Functions to selecting elements
 */
export declare const selectBase: (asset?: IAsset | string) => void;
export declare const selectIlk: (asset?: IAsset | string) => void;
export declare const selectSeries: (series: ISeries | string, futureSeries?: boolean) => void;
export declare const selectVault: (vault?: IVault | string) => void;
export declare const selectStrategy: (strategy?: IStrategy | string) => void;
