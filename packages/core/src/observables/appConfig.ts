import { BehaviorSubject } from 'rxjs';
import { IYieldConfig } from '../types';

/* Handle configuration */
import defaultConfig from '../config/yield.config';

/** @internal */
export const appConfig$ = new BehaviorSubject<IYieldConfig>(defaultConfig);
export const updateYieldConfig = (appConfig: IYieldConfig) => {
  appConfig$.next({ ...defaultConfig, ...appConfig });
};
