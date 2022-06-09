import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { Observable, BehaviorSubject, share } from 'rxjs';
import { defaultProvider, defaultAccountProvider } from '../config/defaultprovider';
import { appConfig$ } from './appConfig';
declare const window: any;

/** @internal */
export const provider$ = new BehaviorSubject(defaultProvider);
// export const provider$: Subject<ethers.providers.BaseProvider> = new Subject();

export const providerø: Observable<ethers.providers.BaseProvider> = provider$.pipe(share());
export const updateProvider = (newProvider: ethers.providers.BaseProvider) => {
  provider$.next( newProvider); // update to whole new protocol
};
// providerø.subscribe(async (provider) => console.log('NEW CHAIN ID', (await provider.getNetwork()).chainId));

/**
 * The accountProvider is the sign provider (web3Provider) that handles the user account, signing and transacting.
 * It also adds a number of listeners to monitor account changes etc. 
 **/
/** @internal */
export const accountProvider$ = new BehaviorSubject(defaultAccountProvider);
export const accountProviderø: Observable<ethers.providers.Web3Provider> = accountProvider$.pipe(share());

export const updateAccountProvider = (newProvider: ethers.providers.Web3Provider ) => {
  // TODO: wrap the EIP provider into a ethers.web3Provider if required.
  accountProvider$.next(newProvider); // update to whole new protocol
};

/* handle any events on the accountProvider ( web3Provider ) */
accountProviderø.subscribe(async(accProvider) =>  {
  
  console.log('NEW CHAIN ID', (await accProvider.getNetwork()).chainId);
  /** 
   * MetaMask requires requesting permission to connect users accounts >
   * however, we can attempt to skip this if the user already has a connected account
   * */
  try {
    appConfig$.value.autoConnectAccountProvider && 
    account$.next( (await accProvider.send("eth_requestAccounts", []))[0] )
  } catch (e) { console.log(e) }

  /**
   * Attach listeners for EIP1193 events
   * ( Unless supressed )
   * */
  if (!appConfig$.value.supressInjectedListeners) {
    window.ethereum.on('accountsChanged', (addr:string[]) => account$.next(addr[0]) )
    /* Reload the page on every network change as per reccommendation */
    window.ethereum.on('chainChanged', () => location.reload())
    /* Connect/Disconnect listeners */
    window.ethereum.on('connect', ()=> console.log('connected'))
    window.ethereum.on('disconnect',()=> console.log('disconnected'))
  }

});

/** @internal */
export const account$: BehaviorSubject<string | undefined> = new BehaviorSubject(undefined as string | undefined); // TODO weird typing here ??
export const accountø: Observable<string | undefined> = account$.pipe(share());

/**
 * @param newAccount 
 */
export const updateAccount = (newAccount?: string) => {
  account$.next(newAccount || undefined);
};
