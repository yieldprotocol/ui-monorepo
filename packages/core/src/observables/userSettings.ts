import { BehaviorSubject, Observable, share, shareReplay } from 'rxjs';
import { IUserSettings } from '../types';

import {defaultConfig} from '../config';

const userSettings$: BehaviorSubject<IUserSettings> = new BehaviorSubject(defaultConfig.defaultUserSettings);
export const userSettingsø: Observable<IUserSettings> = userSettings$.pipe(shareReplay(1));

export const updateUserSettings = (settings: IUserSettings) => {
  userSettings$.next({ ...userSettings$.value, ...settings });
};
