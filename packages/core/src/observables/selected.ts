import { Observable, BehaviorSubject, share, map, tap, takeWhile, takeUntil, distinctUntilChanged, takeLast, take, withLatestFrom, skip, filter, shareReplay } from 'rxjs';
import { WETH } from '../config/assets';
import { IAsset, ISelected, ISeries, IStrategy, IVault, MessageType } from '../types';
import { appConfigø } from './appConfig';
import { assetMap$, assetsø } from './assets';
import { internalMessagesø, messagesø, sendMsg } from './messages';
import { seriesMap$, seriesMapø } from './seriesMap';
import { strategyMap$ } from './strategyMap';
import { vaultMap$ } from './vaultMap';

const initSelection: ISelected = {
  base: null,
  ilk: null,
  series: null,
  futureSeries: null,
  vault: null,
  strategy: null,
};

/** @internal */
export const selected$: BehaviorSubject<ISelected> = new BehaviorSubject(initSelection);
export const selectedø: Observable<ISelected> = selected$.pipe(shareReplay(1));

/**
 * Set first of array as default series(base gets automatically selected based on the series choice, 
 * this automatically selects the base)
 * */
internalMessagesø.pipe(
  filter( (messages) => messages.has('seriesLoaded')), 
  take(1), // only take one for first load
  withLatestFrom(seriesMapø, appConfigø)
  ).subscribe(([, [sMap], appConfig]) => {
    selectSeries(appConfig.defaultSeriesId || [...sMap][0])
});

/**
 * Set the selected Ilk once on load (either )
 * TODO: add the selected Ilk preference to the the default app config. 
 * */
 internalMessagesø.pipe(
  filter( (messages) => messages.has('assetsLoaded')), 
  take(1), // only take one for first load
  // withLatestFrom(assetsø, appConfigø)
  ).subscribe(([]) => {
    selectIlk( WETH )
});


/**
 *  Functions to selecting elements
 */
export const selectBase = (asset?: IAsset | string) => {

  const base = (asset as IAsset)?.id ? (asset as IAsset) : assetMap$.value.get(asset as string);
  /* only switch the base if the asset in question is a valid YIELD base */
  if (!base?.isYieldBase) { sendMsg({message:'Not a Yield base asset'}) }
  else {
  /* Update the selected$ */
  selected$.next({ 
    ...selected$.value, 
    base: base || null,
    /* if a base is selected, then auto select the first 'mature' series that has that base */
    series: [...seriesMap$.value.values() ].find((s: ISeries) => s.baseId === base!.id && !s.isMature()  ) || null
  });
  console.log(base ? `Selected Base: ${base.id}` : 'Bases unselected');
  }
};

export const selectIlk = (asset?: IAsset | string) => {
  const ilk = (asset as IAsset)?.id ? (asset as IAsset) : assetMap$.value.get(asset as string);
  /* Update the selected$ */
  selected$.next({
    ...selected$.value,
    ilk: ilk || null,
  });
  console.log(ilk ? `Selected Ilk: ${ilk.id}` : 'Ilks unselected');
};

export const selectSeries = (series: ISeries | string, futureSeries: boolean = false) => {

  /* Try to get the series if argument is a string */
  const _series = (series as ISeries)?.id ? (series as ISeries) : seriesMap$.value.get(series as string);

  /* Update the selected$  (either series or futureSeries) */
  futureSeries
    ? selected$.next({ ...selected$.value, futureSeries: _series || null })
    : selected$.next({
        ...selected$.value,
        series: _series || null,
        /* Ensure the selectBase always matches the selected series */
        base: assetMap$.value.get(_series!.baseId) || selected$.value.base,
      });
  /* log to console */
  console.log(
    _series
      ? `Selected ${futureSeries ? '':'future '} Series: ${_series.id}`
      : `${futureSeries? '': 'future '} Series unselected`
  );
};

export const selectVault = (vault?: IVault | string) => { 
  if ( vault ) {
    const _vault = (vault as IVault).id ? (vault as IVault) : vaultMap$.value.get(vault as string);
    /* Update the selected$ */
    selected$.next({
      ...selected$.value,
      vault: _vault || null,
      /* Ensure the other releant components match the vault */
      base: assetMap$.value.get(_vault!.baseId) || selected$.value.base,
      ilk: assetMap$.value.get(_vault!.ilkId) || selected$.value.ilk,
      series: seriesMap$.value.get(_vault!.seriesId) || selected$.value.series,
    });
  }
  /* if undefined sent in, deselect vault only */
  !vault && selected$.next({ ...selected$.value, vault: null});
  console.log(vault ? `Selected Vault: ${ (vault as IVault)?.id || vault}` : 'Vault Unselected');
};

export const selectStrategy = (strategy?: IStrategy | string) => {
  if ( strategy ) {
  const _strategy = (strategy as IStrategy).id ? (strategy as IStrategy) : strategyMap$.value.get(strategy as string);
  /* Update the selected$ */
  selected$.next({
    ...selected$.value,
    strategy: _strategy || null,
    /* Ensure the other releant components match the vault */
    base: assetMap$.value.get(_strategy!.baseId) || selected$.value.base,
    // series: seriesMap$.value.get(_strategy!.currentSeries!.id) || selected$.value.series,
  });
}
  /* if undefined sent in, deselect vault only */
  !strategy && selected$.next({ ...selected$.value, vault: null});
  console.log(strategy ? `Selected Strategy: ${ (strategy as IStrategy)?.id || strategy}` : 'Vaults unselected');
};
