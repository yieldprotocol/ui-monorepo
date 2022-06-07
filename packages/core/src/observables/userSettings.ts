import { BehaviorSubject, Observable, share } from "rxjs";
import { IUserSettings } from "../types";

import defaultConfig from '../config/yield.config';

/** @internal */
export const userSettings$: BehaviorSubject<IUserSettings> = new BehaviorSubject(defaultConfig.defaultUserSettings);
export const userSettingsø: Observable<IUserSettings> = userSettings$.pipe(share());

export const updateUserSettings = (settings: IUserSettings) => {
  userSettings$.next({ ...userSettings$.value, ...settings });
};
