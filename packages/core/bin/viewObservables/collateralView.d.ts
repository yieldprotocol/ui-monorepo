import { BigNumber } from 'ethers';
import { Observable } from 'rxjs';
/**
 * The PREDICTED collateralization ratio based on the current INPUT expressed as a ratio
 * @category Borrow | Collateral
 * */
export declare const collateralizationRatioø: Observable<number | undefined>;
/**
 * The PREDICTED collateralization based on the current INPUT parameters expressed as a PERCENTAGE
 * ( for display )
 * @category Borrow | Collateral
 * */
export declare const collateralizationPercentø: Observable<number>;
export declare const isUndercollateralizedø: Observable<boolean>;
export declare const isUnhealthyCollateralizationø: Observable<boolean>;
/**
 * The minimum protocol allowed collaterallisation level expressed as a ratio
 * @category Borrow | Collateral
 * */
export declare const minCollateralRatioø: Observable<number>;
/**
 * The minimum protocol-allowed collaterallisation level expressed as a percentage
 * ( for display )
 * @category Borrow | Collateral
 * */
export declare const minCollateralPercentø: Observable<number>;
/**
 * The minimum collateral required to meet the minimum protocol-allowed levels
 * @category Borrow | Collateral
 * */
export declare const minCollateralRequiredø: Observable<BigNumber>;
/**
 *  Minimum Safe collatearalization level expressed asa ratio
 *  TODO: would this be better specified with the assetPair data? - possibly
 * @category Borrow | Collateral
 * */
export declare const minimumSafeRatioø: Observable<number>;
/**
 *  Minimum Safe collatearalization level expressed as a percentage
 * @category Borrow | Collateral
 * */
export declare const minimumSafePercentø: Observable<number>;
/**
 * Maximum collateral based selected Ilk and users balance
 * @category Borrow | Collateral
 */
export declare const maxCollateralø: Observable<BigNumber | undefined>;
/**
 * Calculate the maximum amount of collateral that can be removed
 * without leaving the vault undercollateralised
 * @category Borrow | Collateral
 * */
export declare const maxRemovableCollateralø: Observable<BigNumber | undefined>;
/**
 * Price at which the vault will get liquidated
 * @category Borrow | Collateral
 * */
export declare const vaultLiquidatePriceø: Observable<String>;
/**
 * Pre Transaction estimated Price at which a vault / pair  will get liquidated
 * based on collateral and debt INPUT ( and existing colalteral and debt)
 * @category Borrow | Collateral
 * */
export declare const estimatedLiquidatePriceø: Observable<String>;
