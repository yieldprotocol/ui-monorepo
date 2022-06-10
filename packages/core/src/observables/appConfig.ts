import { BehaviorSubject, finalize, map, mergeMap, Observable, of, Subject, switchMap, take, takeUntil } from 'rxjs';
import { IYieldConfig } from '../types';

/* Handle configuration */
import defaultConfig from '../config/yield.config';
import { getBrowserCachedValue } from '../utils';
import { chainId$ } from './connection';

/** @internal */
export const appConfig$: BehaviorSubject<IYieldConfig> = new BehaviorSubject(defaultConfig);

/**
 * This app config is not actually exposed, it closes after gathering env. Ie. it is simply used to handle setting up the environment.
 * Any appConfig changes AFTER init are handled exclussively by the appConfig$ subject - not via this observable.
 */
export const appConfigø: Observable<IYieldConfig> = appConfig$.pipe(
  take(1), // Only do this once on app load.
  map((config) => {

    // /* if in a browser environment */
    // if (typeof window !== 'undefined') {
    //   if ((window as any).ethereum) {
    //     // first try from the injected provider
    //     const injectedId = await (window as any).ethereum.request({ method: 'eth_chainId' });
    //     console.log('InjectedID', injectedId);
    //     chainId$.next(parseInt(injectedId, 16));
    //   }
    //   const fromCache = getBrowserCachedValue(`lastChainIdUsed`);
    //   chainId$.next(fromCache); // second, from the last id used in the cache
    // }
    // /* in a non-browser environment */
    // chainId$.next(appConfig$.value.defaultChainId); // defaults to the defaultChainId in the settings
    setTimeout(() => config , 5000)

    return config;
  }),
  // takeUntil(appConfig$),
  finalize(() => console.log('App Environment Configured.'))
);

export const updateYieldConfig = (appConfig: IYieldConfig) => {
  appConfig$.next({ ...defaultConfig, ...appConfig });
};
