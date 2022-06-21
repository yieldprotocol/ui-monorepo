import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { Observable } from 'rxjs';
/** @internal */
export declare const chainIdø: Observable<number>;
/**
 * When the chainId changes, we cache the previous value, and then refresh the browser
 * */
export declare const updateChainId: (chainId: number) => void;
export declare const providerø: Observable<ethers.providers.BaseProvider>;
export declare const updateProvider: (newProvider: ethers.providers.BaseProvider) => void;
export declare const accountø: Observable<string | undefined>;
export declare const updateAccount: (newAccount: string) => void;
export declare const accountProviderø: Observable<ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider>;
export declare const updateAccountProvider: (newProvider: ethers.providers.Web3Provider) => void;
