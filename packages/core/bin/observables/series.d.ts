import { BehaviorSubject, Observable } from 'rxjs';
import { ISeries } from '../types';
/** @internal */
export declare const seriesMap$: BehaviorSubject<Map<string, ISeries>>;
/**
 * SeriesMap observable and update function.
 */
export declare const seriesø: Observable<Map<string, ISeries>>;
export declare const updateSeries: (seriesList?: ISeries[], account?: string, accountDataOnly?: boolean) => Promise<void>;
