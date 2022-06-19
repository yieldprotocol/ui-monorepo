import {  finalize, map, Observable,shareReplay, Subject, take } from 'rxjs';
import { IYieldConfig } from '../types';

/* Handle configuration */
import defaultConfig from '../config/yield.config';

/** @internal */
export const appConfig$: Subject<IYieldConfig> = new Subject();

/**
 * ONLY ON FIRST LOAD >> This app config is not actually exposed, it closes after gathering env. Ie. it is simply used to handle setting up the environment.
 * Any appConfig changes AFTER init are handled exclussively by the appConfig$ subject - not via this observable.
 */
export const appConfigø: Observable<IYieldConfig> = appConfig$
.pipe(
  take(1), // Only do this once on app load. also completes the subscription
  // delay(2000),
  map((config) => {
    // await ( new Promise(resolve => setTimeout(resolve, 5000)) ) ;
    return config;
  }),
  finalize(() => console.log('App Environment configured.')),
  shareReplay(1),
)

export const updateYieldConfig = (appConfig: IYieldConfig) => {
  appConfig$.next({ ...defaultConfig, ...appConfig });
};
