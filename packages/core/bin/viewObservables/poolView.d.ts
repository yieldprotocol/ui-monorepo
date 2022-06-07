import { BigNumber } from 'ethers';
import { Observable } from 'rxjs';
import { IVault } from '../types';
/**
 * @category Pool | Add Liquidity
 */
export declare const maximumAddLiquidityø: Observable<BigNumber>;
/**
 * Check if it is possible to use BUY and POOL strategy is available for a particular INPUT and selected strategy.
 * @category Pool | Add Liquidity
 */
export declare const isBuyAndPoolPossibleø: Observable<boolean>;
/**
 * Maximum removalable liquidity
 * - currently liquidity is always removable, so the balance is the strategy token balance
 *
 * @category Pool | Remove Liquidity
 */
export declare const maximumRemoveLiquidityø: Observable<BigNumber>;
/**
 * Get the vault ( if adding liquidity was done using the 'Borrow and Pool' method. )
 * @category Pool | Remove Liquidity
 */
export declare const borrowAndPoolVaultø: Observable<IVault | undefined>;
/**
 *
 * Indicates the amount of [0] Base and [1] fyTokens that will be returned when partially removing liquidity tokens
 * based on the input
 * @returns [ base returned, fyTokens returned]
 * @category Pool | Remove Liquidity
 *
 * */
export declare const partialRemoveReturnø: Observable<BigNumber[]>;
/**
* Check if not all liquidity can be removed, and a partial removal is required.
* @category Pool | Remove Liquidity
*/
export declare const isPartialRemoveRequiredø: Observable<boolean>;