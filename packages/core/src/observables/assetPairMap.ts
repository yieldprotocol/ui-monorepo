import { bytesToBytes32, decimal18ToDecimalN } from '@yield-protocol/ui-math';
import { BigNumber, ethers } from 'ethers';
import { BehaviorSubject, filter, map, Observable, share } from 'rxjs';

import { ORACLES } from '../config/oracles';
import { IAssetPair, ISelected } from '../types';
import { WAD_BN } from '../utils';
import { yieldProtocol$ } from './yieldProtocol';
import { selectedø } from './selected';
import { getAssetPairId } from '../utils/yieldUtils';
import { chainId$ } from './connection';

/** @internal */
export const assetPairMap$: BehaviorSubject<Map<string, IAssetPair>> = new BehaviorSubject(new Map([]));
export const assetPairMapø: Observable<Map<string, IAssetPair>> = assetPairMap$.pipe(share());

/**
 *
 * Watch selected elements, on every change if both a base and ilk are selected,
 * and they don't already exist in the assetPairMap, update them.
 *
 * */
selectedø
  .pipe(
    /* Only handle events that have both a selected base and ilk, and are NOT already in the assetPairMap */
    filter((s: ISelected) => {
      const bothBaseAndIlkSelected = !!s.base && !!s.ilk;
      const mapHasPair = s.base && s.ilk && assetPairMap$.value.has( getAssetPairId(s.base.id, s.ilk!.id) );
      // mapHasPair && console.log ( 'Selected base and asset already in map');
      return (bothBaseAndIlkSelected === true && mapHasPair === false);
    }),
    map(({ base, ilk }: ISelected) => [base, ilk])
  )
  .subscribe(([base, ilk]) => updatePair(base?.id!, ilk?.id!));

/* Update Assets function */
export const updatePair = async (baseId: string, ilkId: string): Promise<IAssetPair | null> => {

  const { cauldron, assetRootMap, oracleMap } = yieldProtocol$.value;
  
  const chainId = chainId$.value;
  // const cauldron = contractMap.get('Cauldron');
  const oracleName = ORACLES.get(chainId || 1)
    ?.get(baseId)
    ?.get(ilkId);

  const PriceOracle = oracleMap.get(oracleName!);
  const base = assetRootMap.get(baseId);
  const ilk = assetRootMap.get(ilkId);

  // console.log('Fetching Asset Pair Info: ', bytesToBytes32(baseId, 6), bytesToBytes32(ilkId, 6));

  /* if all the parts are there update the pairInfo */
  if (cauldron && PriceOracle && base && ilk) {
    // updateState({ type: PriceState.START_PAIR_FETCH, payload: pairId });
    const pairId = getAssetPairId(base!.id, ilk!.id);

    // /* Get debt params and spot ratios */
    const [{ max, min, sum, dec }, { ratio }] = await Promise.all([
      cauldron.debt(baseId, ilkId),
      cauldron.spotOracles(baseId, ilkId),
    ]);

    /* Get pricing if available */
    let price: BigNumber;
    try {
      // eslint-disable-next-line prefer-const
      [price] = await PriceOracle.peek(
        bytesToBytes32(ilkId, 6),
        bytesToBytes32(baseId, 6),
        decimal18ToDecimalN(WAD_BN, ilk.decimals!)
      );
    } catch (error) {
      price = ethers.constants.Zero;
    }

    const newPair: IAssetPair = {
      id: pairId,
      baseId,
      ilkId,
      limitDecimals: dec,
      minDebtLimit: BigNumber.from(min).mul(BigNumber.from('10').pow(dec)), // NB use limit decimals here > might not be same as base/ilk decimals
      maxDebtLimit: max.mul(BigNumber.from('10').pow(dec)), // NB use limit decimals here > might not be same as base/ilk decimals
      pairTotalDebt: sum,
      pairPrice: price, // value of 1 ilk (1x10**n) in terms of base.
      minRatio: parseFloat(ethers.utils.formatUnits(ratio, 6)), // pre-format ratio
      baseDecimals: base.decimals!,
      ilkDecimals: ilk.decimals!,
      oracle: oracleName || '',
    };

    /* update the assetPairMap */
    assetPairMap$.next( assetPairMap$.value.set( pairId, newPair) )
    console.log('New Asset Pair Info: ', newPair);

    /* return the new pair so we don't have to go looking for it again after assetpairMap has been updated */
    return newPair;
  }

  /* if no cauldron, base or ilk, or priceOracle return null */
  return null;

};
