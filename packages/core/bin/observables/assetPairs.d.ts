import { Observable } from 'rxjs';
import { IAssetPair } from '../types';
export declare const assetPairsø: Observable<Map<string, IAssetPair>>;
export declare const updatePair: (baseId: string, ilkId: string, chainId: number) => Promise<IAssetPair | null>;
