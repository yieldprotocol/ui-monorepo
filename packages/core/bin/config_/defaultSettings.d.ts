import { ethers } from 'ethers';
import { IYieldConfig } from '../types';
export declare const defaultAccountProvider: ethers.providers.JsonRpcProvider;
export declare const defaultProviderMap: Map<number, () => ethers.providers.BaseProvider>;
export declare const defaultForkMap: Map<number, () => ethers.providers.JsonRpcProvider>;
declare const _default: IYieldConfig;
export default _default;
