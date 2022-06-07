import { BehaviorSubject } from "rxjs";
import { IYieldConfig } from "../types";
/** @internal */
export declare const appConfig$: BehaviorSubject<IYieldConfig>;
export declare const updateYieldConfig: (appConfig: IYieldConfig) => void;
