import { Observable } from 'rxjs';
import { IYieldProcess } from '../types';
export declare const transactionsø: Observable<Map<string, IYieldProcess>>;
export declare const updateProcess: (process: IYieldProcess) => void;
export declare const resetProcess: (processCode: string) => void;
