import {
  decimalNToDecimal18,
  buyBase,
  calculateCollateralizationRatio,
  calculateMinCollateral,
  calcLiquidationPrice,
} from '@yield-protocol/ui-math';
import { BigNumber } from 'ethers';
import { combineLatest, filter, map, Observable, share } from 'rxjs';
import { selectedø } from '../observables';
import { ONE_BN, ZERO_BN } from '../utils';
import { getAssetPairId, ratioToPercent } from '../utils/yieldUtils';
import { assetPairMapø } from '../observables/assetPairMap';
import { borrowInputø, collateralInputø } from './input';

import { appConfig$ } from '../observables/appConfig';
import { IAssetPair } from '../types';
const diagnostics = appConfig$.value.diagnostics;

/**
 * INTERNAL:
 * Keeps the track of the current selectedPair
 * */
const _selectedPairø = combineLatest([selectedø, assetPairMapø]).pipe(
  map(([selected, pairMap]) => {
    if (!!selected.ilk && !!selected.base) {
      const _pairId = getAssetPairId(selected.base.id, selected.ilk.id);
      return pairMap.get(_pairId);
    }
    return undefined;
  }),
  share()
);

/**
 * INTERNAL:
 *
 * Tracks the total DEBT value based on input
 * returns decimal18 vals for math calcs
 *
 * RETURNS [ totalDebt, exisitingDebt ] in decimals18
 */
const _totalDebtWithInputø = combineLatest([borrowInputø, selectedø]).pipe(
  // filter(([, selected]) => !!selected.series),
  map(([debtInput, selected]) => {
    const { vault, series } = selected; // we can safetly assume 'series' is defined - not vault.
    const existingDebt_ = vault?.accruedArt || ZERO_BN;
    /* NB NOTE: this whole function ONLY deals with decimal18, existing values are converted to decimal18 */
    const existingDebtAsWei = decimalNToDecimal18(existingDebt_, series!.decimals);
    const newDebt = debtInput.gt(ZERO_BN)
      ? buyBase(
          series!.baseReserves,
          series!.fyTokenReserves,
          debtInput,
          series!.getTimeTillMaturity(),
          series!.ts,
          series!.g2,
          series!.decimals
        )
      : ZERO_BN;
    const newDebtAsWei = decimalNToDecimal18(newDebt, series!.decimals);
    const totalDebt = existingDebtAsWei.add(newDebtAsWei);
    diagnostics && console.log('Total Debt (d18): ', totalDebt.toString());
    return [totalDebt, existingDebtAsWei]; // as decimal18
  }),
  share()
);

/**
 * INTERNAL:
 *
 * Return the total collateral value
 * NOTE: this function ONLY deals with decimal18, existing values are converted to decimal18
 *
 * returns decimal18 vals for math calcs
 *
 * RETURNS [ totalCollateral, exisitingCollateral] in decimals18 for comparative calcs
 */
const _totalCollateralWithInputø = combineLatest([collateralInputø, selectedø]).pipe(
  map(([collInput, selected]) => {
    const { vault, ilk } = selected;
    if (ilk) {
      const existingCollateral_ = vault?.ink || ZERO_BN; // if no vault simply return zero.
      const existingCollateralAsWei = decimalNToDecimal18(existingCollateral_, ilk.decimals);

      /* TODO: there is a weird bug if inputting before selecting ilk. */
      const newCollateralAsWei = decimalNToDecimal18(collInput, ilk.decimals);
      const totalCollateral = existingCollateralAsWei.add(newCollateralAsWei);
      diagnostics && console.log('Total Collateral (d18): ', totalCollateral.toString());
      return [totalCollateral, existingCollateralAsWei]; // as decimal18
    }
    diagnostics && console.warn('Hey fren. Make sure an Ilk is selected!');
    return [];
  }),
  share()
);

/**
 * The PREDICTED collateralization ratio based on the current INPUT expressed as a ratio
 * @category Borrow | Collateral
 * */
export const collateralizationRatioø = combineLatest([
  _totalDebtWithInputø,
  _totalCollateralWithInputø,
  _selectedPairø,
]).pipe(
  map(([totalDebt, totalCollat, assetPair]) => {
    if (
      /* if all the elements exist and are greater than 0 */
      totalCollat[0]?.gt(ZERO_BN) &&
      totalDebt[0]?.gt(ZERO_BN) &&
      !!assetPair
    ) {
      /* NOTE: this function ONLY deals with decimal18, existing values are converted to decimal18 */
      const pairPriceInWei = decimalNToDecimal18(assetPair.pairPrice, assetPair.baseDecimals);
      const ratio = calculateCollateralizationRatio(totalCollat[0], pairPriceInWei, totalDebt[0], false);
      diagnostics && console.log('Collateralisation ratio:', ratio);
      return ratio;
    }
    return undefined;
  }),
  share()
);

/**
 * The PREDICTED collateralization based on the current INPUT parameters expressed as a PERCENTAGE
 * ( for display )
 * @category Borrow | Collateral
 * */
export const collateralizationPercentø = collateralizationRatioø.pipe(
  map((ratio) => ratioToPercent(ratio!, 2)),
  share()
);

export const isUndercollateralizedø: Observable<boolean> = combineLatest([]).pipe(share());
export const isUnhealthyCollateralizationø: Observable<boolean> = combineLatest([]).pipe(share());

/**
 * The minimum protocol allowed collaterallisation level expressed as a ratio
 * @category Borrow | Collateral
 * */
export const minCollateralRatioø = _selectedPairø.pipe(
  /* Only emit if assetPair exists */
  filter((assetPair) => !!assetPair),
  /* filtered: we can safelty assume assetPair is defined in here. */
  map((assetPair) => assetPair!.minRatio),
  share()
);

/**
 * The minimum protocol-allowed collaterallisation level expressed as a percentage
 * ( for display )
 * @category Borrow | Collateral
 * */
export const minCollateralPercentø = minCollateralRatioø.pipe(
  map((ratio) => ratioToPercent(ratio, 2)),
  share()
);

/**
 * The minimum collateral required to meet the minimum protocol-allowed levels
 * @category Borrow | Collateral
 * */
export const minCollateralRequiredø = combineLatest([
  _selectedPairø,
  minCollateralRatioø,
  _totalDebtWithInputø,
  _totalCollateralWithInputø,
]).pipe(
  map(([assetPair, minCollatRatio, totalDebt, totalCollat]) => {
    const _pairPriceInWei = decimalNToDecimal18(assetPair!.pairPrice, assetPair!.baseDecimals);
    return calculateMinCollateral(_pairPriceInWei, totalDebt[0], minCollatRatio!.toString(), totalCollat[1]);
  }),
  share()
);

/**
 *  Minimum Safe collatearalization level expressed asa ratio
 *  TODO: would this be better specified with the assetPair data? - possibly
 * @category Borrow | Collateral
 * */
export const minimumSafeRatioø = minCollateralRatioø.pipe(
  map((minRatio: number) => {
    if (minRatio >= 1.5) return minRatio + 1; // eg. 150% -> 250%
    if (minRatio < 1.5 && minRatio >= 1.4) return minRatio + 0.65; // eg. 140% -> 200%
    if (minRatio < 1.4 && minRatio > 1.1) return minRatio + 0.1; // eg. 133% -> 143%
    return minRatio; // eg. 110% -> 110%
  }),
  share()
);

/**
 *  Minimum Safe collatearalization level expressed as a percentage
 * @category Borrow | Collateral
 * */
export const minimumSafePercentø = minimumSafeRatioø.pipe(
  map((ratio) => ratioToPercent(ratio, 2)),
  share()
);

/**
 * Maximum collateral based selected Ilk and users balance
 * @category Borrow | Collateral
 */
export const maxCollateralø = selectedø.pipe(
  map((selectedø) => (selectedø.ilk ? selectedø.ilk.balance : undefined)),
  share()
);

/**
 * Calculate the maximum amount of collateral that can be removed
 * without leaving the vault undercollateralised
 * @category Borrow | Collateral
 * */
export const maxRemovableCollateralø = combineLatest([
  selectedø,
  _totalCollateralWithInputø,
  minCollateralRequiredø,
]).pipe(
  map(([selected, totalCollat, minReqd]) => {
    const { vault } = selected;
    if (vault) {
      return vault.accruedArt.gt(minReqd) ? totalCollat[1].sub(ONE_BN) : totalCollat[1];
    }
    return undefined;
  }),
  share()
);

/**
 * Price at which the vault will get liquidated
 * @category Borrow | Collateral
 * */
export const vaultLiquidatePriceø = combineLatest([selectedø, _selectedPairø]).pipe(
  filter(([selected, pairInfo]) => !!selected.vault && !!pairInfo),
  map(([selected, pairInfo]) =>
    calcLiquidationPrice(selected.vault!.ink_, selected.vault!.accruedArt_, pairInfo!.minRatio)
  ),
  share()
);

/**
 * Pre Transaction estimated Price at which a vault / pair  will get liquidated
 * based on collateral and debt INPUT ( and existing colalteral and debt)
 * @category Borrow | Collateral
 * */
export const estimatedLiquidatePriceø = combineLatest([
  _totalDebtWithInputø,
  _totalCollateralWithInputø,
  _selectedPairø,
]).pipe(
  filter(([, pairInfo]) => !!pairInfo),
  map(([ink, art, pairInfo]) => calcLiquidationPrice(ink[0].toString(), art[0].toString(), pairInfo!.minRatio)),
  share()
);
