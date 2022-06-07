"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const types_1 = require("../types");
const defaultprovider_1 = tslib_1.__importDefault(require("./defaultprovider"));
exports.default = {
    defaultProvider: defaultprovider_1.default,
    defaultChainId: 5,
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