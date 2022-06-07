import {
  maxFyTokenOut,
  fyTokenForMint,
  calculateSlippage,
  burn,
  burnFromStrategy,
  strategyTokenValue,
  sellFYToken,
  secondsToFrom,
} from '@yield-protocol/ui-math';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { BehaviorSubject, combineLatest, filter, map, Observable, share, Subject } from 'rxjs';
import { selectedø, userSettingsø, vaultMapø } from '../observables';
import { IStrategy, IVault } from '../types';
import { ZERO_BN } from '../utils';
import { addLiquidityInputø, removeLiquidityInputø } from './input';

// maxRemoveNoVault,
// maxRemoveWithVault,

// partialRemoveRequired, // boolean

// removeBaseReceived,
// removeFyTokenReceived,
// removeBaseReceived_,
// removeFyTokenReceived_,

/**
 * @category Pool | Add Liquidity
 */
export const maximumAddLiquidityø: Observable<BigNumber> = selectedø.pipe(
  map(({ base }) => {
    return base?.balance || ZERO_BN;
  })
);

/**
 * Check if it is possible to use BUY and POOL strategy is available for a particular INPUT and selected strategy.
 * @category Pool | Add Liquidity
 */
export const isBuyAndPoolPossibleø: Observable<boolean> = combineLatest([
  addLiquidityInputø,
  selectedø,
  userSettingsø,
]).pipe(
  /* don't emit if input is zero or there isn't a strategy selected */
  filter(([input, selected]) => input.gt(ZERO_BN) && !!selected.strategy?.currentSeries),
  map(([input, { strategy }, { slippageTolerance }]) => {
    const strategySeries = strategy?.currentSeries!; // filtered, we can safetly assume current series defined.

    let _fyTokenToBuy = ZERO_BN;
    const _maxFyTokenOut = maxFyTokenOut(
      strategySeries.baseReserves,
      strategySeries.fyTokenReserves,
      strategySeries.getTimeTillMaturity(),
      strategySeries.ts,
      strategySeries.g1,
      strategySeries.decimals
    );

    [_fyTokenToBuy] = fyTokenForMint(
      strategySeries.baseReserves,
      strategySeries.fyTokenRealReserves,
      strategySeries.fyTokenReserves,
      calculateSlippage(input, slippageTolerance.toString(), true),
      strategySeries.getTimeTillMaturity(),
      strategySeries.ts,
      strategySeries.g1,
      strategySeries.decimals,
      slippageTolerance
    );

    /* Check if buy and pool option is allowed */
    const buyAndPoolAllowed =
      _fyTokenToBuy.gt(ethers.constants.Zero) &&
      _fyTokenToBuy.lt(_maxFyTokenOut) &&
      parseFloat(strategySeries.apr) > 0.25;
    // diagnostics && console.log('Can BuyAndPool?', buyAndPoolAllowed);

    return buyAndPoolAllowed;
  })
);

/**
 * Maximum removalable liquidity
 * - currently liquidity is always removable, so the balance is the strategy token balance
 *
 * @category Pool | Remove Liquidity
 */
export const maximumRemoveLiquidityø: Observable<BigNumber> = selectedø.pipe(
  map(({ strategy }) => strategy?.accountBalance || ZERO_BN)
);

/**
 * Get the vault ( if adding liquidity was done using the 'Borrow and Pool' method. )
 * @category Pool | Remove Liquidity
 */
export const borrowAndPoolVaultø: Observable<IVault | undefined> = combineLatest([selectedø, vaultMapø]).pipe(
  filter(([selected]) => !!selected.strategy),
  map(([{ strategy }, vaultMap]) => {
    const { baseId, currentSeriesId } = strategy as IStrategy;
    const arr: IVault[] = Array.from(vaultMap.values()) as IVault[];
    const _matchingVault = arr
      .sort((vaultA: IVault, vaultB: IVault) => (vaultA.id > vaultB.id ? 1 : -1))
      .sort((vaultA: IVault, vaultB: IVault) => (vaultA.art.lt(vaultB.art) ? 1 : -1))
      .find((v: IVault) => v.ilkId === baseId && v.baseId === baseId && v.seriesId === currentSeriesId && v.isActive);
    // diagnostics && console.log('Matching Vault:', _matchingVault?.id || 'No matching vault.');
    return _matchingVault;
  })
);

/**
 *
 * Indicates the amount of [0] Base and [1] fyTokens that will be returned when partially removing liquidity tokens
 * based on the input
 * @returns [ base returned, fyTokens returned]
 * @category Pool | Remove Liquidity
 *
 * */
export const partialRemoveReturnø: Observable<BigNumber[]> = combineLatest([
  removeLiquidityInputø,
  selectedø,
  borrowAndPoolVaultø,
]).pipe(
  filter(([input, selected]) => input.gt(ZERO_BN) && !!selected.strategy?.currentSeries),
  map(([input, { strategy }, borrowAndPoolVault]) => {
    const strategySeries = strategy?.currentSeries; // NOTE: filtered, we can safetly assume strategy currentSeries is defined.

    if (!!borrowAndPoolVault) {
      /**
       * CASE Matching vault (with debt) exists: USE 1 , 2.1 or 2.2
       * */
      /* Check the amount of fyTokens potentially recieved */
      const lpReceived = burnFromStrategy(strategy?.strategyPoolBalance!, strategy?.strategyTotalSupply!, input);
      const [_baseReceived, _fyTokenReceived] = burn(
        strategySeries?.baseReserves!,
        strategySeries?.fyTokenRealReserves!,
        strategySeries?.totalSupply!,
        lpReceived
      );
      // diagnostics && console.log('burnt (base, fytokens)', _baseReceived.toString(), _fyTokenReceived.toString());

      if (_fyTokenReceived.gt(borrowAndPoolVault?.accruedArt!)) {
        /**
         * Fytoken received greater than debt : USE REMOVE OPTION 2.1 or 2.2
         * */
        // diagnostics &&
        //   console.log(
        //     'FyTokens received will be greater than debt: an extra sellFytoken trade is required: REMOVE OPTION 2.1 or 2.2 '
        //   );
        const _extraFyTokensToSell = _fyTokenReceived.sub(borrowAndPoolVault.accruedArt);
        // diagnostics && console.log(_extraFyTokensToSell.toString(), 'FyTokens Need to be sold');

        const _extraFyTokenValue = sellFYToken(
          strategySeries!.baseReserves!,
          strategySeries!.fyTokenRealReserves!,
          _extraFyTokensToSell,
          secondsToFrom(strategySeries!.maturity.toString()),
          strategySeries!.ts,
          strategySeries!.g2,
          strategySeries!.decimals
        );

        if (_extraFyTokenValue.gt(ZERO_BN)) {
          /**
           * CASE> extra fyToken TRADE IS POSSIBLE :  USE REMOVE OPTION 2.1?
           * */
          const totalValue = _baseReceived.add(_extraFyTokenValue); // .add(_fyTokenReceived);
          // diagnostics && console.log('USE REMOVE OPTION 2.1');
          return [totalValue, ZERO_BN];
        } else {
          /**
           * CASE> extra fyToken TRADE NOT POSSIBLE ( limited by protocol ): USE REMOVE OPTION 2.2
           * */
          const _fyTokenVal = _fyTokenReceived.sub(borrowAndPoolVault.accruedArt);
          const _baseVal = _baseReceived; // .add(matchingVault.art);
          // diagnostics && console.log('USE REMOVE OPTION 2.2');
          return [_baseVal, _fyTokenVal];
        }
      } else {
        /**
         * CASE> fytokenReceived less than debt : USE REMOVE OPTION 1
         *  */
        const _value = _baseReceived; // .add(_fyTokenReceived);
        // diagnostics &&
        //   console.log(
        //     'FyTokens received will Less than debt: straight No extra trading is required : USE REMOVE OPTION 1 '
        //   );
        return [_value, ZERO_BN];
      }
    } else {      
      /**
       * SCENARIO > No matching vault exists : USE REMOVE OPTION 4
       * */
      /* Check the amount of fyTokens potentially recieved */
      const lpReceived = burnFromStrategy(strategy!.strategyPoolBalance!, strategy!.strategyTotalSupply!, input);
      const [_baseReceived, _fyTokenReceived] = burn(
        strategySeries!.baseReserves!,
        strategySeries!.fyTokenRealReserves!,
        strategySeries!.totalSupply!,
        lpReceived
      );

      /* Calculate the token Value */
      const [tokenSellValue, totalTokenValue] = strategyTokenValue(
        input,
        strategy?.strategyTotalSupply!,
        strategy?.strategyPoolBalance!,
        strategySeries!.baseReserves,
        strategySeries!.fyTokenRealReserves,
        strategySeries!.totalSupply!,
        strategySeries!.getTimeTillMaturity(),
        strategySeries!.ts,
        strategySeries!.g2,
        strategySeries!.decimals
      );

      // diagnostics && console.log('NO VAULT : pool trade is possible  : USE REMOVE OPTION 4.1 ');
      if (tokenSellValue.gt(ZERO_BN)) return [totalTokenValue, ZERO_BN];
      // diagnostics && console.log('NO VAULT : trade not possible : USE REMOVE OPTION 4.2');
      return [_baseReceived, _fyTokenReceived];
    }
  })
);

  /**
 * Check if not all liquidity can be removed, and a partial removal is required.
 * @category Pool | Remove Liquidity
 */
   export const isPartialRemoveRequiredø: Observable<boolean> = partialRemoveReturnø.pipe(
    map((removals) =>   {
      //diagnostics &&  console.log( 'partial removal is required')
      const areFyTokensReturned = removals[1].gt(ZERO_BN)
      return areFyTokensReturned;
    })
  );

