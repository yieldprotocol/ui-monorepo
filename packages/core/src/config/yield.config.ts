import { ApprovalMethod, IYieldConfig } from '../types';
import { defaultAccountProvider, defaultProviderMap } from './defaultproviders';

export default {
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

  browserCaching: true,
  initialUpdateOnrequest: false, // don't update info automatically - wait for individual requests.

  ignoreSeries: [],
  ignoreStrategies: [],

  /* debugging, testing and develpoment */
  mockUser: false, // mock the user
  diagnostics: true, // show app diagnostics in the console
  forceTransactions: false, // don't throw an error if the transaction is likely to fail.
  useFork: false,

} as IYieldConfig;
