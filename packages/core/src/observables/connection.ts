import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { Observable, BehaviorSubject, share, Subject, from, ReplaySubject, concatMap, shareReplay, withLatestFrom } from 'rxjs';
import { getDefaultProvider, defaultAccountProvider } from '../config/defaultprovider';
import { getBrowserCachedValue, setBrowserCachedValue } from '../utils';
import { appConfigø } from './appConfig';
declare const window: any;


/**
 * FIRST LOAD > Handle initial setup protocol with DEFAULTS on FIRST LOAD
 */
 export const chainId = (async () => {
  /* if in a browser environment */
  if (typeof window !== 'undefined') {
    if ((window as any).ethereum) { // first try from the injected provider
      const injectedId = await (window as any).ethereum.request({ method: 'eth_chainId' });
      console.log('Injected chainId:', injectedId );
      return parseInt(injectedId, 16);
    }
    const fromCache = getBrowserCachedValue(`lastChainIdUsed`)
    console.log('ChainId from cache:', fromCache );
    return fromCache; // second, from the last id used in the cache
  }

  /* in a non-browser environment : return 1 */
  // console.log('ChainId from default:', appConfig$.value.defaultChainId);
  return 1; // defaults to the defaultChainId in the settings

})();

// /** @internal */
export const chainId$: Subject<number> = new Subject();
export const chainIdø: Observable<number> = chainId$.pipe(shareReplay());

/* When the chainId changes, we refresh the browser */ 
export const updateChainId = (chainId: number) => {
  /* Cache the last chain used browser-side  */
  setBrowserCachedValue(`lastChainIdUsed`, chainId);
  location.reload();
};


/** @internal */
export const provider$: Subject<ethers.providers.BaseProvider> = new Subject();
export const providerø: Observable<ethers.providers.BaseProvider> = provider$.pipe(
  shareReplay()
);
export const updateProvider = (newProvider: ethers.providers.BaseProvider) => {
  provider$.next(newProvider); // update to whole new protocol
};

/** @internal */
export const account$ = new BehaviorSubject(undefined as string | undefined);
export const accountø: Observable<string | undefined> = account$.pipe(share());
export const updateAccount = (newAccount: string) => {
  /* Check if account is a vaild address before assigning */
  const isValidAcc  = ethers.utils.isAddress(newAccount);
  account$.next(isValidAcc ? newAccount : undefined );
};

/**
 * The accountProvider is the sign provider (web3Provider) that handles the user account, signing and transacting.
 * It also adds a number of listeners to monitor account changes etc.
 **/
/** @internal */
export const accountProvider$ = new BehaviorSubject(defaultAccountProvider);
export const accountProviderø: Observable<ethers.providers.Web3Provider> = accountProvider$.pipe(shareReplay());
export const updateAccountProvider = (newProvider: ethers.providers.Web3Provider) => {
  // TODO: wrap the EIP provider into a ethers.web3Provider if required.
  accountProvider$.next(newProvider); // update to whole new protocol
};

/* handle any events on the accountProvider ( web3Provider ) */
accountProviderø
.pipe(withLatestFrom(appConfigø))
.subscribe(async ([accProvider, appConfig]) => {
  /**
   * MetaMask requires requesting permission to connect users accounts >
   * however, we can attempt to skip this if the user already has a connected account
   * */
  try {
    appConfig.autoConnectAccountProvider &&
      account$.next((await accProvider.send('eth_requestAccounts', []))[0]);
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
