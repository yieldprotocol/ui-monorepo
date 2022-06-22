import { Observable } from 'rxjs';
import { ethers } from 'ethers';
import { IStrategy } from '../types';
export declare const strategiesø: Observable<Map<string, IStrategy>>;
export declare const updateStrategies: (provider: ethers.providers.BaseProvider, strategyList?: IStrategy[], account?: string, accountDataOnly?: boolean) => Promise<void>;
