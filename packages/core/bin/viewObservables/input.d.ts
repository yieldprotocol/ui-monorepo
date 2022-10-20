/**
 * @module
 * Inputs
 */
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { W3bNumber } from '../types';
/** @internal */
export declare const borrowInput$: BehaviorSubject<string>;
/**
 * Borrow input
 * @category Input
 * */
export declare const borrowInputø: Observable<W3bNumber>;
export declare const updateBorrowInput: (input: string) => void;
/** @internal */
export declare const collateralInput$: BehaviorSubject<string>;
/**
 * Collateral input
 * @category Input
 * */
export declare const collateralInputø: Observable<W3bNumber>;
export declare const updateCollateralInput: (input: string) => void;
/** @internal */
export declare const repayInput$: Subject<string>;
/**
 * Repayment input
 * @category Input
 * */
export declare const repayInputø: Observable<W3bNumber>;
export declare const updateRepayInput: (input: string) => void;
/** @internal */
export declare const lendInput$: BehaviorSubject<string>;
/**
 * Lending input
 * @category Input
*/
export declare const lendInputø: Observable<W3bNumber>;
export declare const updateLendInput: (input: string) => void;
/** @internal */
export declare const closeInput$: BehaviorSubject<string>;
/**
 * Close Position input
 * @category Input
*/
export declare const closeInputø: Observable<W3bNumber>;
export declare const updateCloseInput: (input: string) => void;
/** @internal */
export declare const addLiquidityInput$: BehaviorSubject<string>;
/**
 * Add liquidity input
 * @category Input
 *  */
export declare const addLiquidityInputø: Observable<W3bNumber>;
/** Manual input update escape hatch (for example, when using react that doesn't have direct DOM access) */
export declare const updateAddLiqInput: (input: string) => void;
/** @internal */
export declare const removeLiquidityInput$: BehaviorSubject<string>;
/**
 * Remove liquidity input
 * @category Input
 * */
export declare const removeLiquidityInputø: Observable<W3bNumber>;
/** Manual input update escape hatch (for example, when using react that doesn't have direct DOM access) */
export declare const updateRemoveLiqInput: (input: string) => void;
