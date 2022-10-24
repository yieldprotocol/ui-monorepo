import { Observable } from 'rxjs';
import { BigNumber, Contract } from 'ethers';
import { W3bNumber } from '../types';
import { IAssetRoot } from '../buildProtocol/initAssets';
export interface IAsset extends IAssetRoot {
    assetContract: Contract;
    isYieldBase: boolean;
    getBalance: (account: string) => Promise<BigNumber>;
    getAllowance: (account: string, spender: string) => Promise<BigNumber>;
    setAllowance?: (spender: string) => Promise<BigNumber | void>;
    balance: W3bNumber;
}
/** Unsubscribed Assetmap observable exposed for distribution */
export declare const assetsø: Observable<Map<string, IAsset>>;
/**
 * Update Assets function
 * @param assetList  list of assets to update
 * @param account optional: account in use
 */
export declare const updateAssets: (assetList?: IAsset[], account?: string) => Promise<void>;
