import { Observable, BehaviorSubject } from 'rxjs';
import { IYieldProcess } from '../types';
/** @internal */
export declare const transactionMap$: BehaviorSubject<Map<string, IYieldProcess>>;
export declare const transactionMapø: Observable<Map<string, IYieldProcess>>;
export declare const updateProcess: (process: IYieldProcess) => void;
export declare const resetProcess: (processCode: string) => void;
