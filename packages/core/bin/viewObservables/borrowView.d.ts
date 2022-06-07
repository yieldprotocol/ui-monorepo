import { BigNumber } from 'ethers';
import { Observable } from 'rxjs';
/**
 * @module
 * Borrow Helpers
  */
/**
 * Maximum amount of debt allowed by the protocol for a particular [[IAssetPair | Asset Pair]]
 * @category Borrow
 * */
export declare const maxDebtLimitø: Observable<BigNumber>;
/**
 * Minimum amount of debt allowed by the protocol ( Dust level ) for a particular [[IAssetPair | Asset Pair]]
 * @category Borrow
 * */
export declare const minDebtLimitø: Observable<BigNumber>;
/**
 * Check if the user can borrow the specified [[borrowInputø | amount]] based on current protocol baseReserves
 * @category Borrow
 * */
export declare const isBorrowPossibleø: Observable<boolean>;
/**
 *  TODO:  Check if the particular borrow [[borrowInputø | amount]] is limited by the liquidity in the protocol
 * @category Borrow
 * */
export declare const isBorrowLimitedø: Observable<boolean>;
/**
 * Check if the user can roll the selected vault to a new [future] series
 * @category Borrow | Roll
 * */
export declare const isRollVaultPossibleø: Observable<boolean>;
/**  TODO:
 *
 * Check if the particular repay [input] is limited by the liquidity in the protocol
 * @category Borrow | Repay
 *  */
export declare const isRepayLimitedø: Observable<boolean>;
/**
 * Calculate how much debt will be remaining after successful repayment of [input]
 * @category Borrow | Repay
 */
export declare const debtAfterRepayø: Observable<BigNumber>;
/**
 * Calculate the expected NEW debt @ maturity ( any exisiting debt + new debt )  previously 'borrowEstimate'
 * @category Borrow
 * */
export declare const debtEstimateø: Observable<BigNumber>;
/**
 * Maximum amount that can be repayed (limited by: either the max tokens owned OR max debt available )
 * @category Borrow | Repay
 * */
export declare const maximumRepayø: Observable<BigNumber>;
/**
 * Min amount that can be repayed (limited by assetPair dustlevels/minDebt )
 * @category Borrow | Repay
 * */
export declare const minimumRepayø: Observable<BigNumber>;
/** TODO:  Maximum amount that can be rolled  ( NOTE : Not NB for now because we are only rolling entire [vaults] )
* @category Borrow | Repay
*/
export declare const maximumRollø: Observable<BigNumber>;
