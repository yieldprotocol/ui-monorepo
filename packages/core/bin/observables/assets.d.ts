import { Observable } from 'rxjs';
import { IAsset } from '../types';
/**
 * Unsubscribed Assetmap observable
 */
export declare const assetsø: Observable<Map<string, IAsset>>;
/**
 * Update Assets function
 * @param assetList  list of assets to update
 * @param account optional: account in use
 */
export declare const updateAssets: (assetList?: IAsset[], account?: string) => Promise<void>;
