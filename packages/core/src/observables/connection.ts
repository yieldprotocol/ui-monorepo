import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { Observable, BehaviorSubject, Subject, shareReplay, mergeMap, combineLatest,share } from 'rxjs';
import { defaultAccountProvider } from '../config';
import { getBrowserCachedValue, setBrowserCachedValue } from '../utils/appUtils';
import { appConfigø } from './appConfig';
import { MessageType, sendMsg } from './messages';
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
    /* in a non-browser environment : return the chainId set in the default */
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

const provider$: Subject<ethers.providers.BaseProvider> = new Subject();
export const providerø = provider$.pipe(shareReplay(1));
export const updateProvider = (newProvider: ethers.providers.BaseProvider) => {
  provider$.next(newProvider); // update to whole new protocol
};

/**
 * Update the provider on start ( when there is a chainId and appConfig)
 * */
combineLatest([chainIdø, appConfigø])
  // .pipe(take(1)) // once on start
  .subscribe(async ([chainId, appConfig]) => {
    /* Set the provider ( forked or not ) */
    if (appConfig.useFork && appConfig.defaultForkMap.has(chainId)) {
      const forkProvider = appConfig.defaultForkMap.get(chainId)!();
      
      /* Set account provider, and account provider as the fork */ 
      const account = (await forkProvider.listAccounts())[0];
      provider$.next(forkProvider);
      account$.next(account);
      accountProvider$.next(forkProvider);

      sendMsg({
        message: `Using forked Environment. (block ${(await forkProvider.getBlockNumber())?.toString()})`,
        timeoutOverride: Infinity,
        id: 'FORKED_ENV',
      });
    } else if (appConfig.defaultProviderMap.has(chainId)) {
      provider$.next(appConfig.defaultProviderMap.get(chainId)!() as ethers.providers.BaseProvider);
    } else {
      sendMsg({ message: 'NETWORK NOT SUPPORTED', type: MessageType.WARNING, timeoutOverride: Infinity });
    }
  });

const account$ = new BehaviorSubject(undefined as string | undefined);
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
const accountProvider$ = new BehaviorSubject(defaultAccountProvider);
export const accountProviderø: Observable<ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider> =
  accountProvider$.pipe(shareReplay(1));
export const updateAccountProvider = (newProvider: ethers.providers.Web3Provider) => {
  // TODO: wrap the EIP provider into a ethers.web3Provider if required.
  accountProvider$.next(newProvider); // update to whole new protocol
};


/**
 * Handle any events on the accountProvider ( web3Provider )
 * */
combineLatest([accountProviderø, appConfigø]).subscribe(async ([accProvider, appConfig]) => {
  /**
   * MetaMask requires requesting permission to connect users accounts >
   * however, we can attempt to skip this if the user already has a connected account
   * */
  try {
    appConfig.autoConnectAccountProvider &&
      !appConfig.useFork &&
      account$.next((await accProvider.send('eth_requestAccounts', []))[0]);
  } catch (e) {
    console.log(e);
  }

  // function connect() {
  //   ethereum
  //     .request({ method: 'eth_requestAccounts' })
  //     .then(handleAccountsChanged)
  //     .catch((err) => {
  //       if (err.code === 4001) {
  //         // EIP-1193 userRejectedRequest error
  //         // If this happens, the user rejected the connection request.
  //         console.log('Please connect to MetaMask.');
  //       } else {
  //         console.error(err);
  //       }
  //     });
  // }

  /**
   * Attach listeners for EIP1193 events
   * (Unless supressed, or not in a browser environment )
   * */
  if (typeof window !== 'undefined' && !appConfig.supressInjectedListeners) {
    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        console.log('Please connect to MetaMask.');
      } else if (accounts[0] !== account$.value) {
        account$.next(accounts[0]);
      }
    });
    /* Reload the page on every network change as per reccommendation */
    window.ethereum.on('chainChanged', (id: string) => updateChainId(parseInt(id, 16)));
    /* Connect/Disconnect listeners */
    window.ethereum.on('connect', () => console.log('connected'));
    window.ethereum.on('disconnect', () => console.log('disconnected'));
  }

  /**
   * if using the accountProvider as the base provider
   * TODO: untested
   * */
  if (appConfig.useAccountProviderAsProvider) updateProvider(accProvider);
});
