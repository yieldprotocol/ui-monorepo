import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { Observable, BehaviorSubject, share, Subject, from, ReplaySubject } from 'rxjs';
import { getDefaultProvider, defaultAccountProvider } from '../config/defaultprovider';
import { getBrowserCachedValue, setBrowserCachedValue } from '../utils';
import { appConfig$ } from './appConfig';
declare const window: any;

// const getDefaultChainId = async () : Promise<number> => {
//   /* if in a browser environment */
//   if (typeof window !== 'undefined') {
//     if ((window as any).ethereum) {
//       // first try from the injected provider
//       const injectedId = await (window as any).ethereum.request({ method: 'eth_chainId' });
//       return parseInt(injectedId, 16);
//     }
//     const fromCache = getBrowserCachedValue(`lastChainIdUsed`);
//     return fromCache; // second, from the last id used in the cache
//   }
//   /* in a non-browser environment */
//   return appConfig$.value.defaultChainId; // defaults to the defaultChainId in the settings
// };

/** @internal */
export const chainId$ = new BehaviorSubject( 1 );
export const chainIdø: Observable<number> = chainId$.pipe(share());
export const updateChainId = (chainId: number) => {
  /* Cache the last chain used browser-side  */
  setBrowserCachedValue(`lastChainIdUsed`, chainId);
  // chainId$.next( chainId ); // no need here
  location.reload();
};

/**
 * FIRST LOAD > Handle initial setup protocol with DEFAULTS on FIRST LOAD
 */
//  (async () => {
//   /* if in a browser environment */
//   if (typeof window !== 'undefined') {
//     if ((window as any).ethereum) { // first try from the injected provider
//       const injectedId = await (window as any).ethereum.request({ method: 'eth_chainId' });

//       console.log('InjectedID', injectedId );
//       chainId$.next( parseInt(injectedId, 16) )
//     }
//     const fromCache = getBrowserCachedValue(`lastChainIdUsed`)
//     chainId$.next( fromCache ); // second, from the last id used in the cache
//   }
//   /* in a non-browser environment */
//   chainId$.next(appConfig$.value.defaultChainId); // defaults to the defaultChainId in the settings
// })()

/** @internal */
export const provider$ = new BehaviorSubject( getDefaultProvider(  1 )  );
export const providerø: Observable<ethers.providers.BaseProvider> = provider$.pipe(share());
export const updateProvider = (newProvider: ethers.providers.BaseProvider) => {
  provider$.next(newProvider); // update to whole new protocol
};

// providerø.subscribe(async (provider) => console.log('NEW CHAIN ID', (await provider.getNetwork()).chainId));

/**
 * The accountProvider is the sign provider (web3Provider) that handles the user account, signing and transacting.
 * It also adds a number of listeners to monitor account changes etc.
 **/
/** @internal */
export const accountProvider$ = new BehaviorSubject(defaultAccountProvider);
export const accountProviderø: Observable<ethers.providers.Web3Provider> = accountProvider$.pipe(share());

export const updateAccountProvider = (newProvider: ethers.providers.Web3Provider) => {
  // TODO: wrap the EIP provider into a ethers.web3Provider if required.
  accountProvider$.next(newProvider); // update to whole new protocol
};

/* handle any events on the accountProvider ( web3Provider ) */
accountProviderø.subscribe(async (accProvider) => {
  console.log('NEW CHAIN ID', (await accProvider.getNetwork()).chainId);
  /**
   * MetaMask requires requesting permission to connect users accounts >
   * however, we can attempt to skip this if the user already has a connected account
   * */
  try {
    appConfig$.value.autoConnectAccountProvider &&
      account$.next((await accProvider.send('eth_requestAccounts', []))[0]);
  } catch (e) {
    console.log(e);
  }

  /**
   * Attach listeners for EIP1193 events
   * (Unless supressed, or not in a browser environment )
   * */
  if (typeof window !== 'undefined' && !appConfig$.value.supressInjectedListeners) {
    window.ethereum.on('accountsChanged', (addr: string[]) => account$.next(addr[0]));
    /* Reload the page on every network change as per reccommendation */
    window.ethereum.on('chainChanged', (id: string) => updateChainId(parseInt(id, 16)));
    /* Connect/Disconnect listeners */
    window.ethereum.on('connect', () => console.log('connected'));
    window.ethereum.on('disconnect', () => console.log('disconnected'));
  }
});

/** @internal */
export const account$ = new BehaviorSubject(undefined as string | undefined);
export const accountø: Observable<string | undefined> = account$.pipe(share());
export const updateAccount = (newAccount?: string) => {
  account$.next(newAccount || undefined);
};
