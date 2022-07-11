import { Observable } from 'rxjs';
import { IStrategy } from '../types';
export declare const strategiesø: Observable<Map<string, IStrategy>>;
export declare const updateStrategies: (strategyList?: IStrategy[], account?: string, accountDataOnly?: boolean) => Promise<void>;
