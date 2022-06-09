"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const defaultprovider_1 = require("./defaultprovider");
exports.default = {
    defaultProvider: defaultprovider_1.defaultProvider,
    defaultChainId: 5,
    defaultAccountProvider: defaultprovider_1.defaultAccountProvider,
    useAccountProviderAsProvider: false,
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
    forceTransactions: false, // don't throw an error if the transaction is likely to fail.
};
//# sourceMappingURL=yield.config.js.map