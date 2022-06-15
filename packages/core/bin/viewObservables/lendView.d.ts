import { Observable } from 'rxjs';
import { W3Number } from '../types';
/**
 * Get the maximum lendable to the protocol based on selected series
 * @category Lend
 * */
export declare const maximumLendø: Observable<W3Number>;
/**
 * Flag indicating if lending is limited by the protocol based on both account blaance ( and possibly input? )
 * @category Lend
 * */
export declare const isLendingLimitedø: Observable<boolean>;
/**
 * Maximum allowable when closing a lending posiiton
 * @category Lend | Close
 * */
export declare const maximumCloseø: Observable<W3Number>;
/**
 * Predicted Base Value at maturity based on the [[input]] provided.
 * @category Lend
 * */
export declare const lendValueAtMaturityø: Observable<W3Number>;
/**
 * Get the base value of the existing lending position. i.e. the CURRENT base value of the fyTokens held by the user
 * @category Lend
 * */
export declare const lendPostionValueø: Observable<W3Number>;
/**
 * Maximum rollable base
 * @category Lend | Roll
 * */
export declare const maximumLendRollø: Observable<W3Number>;
