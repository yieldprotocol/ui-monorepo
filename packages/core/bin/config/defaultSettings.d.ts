import { ethers } from 'ethers';
import { IUserSettings } from '../types';
export interface IYieldConfig {
    defaultProviderMap: Map<number, () => ethers.providers.BaseProvider>;
    defaultChainId: number;
    defaultAccountProvider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider;
    useAccountProviderAsProvider: boolean;
    autoConnectAccountProvider: boolean;
    supressInjectedListeners: boolean;
    initialUpdateOnrequest: boolean;
    defaultUserSettings: IUserSettings;
    defaultSeriesId: string | undefined;
    defaultBaseId: string | undefined;
    ignoreSeries: string[];
    ignoreStrategies: string[];
    messageTimeout: number;
    browserCaching: boolean;
    mockUser: false;
    forceTransactions: boolean;
    useFork: boolean;
    defaultForkMap: Map<number, () => ethers.providers.JsonRpcProvider>;
    suppressEventLogQueries: boolean;
    diagnostics: boolean;
}
export declare const defaultAccountProvider: ethers.providers.JsonRpcProvider;
export declare const defaultProviderMap: Map<number, () => ethers.providers.BaseProvider>;
export declare const defaultForkMap: Map<number, () => ethers.providers.JsonRpcProvider>;
export declare const defaultConfig: IYieldConfig;
