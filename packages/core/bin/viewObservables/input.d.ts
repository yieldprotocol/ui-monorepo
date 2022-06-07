/**
 * @module
 * Inputs
 */
import { BigNumber } from 'ethers';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
/** @internal */
export declare const borrowInput$: BehaviorSubject<string>;
/**
 * Borrow input
 * @category Input
 * */
export declare const borrowInputø: Observable<BigNumber>;
export declare const updateBorrowInput: (input: string) => void;
/** @internal */
export declare const collateralInput$: BehaviorSubject<string>;
/**
 * Collateral input
 * @category Input
 * */
export declare const collateralInputø: Observable<BigNumber>;
export declare const updateCollateralInput: (input: string) => void;
/** @internal */
export declare const repayInput$: Subject<string>;
/**
 * Repayment input
 * @category Input
 * */
export declare const repayInputø: Observable<BigNumber>;
export declare const updateRepayInput: (input: string) => void;
/** @internal */
export declare const lendInput$: BehaviorSubject<string>;
/**
 * Lending input
 * @category Input
*/
export declare const lendInputø: Observable<BigNumber>;
export declare const updateLendInput: (input: string) => void;
/** @internal */
export declare const closeInput$: BehaviorSubject<string>;
/**
 * Close Position input
 * @category Input
*/
export declare const closeInputø: Observable<BigNumber>;
export declare const updateCloseInput: (input: string) => void;
/** @internal */
export declare const addLiquidityInput$: BehaviorSubject<string>;
/**
 * Add liquidity input
 * @category Input
 *  */
export declare const addLiquidityInputø: Observable<BigNumber>;
/** Manual input update escape hatch (for example, when using react that doesn't have direct DOM access) */
export declare const updateAddLiqInput: (input: string) => void;
/** @internal */
export declare const removeLiquidityInput$: BehaviorSubject<string>;
/**
 * Remove liquidity input
 * @category Input
 * */
export declare const removeLiquidityInputø: Observable<BigNumber>;
/** Manual input update escape hatch (for example, when using react that doesn't have direct DOM access) */
export declare const updateRemoveLiqInput: (input: string) => void;
