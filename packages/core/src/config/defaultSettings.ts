declare const window: any;
import { ethers } from 'ethers';
import { ApprovalMethod, IUserSettings } from '../types';

export interface IYieldConfig {
  defaultProviderMap: Map<number, ()=>ethers.providers.BaseProvider>;
  defaultChainId: number;
  defaultAccountProvider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider; // the default provider used for getting the account information and signing/transacting
  useAccountProviderAsProvider: boolean; // link the default provider to the account provider
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
  mockUser: false,
  forceTransactions: boolean;
  useFork: boolean;
  defaultForkMap: Map<number, () => ethers.providers.JsonRpcProvider>;
  suppressEventLogQueries: boolean, // don't query historical data 
  diagnostics: boolean;
}


export const defaultAccountProvider =
  typeof window !== 'undefined'
    ? new ethers.providers.Web3Provider(window.ethereum)
    : new ethers.providers.JsonRpcProvider();

export const defaultProviderMap: Map<number, () => ethers.providers.BaseProvider> = new Map([
  // [1, () => new ethers.providers.JsonRpcProvider(`https://mainnet.infura.io/v3/de43fd0c912d4bdc94712ab4b37613ea`)],
  [1, () => new ethers.providers.WebSocketProvider(`wss://mainnet.infura.io/ws/v3/de43fd0c912d4bdc94712ab4b37613ea`)],
  [
    42161,
    () =>
      new ethers.providers.AlchemyProvider(42161, 'vtMM4_eLnOvkjkdckprVw3cIa64EVkDZ') as ethers.providers.BaseProvider,
  ],
]);

export const defaultForkMap: Map<number, () => ethers.providers.JsonRpcProvider> = new Map([
  [1, () => new ethers.providers.JsonRpcProvider()],
  [1337, () => new ethers.providers.JsonRpcProvider()],
]);
// hardhat node> https://mainnet.infura.io/v3/2af222f674024a0f84b5f0aad0da72a2

export const defaultConfig : IYieldConfig =  {
  defaultProviderMap, // the initial provider, also used as a fallback if required.
  defaultAccountProvider, // the default provider used for getting the account information and signing/transacting
  defaultChainId: 1,
  
  autoConnectAccountProvider: true, // try to automatically connect to the injected provider.
  useAccountProviderAsProvider: false, // link the default provider to the account provider.
  supressInjectedListeners: false, // ignore the EIP1192 events emited by the injected provider.
  
  defaultSeriesId: undefined, // if undefined, it gets set to the first on the list
  defaultBaseId: undefined, // if undefined, it gets set to the first on the list

  defaultUserSettings: {
    slippageTolerance: 0.01,
    approvalMethod: ApprovalMethod.SIG,
    maxApproval: false,
    unwrapTokens: false,
  }, // the default user settings

  messageTimeout: 3000,

  browserCaching: true, // cache information on the browser side if possible.
  initialUpdateOnrequest: false, // don't update info automatically - wait for individual requests.

  ignoreSeries: [],
  ignoreStrategies: [],

  /* debugging, testing and develpoment */
  mockUser: false, // mock the user
  diagnostics: true, // show app diagnostics in the console
  forceTransactions: true, // don't throw an error if the transaction is likely to fail.
  useFork: false,
  defaultForkMap,
  suppressEventLogQueries: false, // Don't try to fetch 'historical' data from previous events
  
};