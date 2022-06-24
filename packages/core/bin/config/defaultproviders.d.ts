import { ethers } from 'ethers';
export declare const defaultAccountProvider: ethers.providers.JsonRpcProvider;
export declare const defaultProviderMap: Map<number, () => ethers.providers.BaseProvider>;
export declare const defaultForkMap: Map<number, () => ethers.providers.JsonRpcProvider>;
