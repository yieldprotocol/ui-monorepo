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
import { BigNumber, ethers } from 'ethers';
import { combineLatest, filter, map, Observable } from 'rxjs';
import { selectedø, userSettingsø, vaultMapø } from '../observables';
import { IStrategy, IVault, W3Number } from '../types';
import { ZERO_BN } from '../utils';
import { ZERO_W3NUMBER } from '../utils/constants';
import { bnToW3Number } from '../utils/yieldUtils';
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
export const maximumAddLiquidityø: Observable<W3Number> = selectedø.pipe(
  map(({ base }) => {
    return base?.balance || ZERO_W3NUMBER;
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
  filter(([input, selected]) => input.bn.gt(ZERO_BN) && !!selected.series),
  map(([input, { series }, { slippageTolerance }]) => {
    const strategySeries = series!; // filtered, we can safetly assume current series defined.

    let _fyTokenToBuy = ZERO_BN;
    const _maxFyTokenOut = maxFyTokenOut(
      strategySeries.baseReserves.bn,
      strategySeries.fyTokenReserves.bn,
      strategySeries.getTimeTillMaturity(),
      strategySeries.ts,
      strategySeries.g1,
      strategySeries.decimals
    );

    [_fyTokenToBuy] = fyTokenForMint(
      strategySeries.baseReserves.bn,
      strategySeries.fyTokenRealReserves.bn,
      strategySeries.fyTokenReserves.bn,
      calculateSlippage(input.bn, slippageTolerance.toString(), true),
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
export const maximumRemoveLiquidityø: Observable<W3Number> = selectedø.pipe(
  map(({ strategy }) => strategy?.accountBalance || ZERO_W3NUMBER)
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
      .sort((vaultA: IVault, vaultB: IVault) => (vaultA.art.bn.lt(vaultB.art.bn) ? 1 : -1))
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
export const removeLiquidityReturnø: Observable<W3Number[]> = combineLatest([
  removeLiquidityInputø,
  selectedø,
  borrowAndPoolVaultø,
]).pipe(
  filter(([input, selected]) => input.bn.gt(ZERO_BN) && !!selected.series),
  map(([input, { strategy, series }, borrowAndPoolVault]) => {
    const strategySeries = series!; // NOTE: filtered, we can safetly assume strategy currentSeries is defined.

    if (!!borrowAndPoolVault) {
      /**
       * CASE Matching vault (with debt) exists: USE 1 , 2.1 or 2.2
       * */
      /* Check the amount of fyTokens potentially recieved */
      const lpReceived = burnFromStrategy(
        strategy?.strategyPoolBalance?.bn!,
        strategy?.strategyTotalSupply?.bn!,
        input.bn
      );
      const [_baseReceived, _fyTokenReceived] = burn(
        strategySeries.baseReserves.bn,
        strategySeries.fyTokenRealReserves.bn,
        strategySeries.totalSupply.bn,
        lpReceived
      );
      // diagnostics && console.log('burnt (base, fytokens)', _baseReceived.toString(), _fyTokenReceived.toString());

      if (_fyTokenReceived.gt(borrowAndPoolVault?.accruedArt.bn)) {
        /**
         * Fytoken received greater than debt : USE REMOVE OPTION 2.1 or 2.2
         * */
        // diagnostics &&
        //   console.log(
        //     'FyTokens received will be greater than debt: an extra sellFytoken trade is required: REMOVE OPTION 2.1 or 2.2 '
        //   );
        const _extraFyTokensToSell = _fyTokenReceived.sub(borrowAndPoolVault.accruedArt.bn);
        // diagnostics && console.log(_extraFyTokensToSell.toString(), 'FyTokens Need to be sold');

        const _extraFyTokenValue = sellFYToken(
          strategySeries!.baseReserves.bn,
          strategySeries!.fyTokenRealReserves.bn,
          _extraFyTokensToSell,
          secondsToFrom(strategySeries!.maturity.toString()),
          strategySeries!.ts,
          strategySeries!.g2,
          strategySeries!.decimals
        );

        if (_extraFyTokenValue.gt(ZERO_BN)) {
          /**
           * CASE> extra fyToken TRADE IS POSSIBLE :  USE REMOVE OPTION 2.1
           * */
          const totalValue = _baseReceived.add(_extraFyTokenValue); // .add(_fyTokenReceived);
          return [bnToW3Number(totalValue, strategySeries.decimals), ZERO_W3NUMBER];
        } else {
          /**
           * CASE> extra fyToken TRADE NOT POSSIBLE ( limited by protocol ): USE REMOVE OPTION 2.2
           * */
          const _fyTokenVal = _fyTokenReceived.sub(borrowAndPoolVault.accruedArt.bn);
          const _baseVal = _baseReceived; // .add(matchingVault.art);
          return [bnToW3Number(_baseVal, strategySeries.decimals), bnToW3Number(_fyTokenVal, strategySeries.decimals)];
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
        return [bnToW3Number(_value, strategySeries.decimals), ZERO_W3NUMBER];
      }
    } else {
      /**
       * SCENARIO > No matching vault exists : USE REMOVE OPTION 4
       * */
      /* Check the amount of fyTokens potentially recieved */
      const lpReceived = burnFromStrategy(
        strategy!.strategyPoolBalance?.bn!,
        strategy!.strategyTotalSupply?.bn!,
        input.bn
      );
      const [_baseReceived, _fyTokenReceived] = burn(
        strategySeries!.baseReserves.bn,
        strategySeries!.fyTokenRealReserves.bn,
        strategySeries!.totalSupply.bn,
        lpReceived
      );

      /* Calculate the token Value */
      const [tokenSellValue, totalTokenValue] = strategyTokenValue(
        input.bn,
        strategy?.strategyTotalSupply?.bn!,
        strategy?.strategyPoolBalance?.bn!,
        strategySeries!.baseReserves.bn,
        strategySeries!.fyTokenRealReserves.bn,
        strategySeries!.totalSupply.bn,
        strategySeries!.getTimeTillMaturity(),
        strategySeries!.ts,
        strategySeries!.g2,
        strategySeries!.decimals
      );

      // diagnostics && console.log('NO VAULT : pool trade is possible  : USE REMOVE OPTION 4.1 ');
      if (tokenSellValue.gt(ZERO_BN)) return [bnToW3Number(totalTokenValue, strategySeries.decimals), ZERO_W3NUMBER];
      // diagnostics && console.log('NO VAULT : trade not possible : USE REMOVE OPTION 4.2');
      return [
        bnToW3Number(_baseReceived, strategySeries.decimals),
        bnToW3Number(_fyTokenReceived, strategySeries.decimals),
      ];
    }
  })
);

/**
 * Check if not all liquidity can be removed, and a partial removal is required.
 * @category Pool | Remove Liquidity
 */
export const isPartialRemoveRequiredø: Observable<boolean> = removeLiquidityReturnø.pipe(
  map((removals) => {
    //diagnostics &&  console.log( 'partial removal is required')
    const areFyTokensReturned = removals[1].bn.gt(ZERO_BN);
    return areFyTokensReturned;
  })
);
