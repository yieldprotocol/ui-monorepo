/** 
 * @module
 * Inputs
 */

import { BigNumber, ethers } from 'ethers';
import { BehaviorSubject, fromEvent, map, Observable, share, Subject, tap } from 'rxjs';
import { selected$ } from '../observables';
import { ZERO_BN } from '../utils';

import { appConfig$ } from '../observables/appConfig';
import { inputToTokenValue } from '../utils/yieldUtils';
const diagnostics = appConfig$.value.diagnostics;

const _getValueFromInputEvent = (event: Observable<InputEvent>): Observable<string> => {
  return event.pipe(
    tap((event: InputEvent) => console.log('event.target', event.target)),
    map((event: InputEvent) => (event.target as HTMLInputElement).value)
  );
};

/** @internal */
export const borrowInput$: BehaviorSubject<string> = new BehaviorSubject('0');
/** 
 * Borrow input 
 * @category Input 
 * */
export const borrowInputø: Observable<BigNumber> = borrowInput$.pipe(
  map((inp: string | undefined) => {
    if (inp) return inputToTokenValue(inp, selected$.value.base?.decimals!);
    return ZERO_BN;
  }),
  share()
);
/* Manual input update escape hatch (for example, when using react that doesn't have direct DOM access) */
export const updateBorrowInput = (input: string) => borrowInput$.next(input);


/** @internal */
export const collateralInput$: BehaviorSubject<string> = new BehaviorSubject('0');
/** 
 * Collateral input 
 * @category Input
 * */
export const collateralInputø: Observable<BigNumber> = collateralInput$.pipe(
  map((inp: string | undefined) => {
    if (inp) return inputToTokenValue(inp, selected$.value.ilk?.decimals!);
    return ZERO_BN;
  }),
  share()
); 

/* Manual input update escape hatch (for example, when using react that doesn't have direct DOM access) */
export const updateCollateralInput = (input: string) => collateralInput$.next(input);


/** @internal */
export const repayInput$: Subject<string> = new Subject();
/** 
 * Repayment input 
 * @category Input
 * */
export const repayInputø: Observable<BigNumber> = repayInput$.pipe(
  map((inp: string | undefined) => {
    if (inp) return inputToTokenValue(inp, selected$.value.base?.decimals!);
    return ZERO_BN;
  })
);

/* Manual input update escape hatch (for example, when using react that doesn't have direct DOM access) */
export const updateRepayInput = (input: string) => repayInput$.next(input);

/** @internal */
 export const lendInput$: BehaviorSubject<string> = new BehaviorSubject('');
 /** 
  * Lending input 
  * @category Input
 */
 export const lendInputø: Observable<BigNumber> = lendInput$.pipe(
   map((inp: string | undefined) => {
     if (inp) return inputToTokenValue(inp, selected$.value.base?.decimals!);
     return ZERO_BN;
   })
 );
 /* Manual input update escape hatch (for example, when using react that doesn't have direct DOM access) */
 export const updateLendInput = (input: string) => lendInput$.next(input);


/** @internal */
  export const closeInput$: BehaviorSubject<string> = new BehaviorSubject('');
   /** 
    * Close Position input 
    * @category Input
   */
  export const closeInputø: Observable<BigNumber> = closeInput$.pipe(
    map((inp: string | undefined) => {
      if (inp) return inputToTokenValue(inp, selected$.value.base?.decimals!);
      return ZERO_BN;
    })
  );
  /* Manual input update escape hatch (for example, when using react that doesn't have direct DOM access) */
  export const updateCloseInput = (input: string) => closeInput$.next(input);


/** @internal */
export const addLiquidityInput$: BehaviorSubject<string> = new BehaviorSubject('');
 /** 
  * Add liquidity input
  * @category Input
  *  */
export const addLiquidityInputø: Observable<BigNumber> =addLiquidityInput$.pipe(
  map((inp: string | undefined) => {
    if (inp) return inputToTokenValue(inp, selected$.value.strategy?.decimals!);
    return ZERO_BN;
  })
);
/** Manual input update escape hatch (for example, when using react that doesn't have direct DOM access) */
export const updateAddLiqInput = (input: string) => addLiquidityInput$.next(input);

/** @internal */
 export const removeLiquidityInput$: BehaviorSubject<string> = new BehaviorSubject('');
/** 
 * Remove liquidity input 
 * @category Input
 * */
 export const removeLiquidityInputø: Observable<BigNumber> = removeLiquidityInput$.pipe(
   map((inp: string | undefined) => {
     if (inp) return inputToTokenValue(inp, selected$.value.strategy?.decimals!);
     return ZERO_BN;
   })
 );
/** Manual input update escape hatch (for example, when using react that doesn't have direct DOM access) */
export const updateRemoveLiqInput = (input: string) => removeLiquidityInput$.next(input);

/**
 *
 * EXPERIMENTAL: set up automatic listeners for plain html apps
 *
 * */

if (typeof window !== 'undefined') {
/* If there is a borrowInput html element, subcribe to that event */
const _borrowInputElement: HTMLInputElement = document.getElementById('borrowInput') as HTMLInputElement;
_borrowInputElement &&
  fromEvent<InputEvent>(_borrowInputElement, 'input')
    .pipe(_getValueFromInputEvent)
    .subscribe((val: string) => {
      borrowInput$.next(val);
    });

/* If there is a borrowInput html element, subcribe to that event */
const _repayInputElement: HTMLInputElement = document.getElementById('repayInput') as HTMLInputElement;
_repayInputElement &&
  fromEvent<InputEvent>(_repayInputElement, 'input')
    .pipe(_getValueFromInputEvent)
    .subscribe((val: string) => {
      repayInput$.next(val);
    });

/* If there is a borrowInput html element, subcribe to that event */
const _poolInputElement: HTMLInputElement = document.getElementById('poolInput') as HTMLInputElement;
_poolInputElement &&
  fromEvent<InputEvent>(_poolInputElement, 'input')
    .pipe(_getValueFromInputEvent)
    .subscribe((val: string) => {
      addLiquidityInput$.next(val);
    });
 
/* If there is a collateralInput html element, subcribe to that event */
const _collateralInputElement: HTMLInputElement = document.getElementById('collateralInput') as HTMLInputElement;
_collateralInputElement &&
  fromEvent<InputEvent>(_collateralInputElement, 'input')
    .pipe(_getValueFromInputEvent)
    .subscribe((val: string) => {
      collateralInput$.next(val);
    });

}