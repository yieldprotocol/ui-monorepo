"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = exports.defaultForkMap = exports.defaultProviderMap = exports.defaultAccountProvider = void 0;
const ethers_1 = require("ethers");
const types_1 = require("../types");
exports.defaultAccountProvider = typeof window !== 'undefined'
    ? new ethers_1.ethers.providers.Web3Provider(window.ethereum)
    : new ethers_1.ethers.providers.JsonRpcProvider();
exports.defaultProviderMap = new Map([
    // [1, () => new ethers.providers.JsonRpcProvider(`https://mainnet.infura.io/v3/de43fd0c912d4bdc94712ab4b37613ea`)],
    [1, () => new ethers_1.ethers.providers.WebSocketProvider(`wss://mainnet.infura.io/ws/v3/de43fd0c912d4bdc94712ab4b37613ea`)],
    [
        42161,
        () => new ethers_1.ethers.providers.AlchemyProvider(42161, 'vtMM4_eLnOvkjkdckprVw3cIa64EVkDZ'),
    ],
]);
exports.defaultForkMap = new Map([
    [1, () => new ethers_1.ethers.providers.JsonRpcProvider()],
    [1337, () => new ethers_1.ethers.providers.JsonRpcProvider()],
]);
// hardhat node> https://mainnet.infura.io/v3/2af222f674024a0f84b5f0aad0da72a2
exports.defaultConfig = {
    defaultProviderMap: exports.defaultProviderMap,
    defaultAccountProvider: // the initial provider, also used as a fallback if required.
    exports.defaultAccountProvider,
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
    defaultForkMap: exports.defaultForkMap,
    suppressEventLogQueries: false, // Don't try to fetch 'historical' data from previous events
};
//# sourceMappingURL=defaultSettings.js.map