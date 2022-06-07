import { BehaviorSubject, Observable } from "rxjs";
import { IStrategy } from "../types";
/** @internal */
export declare const strategyMap$: BehaviorSubject<Map<string, IStrategy>>;
export declare const strategyMapø: Observable<Map<string, IStrategy>>;
export declare const updateStrategies: (strategyList?: IStrategy[]) => Promise<void>;
