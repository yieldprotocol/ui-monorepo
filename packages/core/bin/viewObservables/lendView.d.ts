import { BigNumber } from 'ethers';
import { Observable } from 'rxjs';
/**
 * Get the maximum lendable to the protocol based on selected series
 * @category Lend
 * */
export declare const maximumLendø: Observable<BigNumber>;
/**
 * Flag indicating if lending is limited by the protocol based on both account blaance ( and possibly input? )
 * @category Lend
 * */
export declare const isLendingLimitedø: Observable<boolean>;
/**
 * Maximum allowable when closing a lending posiiton
 * @category Lend | Close
 * */
export declare const maximumCloseø: Observable<BigNumber>;
/**
 * Predicted Base Value at maturity based on the [[input]] provided.
 * @category Lend
 * */
export declare const lendValueAtMaturityø: Observable<BigNumber>;
/**
 * Get the base value of the existing lending position. i.e. the CURRENT base value of the fyTokens held by the user
 * @category Lend
 * */
export declare const lendPostionValueø: Observable<BigNumber>;
/**
 * Maximum rollable base
 * @category Lend | Roll
 * */
export declare const maximumLendRollø: Observable<BigNumber>;
