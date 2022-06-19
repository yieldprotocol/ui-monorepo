import { format } from 'date-fns';
import { ethers, BigNumber } from 'ethers';
import { bytesToBytes32, calcAccruedDebt } from '@yield-protocol/ui-math';
import { BehaviorSubject, Observable, share, combineLatest, filter, take, withLatestFrom, shareReplay } from 'rxjs';

import { buildVaultMap } from '../initProtocol/buildVaultsRoot';
import { ISeries, IVault, IVaultRoot, IYieldConfig, IYieldProtocol, MessageType } from '../types';
import { ZERO_BN } from '../utils/constants';
import { account$, accountø, chainIdø, providerø } from './connection';
import { yieldProtocol$, yieldProtocolø } from './yieldProtocol';
import { sendMsg } from './messages';
import { bnToW3Number } from '../utils/yieldUtils';
import { appConfigø } from './appConfig';

/** @internal */
export const vaultMap$: BehaviorSubject<Map<string, IVault>> = new BehaviorSubject(new Map([]));
export const vaultMapø: Observable<Map<string, IVault>> = vaultMap$.pipe(shareReplay(1));

/* Update vaults function */
export const updateVaults = async (vaultList?: IVault[] | IVaultRoot[], suppressEventLogQueries:boolean = false) => {
  const list = vaultList !== undefined ? vaultList : Array.from(vaultMap$.value.values());
  /* if there are some vaults: */
  if (list.length) {
    await Promise.all(
      list.map(async (_vault: IVault | IVaultRoot) => {
        const vaultUpdate = await _updateVault(_vault, account$.value as string, yieldProtocol$.value, suppressEventLogQueries);
        vaultMap$.next(new Map(vaultMap$.value.set(_vault.id, vaultUpdate))); // note: new Map to enforce ref update
      })
    );
  } else {
    /* if the list is empty, return an empty vaultMap */
    vaultMap$.next(new Map([]));
  }
};

/**
 *  Observe yieldProtocolø and accountø changes TOGETHER >  Initiate OR Empty VAULT Map
 * */
combineLatest([accountø, yieldProtocolø])
  // only emit if account is defined and yp.cauldron adress exists - indicating protocol has mostly loaded
  .pipe(
    filter(([a, yp]) => a !== undefined && yp.cauldron.address !== ''),
    withLatestFrom(chainIdø, appConfigø, providerø)
  )
  .subscribe(async ([[account, protocol], chainId, appConfig, provider]) => {
    if (account !== undefined) {
      console.log('Getting vaults for: ', account);
      const vaultMap = await buildVaultMap(protocol, provider, account, chainId, appConfig );
      await updateVaults(Array.from(vaultMap.values()), appConfig.suppressEventLogQueries);
      console.log('Vaults loading complete.');
      sendMsg({ message: 'Vaults Loaded', type: MessageType.INTERNAL, id: 'vaultsLoaded'});
    } else {
      /* if account changes and is undefined > EMPTY the vaultMap */
      vaultMap$.next(new Map([]));
    }
  });

const _updateVault = async (
  vault: IVault | IVaultRoot,
  account: string,
  yieldProtocol: IYieldProtocol,
  suppressEventLogQueries: boolean,
): Promise<IVault> => {
  const { seriesRootMap, cauldron, witch, oracleMap } = yieldProtocol;
  const RateOracle = oracleMap.get('RateOracle') as ethers.Contract;

  /* Get dynamic vault data */
  const [
    { ink, art },
    { owner, seriesId, ilkId }, // update balance and series (series - because a vault can have been rolled to another series) */
    liquidations, // get the list of liquidations on this vault - unless supressed
  ] = await Promise.all([
    cauldron.balances(vault.id),
    cauldron.vaults(vault.id),
    suppressEventLogQueries ? [] : witch.queryFilter(witch.filters.Auctioned(bytesToBytes32(vault.id, 12), null), 'earliest', 'latest'),
  ]);

  /* Check for liquidation event date */
  const liquidationDate = liquidations.length ? liquidations[0].args.start.toNumber() : undefined;

  /* check if the series is mature - Note: calc'd from yieldProtocol.seriesMap instead of relying on seriesMap$ observations */
  const series = seriesRootMap.get(seriesId) as ISeries;
  /* Note: If the series is 'ignored' in the appConfig (or undefined) > the series maturity will be considered 'mature' */
  const seriesIsMature = series ? series.maturity - Math.round(new Date().getTime() / 1000) <= 0 : true;

  let accruedArt: BigNumber = art;
  let rateAtMaturity: BigNumber = BigNumber.from('1');
  let rate: BigNumber = BigNumber.from('1');

  if (series && seriesIsMature) {
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

  return {
    ...vault,
    owner, // refreshed in case owner has been updated
    isActive: owner === account, // refreshed in case owner has been updated
    seriesId, // refreshed in case seriesId has been updated
    ilkId, // refreshed in case ilkId has been updated

    ink: bnToW3Number(ink, vault.ilkDecimals),
    art: bnToW3Number(art, vault.baseDecimals),
    accruedArt: bnToW3Number(accruedArt, vault.baseDecimals),

    underLiquidation: witch.address === owner, // check if witch is the owner (in liquidation process)
    hasBeenLiquidated: !!liquidationDate, // TODO redundant ??
    liquidationDate,
    liquidationDate_: liquidationDate ? format(new Date(liquidationDate * 1000), 'dd MMMM yyyy') : undefined,

    rateAtMaturity: bnToW3Number(rateAtMaturity, 18, 2),
    rate: bnToW3Number(rate, 18, 2),
  };
};
