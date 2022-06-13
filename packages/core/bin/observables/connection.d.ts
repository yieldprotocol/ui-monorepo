import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
/** @internal */
export declare const chainId$: Subject<number>;
export declare const chainIdø: Observable<number>;
export declare const updateChainId: (chainId: number) => void;
/**
 * FIRST LOAD > Handle initial setup protocol with DEFAULTS on FIRST LOAD
 */
export declare const chainId: Promise<any>;
/** @internal */
export declare const provider$: Subject<ethers.providers.BaseProvider>;
export declare const providerø: Observable<ethers.providers.BaseProvider>;
export declare const updateProvider: (newProvider: ethers.providers.BaseProvider) => void;
/**
 * The accountProvider is the sign provider (web3Provider) that handles the user account, signing and transacting.
 * It also adds a number of listeners to monitor account changes etc.
 **/
/** @internal */
export declare const accountProvider$: BehaviorSubject<Web3Provider>;
export declare const accountProviderø: Observable<ethers.providers.Web3Provider>;
export declare const updateAccountProvider: (newProvider: ethers.providers.Web3Provider) => void;
/** @internal */
export declare const account$: BehaviorSubject<string | undefined>;
export declare const accountø: Observable<string | undefined>;
export declare const updateAccount: (newAccount?: string) => void;
