import { BehaviorSubject, Observable } from 'rxjs';
import { ethers } from 'ethers';
import { IStrategy } from '../types';
/** @internal */
export declare const strategyMap$: BehaviorSubject<Map<string, IStrategy>>;
export declare const strategyMapø: Observable<Map<string, IStrategy>>;
export declare const updateStrategies: (provider: ethers.providers.BaseProvider, strategyList?: IStrategy[], account?: string, accountDataOnly?: boolean) => Promise<void>;
