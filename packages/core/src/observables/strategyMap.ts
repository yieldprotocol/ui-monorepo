import { BehaviorSubject, Observable, share, combineLatest, withLatestFrom, filter } from "rxjs";
import { BigNumber, ethers } from 'ethers';
import { mulDecimal, divDecimal } from '@yield-protocol/ui-math';

import * as contracts from '../contracts';
import { ISeries, IStrategy, IStrategyRoot, IYieldProtocol, MessageType } from "../types";

import { account$, provider$ } from './connection';
import { yieldProtocol$ } from "./yieldProtocol";
import { seriesMap$ } from "./seriesMap";
import { ZERO_BN } from "../utils/constants";
import { sendMsg } from "./messages";

/** @internal */
export const strategyMap$: BehaviorSubject<Map<string, IStrategy>> = new BehaviorSubject(new Map([]));
export const strategyMapø: Observable<Map<string, IStrategy>> = strategyMap$.pipe(share());

/* Update strategies function */
export const updateStrategies = async (strategyList?: IStrategy[]) => {
  const list = strategyList?.length ? strategyList : Array.from(strategyMap$.value.values()); 
  list.map(async (_strategy: IStrategy) => {
    const strategyUpdate = await _updateStrategy(_strategy, seriesMap$.value, account$.value);
    strategyMap$.next(new Map(strategyMap$.value.set(_strategy.id, strategyUpdate))); // note: new Map to enforce ref update
  });
};

/* Observe YieldProtocol$ changes, and update map accordingly */
yieldProtocol$
  .pipe(
    filter((protocol )=> protocol.strategyRootMap.size > 0 ),
    withLatestFrom(provider$)
    )
  .subscribe(async ([_protocol, _provider]: [IYieldProtocol, ethers.providers.BaseProvider]) => {
    /* 'Charge' all the assets (using the current provider) */
    const chargedList = Array.from(_protocol.strategyRootMap.values()).map((st: IStrategyRoot) =>
      _chargeStrategy(st, _provider)
    );
    /* Update the assets with dynamic/user data */
    await updateStrategies(chargedList);
    sendMsg({message:'Strategies Loaded.', type: MessageType.INTERNAL})
    sendMsg({message: 'Protocol Ready...', type: MessageType.INTERNAL, id: 'protocolLoaded' })
  });

/* Observe provider$ changes, and update map accordingly ('charge assets/series' with live contracts & listeners ) */
// provider$
// .pipe(withLatestFrom(strategyMap$))
// .subscribe(([provider, seriesMap] ) => {
//   console.log( [provider, seriesMap] )
// })

/* Observe Account$ changes ('update dynamic/User Data') */
account$
.pipe(withLatestFrom(strategyMap$))
.subscribe( ([account ]) => {
  console.log( 'account changed:', account )
})

/* Add on extra/calculated Strategy info, contract instances and methods (no async calls) */
const _chargeStrategy = (strategy: any, provider: ethers.providers.BaseProvider) : IStrategy => {
  const _strategy = contracts.Strategy__factory.connect(strategy.address, provider);
  return {
    ...strategy,
    strategyContract: _strategy,
    getAllowance: async (acc: string, spender: string) => _strategy.allowance(acc, spender),
  };
};

const _updateStrategy = async (
  strategy: IStrategy,
  seriesMap: Map<string,ISeries>,
  account?: string | undefined
): Promise<IStrategy> => {
  /* Dynamic strategy info ( not related to a user ) */

  /* Get all the data simultanenously in a promise.all */
  const [strategyTotalSupply, currentSeriesId, currentPoolAddr, nextSeriesId] = await Promise.all([
    strategy.strategyContract.totalSupply(),
    strategy.strategyContract.seriesId(),
    strategy.strategyContract.pool(),
    strategy.strategyContract.nextSeriesId(),
  ]);
  const currentSeries = seriesMap.get(currentSeriesId) as ISeries;
  const nextSeries = seriesMap.get(nextSeriesId) as ISeries;

  /* Init supplys and balances as zero unless htere is a currnet series */
  let [poolTotalSupply, strategyPoolBalance, currentInvariant, initInvariant] = [ZERO_BN, ZERO_BN, ZERO_BN, ZERO_BN];
  if (currentSeries) {
    [poolTotalSupply, strategyPoolBalance] = await Promise.all([
      currentSeries.poolContract.totalSupply(),
      currentSeries.poolContract.balanceOf(strategy.address),
    ]);
    [currentInvariant, initInvariant] = currentSeries.isMature() ? [ZERO_BN, ZERO_BN] : [ZERO_BN, ZERO_BN];
    // strategyPoolPercent = mulDecimal(divDecimal(strategyPoolBalance, poolTotalSupply), '100');
  }
  const returnRate = currentInvariant && currentInvariant.sub(initInvariant)!;

  /* User strategy info */
  let accountData = {};
  if (account) {
    const [accountBalance, accountPoolBalance] = await Promise.all([
      strategy.strategyContract.balanceOf(account),
      currentSeries?.poolContract.balanceOf(account),
    ]);
    const accountStrategyPercent = mulDecimal(
      divDecimal(accountBalance, strategyTotalSupply || '0'),
      '100'
    );
    accountData = {
      ...strategy,
      accountBalance,
      accountBalance_: ethers.utils.formatUnits(accountBalance, strategy.decimals),
      accountPoolBalance,
      accountStrategyPercent,
    };
  }

  return {
    ...strategy,
    strategyTotalSupply,
    strategyTotalSupply_: ethers.utils.formatUnits(strategyTotalSupply, strategy.decimals),
    poolTotalSupply,
    poolTotalSupply_: ethers.utils.formatUnits(poolTotalSupply, strategy.decimals),
    strategyPoolBalance,
    strategyPoolBalance_: ethers.utils.formatUnits(strategyPoolBalance, strategy.decimals),
    currentSeriesId,
    currentPoolAddr,
    nextSeriesId,
    currentSeries,
    nextSeries,
    initInvariant: initInvariant || BigNumber.from('0'),
    currentInvariant: currentInvariant || BigNumber.from('0'),
    returnRate,
    returnRate_: returnRate.toString(),
    active: true,
    ...accountData,
  };
};
