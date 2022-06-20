import { BehaviorSubject, Observable } from 'rxjs';
import { IAssetPair } from '../types';
/** @internal */
export declare const assetPairMap$: BehaviorSubject<Map<string, IAssetPair>>;
export declare const assetPairMapø: Observable<Map<string, IAssetPair>>;
export declare const updatePair: (baseId: string, ilkId: string, chainId: number) => Promise<IAssetPair | null>;
