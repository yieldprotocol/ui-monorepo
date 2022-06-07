import { ApprovalMethod, IYieldConfig } from '../types';
import defaultProvider from './defaultprovider';

export default {
  defaultProvider, // the initial provider, also used as a fallback if required.
  defaultChainId: 5,

  defaultSeriesId: undefined,
  defaultBaseId: undefined,

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

} as IYieldConfig;
