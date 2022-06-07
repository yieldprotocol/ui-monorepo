import { maxBaseIn, sellBase, sellFYToken } from '@yield-protocol/ui-math';
import { BigNumber, BigNumberish } from 'ethers';
import { combineLatest, filter, map, Observable } from 'rxjs';
import { selectedø } from '../observables';
import { ZERO_BN } from '../utils';
import { closeInputø, lendInputø } from './input';

// TODO: apy,

/**
 * Get the maximum lendable to the protocol based on selected series
 * @category Lend
 * */
export const maximumLendø: Observable<BigNumber> = selectedø.pipe(
  map(({ series, base }) => {
    if (!!series) {
      /* checks the protocol limits  (max Base allowed in ) */
      const _maxBaseIn = maxBaseIn(
        series.baseReserves,
        series.fyTokenReserves,
        series.getTimeTillMaturity(),
        series.ts,
        series.g1,
        series.decimals
      );
      return base?.balance.lt(_maxBaseIn) ? base.balance : _maxBaseIn;
    }
    /* In the odd case that no series is selected, the return zero as max lend */
    return ZERO_BN;
  })
);

/**
 * Flag indicating if lending is limited by the protocol based on both account blaance ( and possibly input? )
 * @category Lend
 * */
export const isLendingLimitedø: Observable<boolean> = combineLatest([maximumLendø, selectedø]).pipe(
  map(([maxLend, { base }]) => {
    // if (input.gt(maxLend)) return true;
    if (base?.balance.gt(maxLend)) return true;
    return false;
  })
);

/**
 * Maximum allowable when closing a lending posiiton
 * @category Lend | Close
 * */
export const maximumCloseø: Observable<BigNumber> = selectedø.pipe(
  map(({ series }) => {
    /* If the series is mature, simply sned back the fyToken value (always closable) */
    if (series && series.isMature() ) return series.fyTokenBalance!;
    /* else process */
    const value = sellFYToken(
      series!.baseReserves,
      series!.fyTokenReserves,
      series!.fyTokenBalance || ZERO_BN,
      series!.getTimeTillMaturity(),
      series!.ts,
      series!.g2,
      series!.decimals
    );
    const baseReservesWithMargin = series!.baseReserves.mul(9999).div(10000); // TODO: figure out why we can't use the base reserves exactly (margin added to facilitate transaction)

    /* If the trade isn't possible, set the max close as total base reserves */
    if (value.lte(ZERO_BN) && series!.fyTokenBalance?.gt(series!.baseReserves)) return baseReservesWithMargin;
    if (value.lte(ZERO_BN)) return ZERO_BN;
    /* else, closing is not limited so return the trade value */
    return value;
  })
);

/**
 * Predicted Base Value at maturity based on the [[input]] provided.
 * @category Lend
 * */
export const lendValueAtMaturityø: Observable<BigNumber> = combineLatest([lendInputø, selectedø]).pipe(
  map(([input, { series }]) => {
    const { baseReserves, fyTokenReserves } = series!;
    const valueAtMaturity = sellBase(
      baseReserves,
      fyTokenReserves,
      input,
      series!.getTimeTillMaturity(),
      series!.ts,
      series!.g1,
      series!.decimals
    );
    return valueAtMaturity;
  })
);

/**
 * Get the base value of the existing lending position. i.e. the CURRENT base value of the fyTokens held by the user
 * @category Lend
 * */
export const lendPostionValueø: Observable<BigNumber> = selectedø.pipe(
  map(({ series }) => {
    /* If the series is mature, simply send back the fyToken value (always closable) */
    if (series && series.isMature() ) return series.fyTokenBalance!;
    /* else process */
    const value = sellFYToken(
      series!.baseReserves,
      series!.fyTokenReserves,
      series!.fyTokenBalance || ZERO_BN,
      series!.getTimeTillMaturity(),
      series!.ts,
      series!.g2,
      series!.decimals
    );
    // TODO: check this flow... shoudl we return ZERO. I think so, because if a trade is not possible the value IS 0.
    return value.lte(ZERO_BN) ? ZERO_BN : value;
  })
);

/**
 * Maximum rollable base
 * @category Lend | Roll
 * */
export const maximumLendRollø: Observable<BigNumber> = selectedø.pipe(
  /* only do calcs if there is a future series selected */
  filter((selected) => !!selected.futureSeries && !!selected.series),
  map(({ futureSeries, series }) => {
    const _maxBaseIn = maxBaseIn(
      futureSeries!.baseReserves,
      futureSeries!.fyTokenReserves,
      futureSeries!.getTimeTillMaturity(),
      futureSeries!.ts,
      futureSeries!.g1,
      futureSeries!.decimals
    );

    const _fyTokenValue = series!.isMature()
      ? series!.fyTokenBalance || ZERO_BN
      : sellFYToken(
          series!.baseReserves,
          series!.fyTokenReserves,
          series!.fyTokenBalance || ZERO_BN,
          series!.getTimeTillMaturity(),
          series!.ts,
          series!.g2,
          series!.decimals
        );
        
    /* if the protocol is limited return the max rollab as the max base in */
    if (_maxBaseIn.lte(_fyTokenValue)) return _maxBaseIn;
    /* else */
    return _fyTokenValue;
  })
);
