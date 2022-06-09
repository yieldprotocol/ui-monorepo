import { ethers } from 'ethers';
import { Observable, BehaviorSubject } from 'rxjs';
/** @internal */
export declare const provider$: BehaviorSubject<ethers.providers.BaseProvider>;
export declare const providerø: Observable<ethers.providers.BaseProvider>;
export declare const updateProvider: (newProvider: ethers.providers.BaseProvider) => void;
/**
 * The accountProvider is the sign provider (web3Provider) that handles the user account, signing and transacting.
 * It also adds a number of listeners to monitor account changes etc.
 **/
/** @internal */
export declare const accountProvider$: BehaviorSubject<ethers.providers.Web3Provider>;
export declare const accountProviderø: Observable<ethers.providers.Web3Provider>;
export declare const updateAccountProvider: (newProvider: ethers.providers.Web3Provider) => void;
