import { BehaviorSubject, Observable, share } from 'rxjs';
import { IUserSettings } from '../types';

import defaultConfig from '../config/yield.config';

/** @internal */
export const userSettings$ = new BehaviorSubject<IUserSettings>(defaultConfig.defaultUserSettings);
export const userSettingsø = userSettings$.pipe<IUserSettings>(share());

export const updateUserSettings = (settings: IUserSettings) => {
  userSettings$.next({ ...userSettings$.value, ...settings });
};
