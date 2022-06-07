import { BehaviorSubject, Observable } from 'rxjs';
import { ISeries } from '../types';
/** @internal */
export declare const seriesMap$: BehaviorSubject<Map<string, ISeries>>;
export declare const seriesMapø: Observable<Map<string, ISeries>>;
export declare const updateSeries: (seriesList?: ISeries[], account?: string) => Promise<void>;
/**
 * Dynamic asset info not related to a user
 * */
export declare const _updateSeries: (series: ISeries, account?: string | undefined) => Promise<ISeries>;
