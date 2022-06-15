/** 
 * @module
 * Inputs
 */

import { BehaviorSubject, combineLatest, distinctUntilChanged, fromEvent, map, Observable, share, Subject, tap } from 'rxjs';
import { selectedø } from '../observables';
import { bnToW3Number, inputToTokenValue } from '../utils/yieldUtils';
import { W3Number } from '../types';
import { ZERO_W3NUMBER } from '../utils/constants';

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
export const borrowInputø: Observable<W3Number> = combineLatest([borrowInput$, selectedø]).pipe(
  distinctUntilChanged(),
  map(( [inp, {base}] ) => {
    if (inp) { 
      const tokenValue = inputToTokenValue(inp, base?.decimals!)
      return bnToW3Number(tokenValue, base?.decimals!, base?.digitFormat )
    };
    return ZERO_W3NUMBER;
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
export const collateralInputø: Observable<W3Number> = combineLatest([collateralInput$, selectedø]).pipe(
  map(( [inp, {ilk}] ) => {
    if (inp) { 
      const tokenValue = inputToTokenValue(inp, ilk?.decimals!)
      return bnToW3Number(tokenValue, ilk?.decimals!, ilk?.digitFormat )
    };
    return ZERO_W3NUMBER;
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
export const repayInputø: Observable<W3Number> = combineLatest([repayInput$, selectedø]).pipe(
  map(( [inp, {base}] ) => {
    if (inp) { 
      const tokenValue = inputToTokenValue(inp, base?.decimals!)
      return bnToW3Number(tokenValue, base?.decimals!, base?.digitFormat )
    };
    return ZERO_W3NUMBER;
  }),
);

/* Manual input update escape hatch (for example, when using react that doesn't have direct DOM access) */
export const updateRepayInput = (input: string) => repayInput$.next(input);

/** @internal */
 export const lendInput$: BehaviorSubject<string> = new BehaviorSubject('');
 /** 
  * Lending input 
  * @category Input
 */
 export const lendInputø: Observable<W3Number> = combineLatest([lendInput$, selectedø]).pipe(
  map(( [inp, {base}] ) => {
    if (inp) { 
      const tokenValue = inputToTokenValue(inp, base?.decimals!)
      return bnToW3Number(tokenValue, base?.decimals!, base?.digitFormat )
    };
    return ZERO_W3NUMBER;
  }),
 );
 /* Manual input update escape hatch (for example, when using react that doesn't have direct DOM access) */
 export const updateLendInput = (input: string) => lendInput$.next(input);


/** @internal */
  export const closeInput$: BehaviorSubject<string> = new BehaviorSubject('');
   /** 
    * Close Position input 
    * @category Input
   */
  export const closeInputø: Observable<W3Number> = combineLatest([closeInput$, selectedø]).pipe(
    map(( [inp, {base}] ) => {
      if (inp) { 
        const tokenValue = inputToTokenValue(inp, base?.decimals!)
        return bnToW3Number(tokenValue, base?.decimals!, base?.digitFormat )
      };
      return ZERO_W3NUMBER;
    }),
  );
  /* Manual input update escape hatch (for example, when using react that doesn't have direct DOM access) */
  export const updateCloseInput = (input: string) => closeInput$.next(input);


/** @internal */
export const addLiquidityInput$: BehaviorSubject<string> = new BehaviorSubject('');
 /** 
  * Add liquidity input
  * @category Input
  *  */
export const addLiquidityInputø: Observable<W3Number> = combineLatest([addLiquidityInput$, selectedø]).pipe(
  map(( [inp, {base}] ) => {
    if (inp) { 
      const tokenValue = inputToTokenValue(inp, base?.decimals!)
      return bnToW3Number(tokenValue, base?.decimals!, base?.digitFormat )
    };
    return ZERO_W3NUMBER;
  }),
);
/** Manual input update escape hatch (for example, when using react that doesn't have direct DOM access) */
export const updateAddLiqInput = (input: string) => addLiquidityInput$.next(input);

/** @internal */
 export const removeLiquidityInput$: BehaviorSubject<string> = new BehaviorSubject('');
/** 
 * Remove liquidity input 
 * @category Input
 * */
 export const removeLiquidityInputø: Observable<W3Number> = combineLatest([removeLiquidityInput$, selectedø]).pipe(
  map(( [inp, {base}] ) => {
    if (inp) { 
      const tokenValue = inputToTokenValue(inp, base?.decimals!)
      return bnToW3Number(tokenValue, base?.decimals!, base?.digitFormat )
    };
    return ZERO_W3NUMBER;
  }),
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
