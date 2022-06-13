import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import {
  Observable,
  BehaviorSubject,
  share,
  Subject,
  shareReplay,
  withLatestFrom,
  mergeMap,
  combineLatest,
  take,
} from 'rxjs';
import { defaultAccountProvider, defaultProviderMap } from '../config/defaultprovider';
import { getBrowserCachedValue, setBrowserCachedValue } from '../utils';
import { appConfigø } from './appConfig';
declare const window: any;

/** @internal */
export const chainIdø: Observable<number> = appConfigø.pipe(
  mergeMap(async (config) => {
    /* if in a browser environment */
    if (typeof window !== 'undefined') {
      if ((window as any).ethereum) {
        // first try from the injected provider
        const injectedId = await (window as any).ethereum.request({ method: 'eth_chainId' });
        console.log('Injected chainId:', injectedId);
        return parseInt(injectedId, 16);
      }
      const fromCache = getBrowserCachedValue(`lastChainIdUsed`);
      console.log('ChainId from cache:', fromCache);
      return fromCache; // second, from the last id used in the cache
    }
    /* in a non-browser environment : return 1 */
    console.log('ChainId from default:', config.defaultChainId);
    return config.defaultChainId; // defaults to the defaultChainId in the settings
    // console.log( config)
    // return chainId
  }),
  shareReplay(1)
);

/**
 * When the chainId changes, we cache the previous value, and then refresh the browser
 * */
export const updateChainId = (chainId: number) => {
  /* Cache the last chain used browser-side  */
  setBrowserCachedValue(`lastChainIdUsed`, chainId);
  location.reload();
};

/** @internal */
export const provider$: Subject<ethers.providers.BaseProvider> = new Subject();
export const providerø: Observable<ethers.providers.BaseProvider> = provider$.pipe(shareReplay(1));
export const updateProvider = (newProvider: ethers.providers.BaseProvider) => {
  provider$.next(newProvider); // update to whole new protocol
};

/**
 * update the provider on start ( when there is a chainId and appConfig)
 * */
combineLatest([chainIdø, appConfigø])
.pipe(take(1)) // once on start
.subscribe(([chainId, appConfig]) => {
  console.log(chainId, appConfig);
  const defaultProvider =  defaultProviderMap.get(chainId);
  defaultProvider && console.log(' default PRovider', defaultProvider  );
  provider$.next( defaultProvider as ethers.providers.BaseProvider )
  // console.log( 'All good to go!: ', chainId, appConfig )
});

/** @internal */
export const account$ = new BehaviorSubject(undefined as string | undefined);
export const accountø: Observable<string | undefined> = account$.pipe(shareReplay(1));
export const updateAccount = (newAccount: string) => {
  /* Check if account is a vaild address before assigning */
  const isValidAcc = ethers.utils.isAddress(newAccount);
  account$.next(isValidAcc ? newAccount : undefined);
};

/**
 * The accountProvider is the sign provider (web3Provider) that handles the user account, signing and transacting.
 * It also adds a number of listeners to monitor account changes etc.
 **/
/** @internal */
export const accountProvider$ = new BehaviorSubject(defaultAccountProvider);
export const accountProviderø: Observable<ethers.providers.Web3Provider> = accountProvider$.pipe(shareReplay(1));
export const updateAccountProvider = (newProvider: ethers.providers.Web3Provider) => {
  // TODO: wrap the EIP provider into a ethers.web3Provider if required.
  accountProvider$.next(newProvider); // update to whole new protocol
};

/**
 * Handle any events on the accountProvider ( web3Provider )
 * */
accountProviderø.pipe(withLatestFrom(appConfigø)).subscribe(async ([accProvider, appConfig]) => {
  console.log('HERE finally!! asdasdsdsda');

  /**
   * MetaMask requires requesting permission to connect users accounts >
   * however, we can attempt to skip this if the user already has a connected account
   * */
  try {
    appConfig.autoConnectAccountProvider && account$.next((await accProvider.send('eth_requestAccounts', []))[0]);
  } catch (e) {
    console.log(e);
  }

  /**
   * Attach listeners for EIP1193 events
   * (Unless supressed, or not in a browser environment )
   * */
  if (typeof window !== 'undefined' && !appConfig.supressInjectedListeners) {
    window.ethereum.on('accountsChanged', (addr: string[]) => account$.next(addr[0]));
    /* Reload the page on every network change as per reccommendation */
    window.ethereum.on('chainChanged', (id: string) => updateChainId(parseInt(id, 16)));
    /* Connect/Disconnect listeners */
    window.ethereum.on('connect', () => console.log('connected'));
    window.ethereum.on('disconnect', () => console.log('disconnected'));
  }
});
