import { format } from 'date-fns';
import { ethers, BigNumber } from 'ethers';
import { bytesToBytes32, calcAccruedDebt } from '@yield-protocol/ui-math';
import { BehaviorSubject, Observable, share, combineLatest, filter, take } from 'rxjs';

import { buildVaultMap } from '../initProtocol/buildVaultMap';
import { ISeries, IVault, IVaultRoot, IYieldProtocol, MessageType } from '../types';
import { ZERO_BN } from '../utils/constants';
import { truncateValue } from '../utils/appUtils';
import { account$, accountø, chainIdø } from './connection';
import { yieldProtocol$, yieldProtocolø } from './yieldProtocol';
import { sendMsg } from './messages';

/** @internal */
export const vaultMap$: BehaviorSubject<Map<string, IVault>> = new BehaviorSubject(new Map([]));
export const vaultMapø: Observable<Map<string, IVault>> = vaultMap$.pipe(share());

/* Update vaults function */
export const updateVaults = async (vaultList?: IVault[] | IVaultRoot[]) => {
  const list = vaultList !== undefined ? vaultList : Array.from(vaultMap$.value.values());
  /* if there are some vaults: */
  if (list.length) {
    list.map(async (_vault: IVault | IVaultRoot) => {
      const vaultUpdate = await _updateVault(_vault, account$.value as string, yieldProtocol$.value);
      vaultMap$.next(new Map(vaultMap$.value.set(_vault.id, vaultUpdate))); // note: new Map to enforce ref update
    });
  }
  /* if the list is empty, return an empty vaultMap */
  vaultMap$.next(new Map([]));
};

/**
 *  Observe yieldProtocol$ and account$ changes TOGETHER >  Initiate or Empty VAULT Map
 * */
combineLatest([accountø, yieldProtocolø, chainIdø])
  // only emit if account is defined and yp.cauldron adress exists - indicating protocol has mostly loaded
  .pipe( filter( ([a,yp]) => a !== undefined && yp.cauldron.address !== ''))
  .subscribe(async ([_account, _protocol, _chainId]) => {
    if (_account !== undefined ) {
      console.log('Getting vaults for: ', _account);
      const vaultMap = await buildVaultMap(_protocol, _account, _chainId);
      console.log('vaults: ', Array.from(vaultMap.values()));
      await updateVaults(Array.from(vaultMap.values()));
      sendMsg({ message: 'Vaults Loaded', type: MessageType.INTERNAL });
    } else {
      /* if account changes and is undefined > EMPTY the vaultMap */
      vaultMap$.next(new Map([]));
    }
  });

const _updateVault = async (
  vault: IVault | IVaultRoot,
  account: string,
  yieldProtocol: IYieldProtocol
): Promise<IVault> => {
  const { seriesRootMap, cauldron, witch, oracleMap, assetRootMap } = yieldProtocol;
  const RateOracle = oracleMap.get('RateOracle') as ethers.Contract;

  /* Get dynamic vault data */
  const [
    { ink, art },
    { owner, seriesId, ilkId }, // update balance and series (series - because a vault can have been rolled to another series) */
    liquidations, // get the list of liquidations on this vault
  ] = await Promise.all([
    cauldron.balances(vault.id),
    cauldron.vaults(vault.id),
    witch.queryFilter(witch.filters.Auctioned(bytesToBytes32(vault.id, 12), null), 'earliest', 'latest'),
  ]);

  /* Check for liquidation event date */
  const liquidationDate = liquidations.length ? liquidations[0].args.start.toNumber() : undefined;

  /* check if the series is mature - Note: calc'd from yieldProtocol.seriesMap instead of relying on seriesMap$ observations */
  const series = seriesRootMap.get(seriesId) as ISeries;
  const seriesIsMature = series.maturity - Math.round(new Date().getTime() / 1000) <= 0;
  /* Note: get base and ilk roots from  yieldProtocol.rootMaps - instead of assetMap$ reliance */
  const base = assetRootMap.get(vault.baseId);
  const ilk = assetRootMap.get(ilkId);

  let accruedArt: BigNumber = art;
  let rateAtMaturity: BigNumber = BigNumber.from('1');
  let rate: BigNumber = BigNumber.from('1');

  if (seriesIsMature) {
    rateAtMaturity = await cauldron.ratesAtMaturity(seriesId);
    [rate] = await RateOracle.peek(
      bytesToBytes32(vault.baseId, 6),
      '0x5241544500000000000000000000000000000000000000000000000000000000', // bytes for 'RATE'
      '0'
    );
    [accruedArt] = rateAtMaturity.gt(ZERO_BN)
      ? calcAccruedDebt(rate, rateAtMaturity, art)
      : calcAccruedDebt(rate, rate, art);
  }

  const ink_ = ilk && truncateValue(ethers.utils.formatUnits(ink, ilk.decimals), ilk.digitFormat);
  const art_ = base && truncateValue(ethers.utils.formatUnits(art, vault.baseDecimals), base.digitFormat);
  const accruedArt_ = base && truncateValue(ethers.utils.formatUnits(accruedArt, vault.baseDecimals), base.digitFormat);

  return {
    ...vault,
    owner, // refreshed in case owner has been updated
    isActive: owner === account, // refreshed in case owner has been updated
    seriesId, // refreshed in case seriesId has been updated
    ilkId, // refreshed in case ilkId has been updated

    ink,
    art,
    accruedArt,

    ink_: ink_ || '0', // for display purposes only
    art_: art_ || '0', // for display purposes only
    accruedArt_: accruedArt_ || '0', // display purposes

    underLiquidation: witch.address === owner, // check if witch is the owner (in liquidation process)
    hasBeenLiquidated: !!liquidationDate, // TODO redundant ??
    liquidationDate,
    liquidationDate_: liquidationDate ? format(new Date(liquidationDate * 1000), 'dd MMMM yyyy') : undefined,

    rateAtMaturity,
    rate,
    rate_: truncateValue(ethers.utils.formatUnits(rate, 18), 2),
  };
};
