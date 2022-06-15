import { BehaviorSubject, filter, Observable, share, withLatestFrom } from 'rxjs';
import { ethers } from 'ethers';
import { sellFYToken, secondsToFrom, calculateAPR, floorDecimal, mulDecimal, divDecimal } from '@yield-protocol/ui-math';

import * as contracts from '../contracts';

import { ISeries, ISeriesRoot, IYieldProtocol, MessageType } from '../types';
import { accountø, providerø } from './connection';
import { yieldProtocolø } from './yieldProtocol';
import { ETH_BASED_ASSETS } from '../config/assets';
import { sendMsg } from './messages';

/** @internal */
export const seriesMap$: BehaviorSubject<Map<string, ISeries>> = new BehaviorSubject(new Map([]));

/**
 * SeriesMap observable and update function.
 */
export const seriesMapø: Observable<Map<string, ISeries>> = seriesMap$.pipe(share());
export const updateSeries = async (seriesList?: ISeries[], account?: string, accountDataOnly: boolean = false) => {
  const list = seriesList?.length ? seriesList : Array.from(seriesMap$.value.values());
    await Promise.all( 
      list.map( async (series: ISeries) => {
      /* if account data only, just return the series */
      const seriesUpdate = accountDataOnly ? series:  await _updateDynamicInfo(series);
      /* if account provided, append account data */
      const seriesUpdateAll = account ? await  _updateAccountInfo( seriesUpdate, account) : seriesUpdate
      seriesMap$.next(new Map(seriesMap$.value.set(series.id, seriesUpdateAll))); // note: new Map to enforce ref update
    })
    );
};

/**
 * Observe YieldProtocolø changes, if protocol changes in any way, update series map accordingly 
 * */
yieldProtocolø
  .pipe(
    filter((protocol)=> protocol.seriesRootMap.size > 0 ),
    withLatestFrom(providerø, accountø),
  )
  .subscribe( async ([_protocol, _provider, _account]) => {
    /* 'Charge' all the series (using the current provider) */
    const chargedList = Array.from(_protocol.seriesRootMap.values()).map((s: ISeriesRoot) =>
      _chargeSeries(s, _provider)
    );
    /* Update the series with dynamic/user data */
    await updateSeries(chargedList, _account);
    console.log('Series loading complete.');
    sendMsg({message:'Series Loaded.', type: MessageType.INTERNAL, origin:'seriesMap'})
  });

/**
 * Observe Accountø changes ('update dynamic/User Data')
 * */
accountø.pipe(withLatestFrom(seriesMapø)).subscribe(async ([account, seriesMap ]) => {
  if (account && seriesMap.size) { 
    await updateSeries( Array.from(seriesMap.values()), account, true );
    console.log('Series updated with new account info.');
    sendMsg({message:'Series account info updated.', type: MessageType.INTERNAL, origin:'seriesMap'})
  };
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
 * 
 * */
const _updateDynamicInfo = async ( series: ISeries ): Promise<ISeries> => {
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

  return {
    ...series,
    baseReserves,
    baseReserves_: ethers.utils.formatUnits(baseReserves, series.decimals),
    fyTokenReserves,
    fyTokenRealReserves,
    totalSupply,
    totalSupply_: ethers.utils.formatUnits(totalSupply, series.decimals),
    apr: `${Number(apr).toFixed(2)}`,
  };
};

/**
 * 
 * Dynamic series info with a user
 * 
 * */
 const _updateAccountInfo = async (series: ISeries, account: string ): Promise<ISeries> => {
  /* Get all the data simultanenously in a promise.all */
    const [poolTokens, fyTokenBalance] = await Promise.all([
      series.poolContract.balanceOf(account),
      series.fyTokenContract.balanceOf(account),
    ]);
    const poolPercent = mulDecimal(divDecimal(poolTokens, series.totalSupply), '100');
    return {
      ...series,
      poolTokens,
      fyTokenBalance,
      poolTokens_: ethers.utils.formatUnits(poolTokens, series.decimals),
      fyTokenBalance_: ethers.utils.formatUnits(fyTokenBalance, series.decimals),
      poolPercent,
    };
};
