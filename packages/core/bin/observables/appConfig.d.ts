import { Observable, Subject } from 'rxjs';
import { IYieldConfig } from '../types';
/** @internal */
export declare const appConfig$: Subject<IYieldConfig>;
/**
 * ONLY ON FIRST LOAD >> This app config is not actually exposed, it closes after gathering env. Ie. it is simply used to handle setting up the environment.
 * Any appConfig changes AFTER init are handled exclussively by the appConfig$ subject - not via this observable.
 */
export declare const appConfigø: Observable<IYieldConfig>;
export declare const updateYieldConfig: (appConfig: IYieldConfig) => void;
