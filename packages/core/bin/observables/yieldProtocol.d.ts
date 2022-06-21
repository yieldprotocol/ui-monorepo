import { BehaviorSubject, Observable } from 'rxjs';
import { IYieldProtocol } from '../types';
/** @internal */
export declare const yieldProtocol$: BehaviorSubject<IYieldProtocol>;
export declare const yieldProtocolø: Observable<IYieldProtocol>;
export declare const updateYieldProtocol: (newProtocol: IYieldProtocol) => void;
