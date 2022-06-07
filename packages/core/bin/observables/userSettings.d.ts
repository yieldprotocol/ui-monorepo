import { BehaviorSubject, Observable } from "rxjs";
import { IUserSettings } from "../types";
/** @internal */
export declare const userSettings$: BehaviorSubject<IUserSettings>;
export declare const userSettingsø: Observable<IUserSettings>;
export declare const updateUserSettings: (settings: IUserSettings) => void;
