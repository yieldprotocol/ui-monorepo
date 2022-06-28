"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const defaultproviders_1 = require("./defaultproviders");
exports.default = {
    defaultProviderMap: defaultproviders_1.defaultProviderMap,
    defaultAccountProvider: // the initial provider, also used as a fallback if required.
    defaultproviders_1.defaultAccountProvider,
    defaultChainId: 1,
    autoConnectAccountProvider: true,
    useAccountProviderAsProvider: false,
    supressInjectedListeners: false,
    defaultSeriesId: undefined,
    defaultBaseId: undefined,
    defaultUserSettings: {
        slippageTolerance: 0.01,
        approvalMethod: types_1.ApprovalMethod.SIG,
        maxApproval: false,
        unwrapTokens: false,
    },
    messageTimeout: 3000,
    browserCaching: true,
    initialUpdateOnrequest: false,
    ignoreSeries: [],
    ignoreStrategies: [],
    /* debugging, testing and develpoment */
    mockUser: false,
    diagnostics: true,
    forceTransactions: true,
    useFork: false,
    defaultForkMap: defaultproviders_1.defaultForkMap,
    suppressEventLogQueries: false, // don't try to fetch 'historical' data from previous events
};
//# sourceMappingURL=yield.config.js.map