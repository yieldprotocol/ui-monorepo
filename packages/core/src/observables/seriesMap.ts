import { BehaviorSubject, filter, Observable, share, withLatestFrom } from 'rxjs';
import { ethers } from 'ethers';
import { sellFYToken, secondsToFrom, calculateAPR, floorDecimal, mulDecimal, divDecimal } from '@yield-protocol/ui-math';

import * as contracts from '../contracts';

import { ISeries, ISeriesRoot, IYieldProtocol, MessageType } from '../types';
import { account$ } from './account';

import { provider$ } from './provider';
import { yieldProtocol$ } from './yieldProtocol';
import { ETH_BASED_ASSETS } from '../config/assets';
import { sendMsg } from './messages';

/** @internal */
export const seriesMap$: BehaviorSubject<Map<string, ISeries>> = new BehaviorSubject(new Map([]));
export const seriesMapø: Observable<Map<string, ISeries>> = seriesMap$.pipe(share());

/* Update series function */
export const updateSeries = async (seriesList?: ISeries[], account?: string) => {
    const list = seriesList?.length ? seriesList : Array.from(seriesMap$.value.values());
    list.map(async (series: ISeries) => {
      const seriesUpdate = await _updateSeries(series, account);
      seriesMap$.next(new Map(seriesMap$.value.set(series.id, seriesUpdate))); // note: new Map to enforce ref update
    });
};

/* Observe YieldProtocol$ changes, an update map accordingly */
yieldProtocol$
  .pipe(
    filter((protocol )=> protocol.seriesRootMap.size > 0 ),
    withLatestFrom(provider$)
    )
  .subscribe(async ([_protocol, _provider]: [IYieldProtocol, ethers.providers.BaseProvider]) => {
    /* 'Charge' all the series (using the current provider) */
    const chargedList = Array.from(_protocol.seriesRootMap.values()).map((s: ISeriesRoot) =>
      _chargeSeries(s, _provider)
    );
    /* Update the assets with dynamic/user data */
    await updateSeries(chargedList);
    sendMsg({message:'Series Loaded', type: MessageType.INTERNAL})
  });

/* Observe provider$ changes, and update map accordingly ('charge assets/series' with live contracts & listeners ) */
// provider$.pipe(withLatestFrom(seriesMap$)).subscribe(([provider, seriesMap]) => {
//   console.log('Series map updated' ) // [provider, seriesMap]);
// });

/* Observe Account$ changes ('update dynamic/User Data') */
account$.pipe(withLatestFrom(seriesMap$)).subscribe(([account]) => {
  console.log('account changed:', account);
});

/**
 * Internal Functions
 * */

/* Add on extra/calculated SERIES info, contract instances and methods (no async calls) */
const _chargeSeries = (series: any, provider: ethers.providers.BaseProvider): ISeries => {
  /* contracts need to be added in again in when charging because the cached state only holds strings */
  const poolContract = contracts.Pool__factory.connect(series.poolAddress, provider);
  const fyTokenContract = contracts.FYToken__factory.connect(series.fyTokenAddress, provider);

  return {
    ...series,

    poolContract,
    fyTokenContract,

    /* attach the various built-in functions required (can't be cached yet)  */
    getTimeTillMaturity: () => series.maturity - Math.round(new Date().getTime() / 1000),
    isMature: () => series.maturity - Math.round(new Date().getTime() / 1000) <= 0,
    /* pre-set the allowance fns */
    getFyTokenAllowance: async (acc: string, spender: string) => fyTokenContract.allowance(acc, spender),
    getPoolAllowance: async (acc: string, spender: string) => poolContract.allowance(acc, spender),
  };
};

/**
 * Dynamic asset info not related to a user
 * */
export const _updateSeries = async (series: ISeries, account?: string | undefined): Promise<ISeries> => {
  /* Get all the data simultanenously in a promise.all */
  const [baseReserves, fyTokenReserves, totalSupply, fyTokenRealReserves] = await Promise.all([
    series.poolContract.getBaseBalance(),
    series.poolContract.getFYTokenBalance(),
    series.poolContract.totalSupply(),
    series.fyTokenContract.balanceOf(series.poolAddress),
  ]);

  const rateCheckAmount = ethers.utils.parseUnits(
    ETH_BASED_ASSETS.includes(series.baseId) ? '.001' : '1',
    series.decimals
  );

  /* Calculates the base/fyToken unit selling price */
  const _sellRate = sellFYToken(
    baseReserves,
    fyTokenReserves,
    rateCheckAmount,
    secondsToFrom(series.maturity.toString()),
    series.ts,
    series.g2,
    series.decimals
  );

  const apr = calculateAPR(floorDecimal(_sellRate), rateCheckAmount, series.maturity) || '0';

  /* Setup users asset info if there is an account */
  let accountData = {};
  if (account) {
    const [poolTokens, fyTokenBalance] = await Promise.all([
      series.poolContract.balanceOf(account),
      series.fyTokenContract.balanceOf(account),
    ]);
    const poolPercent = mulDecimal(divDecimal(poolTokens, totalSupply), '100');
    accountData = {
      ...series,
      poolTokens,
      fyTokenBalance,
      poolTokens_: ethers.utils.formatUnits(poolTokens, series.decimals),
      fyTokenBalance_: ethers.utils.formatUnits(fyTokenBalance, series.decimals),
      poolPercent,
    };
  }

  return {
    ...series,
    baseReserves,
    baseReserves_: ethers.utils.formatUnits(baseReserves, series.decimals),
    fyTokenReserves,
    fyTokenRealReserves,
    totalSupply,
    totalSupply_: ethers.utils.formatUnits(totalSupply, series.decimals),
    apr: `${Number(apr).toFixed(2)}`,
    ...accountData,
  };
};
