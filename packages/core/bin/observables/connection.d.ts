import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
/** @internal */
export declare const chainIdø: Observable<number>;
/**
 * When the chainId changes, we cache the previous value, and then refresh the browser
 * */
export declare const updateChainId: (chainId: number) => void;
/** @internal */
export declare const provider$: Subject<ethers.providers.BaseProvider>;
export declare const providerø: Observable<ethers.providers.BaseProvider>;
export declare const updateProvider: (newProvider: ethers.providers.BaseProvider) => void;
/** @internal */
export declare const account$: BehaviorSubject<string | undefined>;
export declare const accountø: Observable<string | undefined>;
export declare const updateAccount: (newAccount: string) => void;
/**
 * The accountProvider is the sign provider (web3Provider) that handles the user account, signing and transacting.
 * It also adds a number of listeners to monitor account changes etc.
 **/
/** @internal */
export declare const accountProvider$: BehaviorSubject<ethers.providers.JsonRpcProvider>;
export declare const accountProviderø: Observable<ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider>;
export declare const updateAccountProvider: (newProvider: ethers.providers.Web3Provider) => void;
