"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forkProviderMap = exports.defaultProviderMap = exports.defaultAccountProvider = void 0;
const ethers_1 = require("ethers");
exports.defaultAccountProvider = new ethers_1.ethers.providers.Web3Provider(window.ethereum);
exports.defaultProviderMap = new Map([
    [1, new ethers_1.ethers.providers.WebSocketProvider(`wss://mainnet.infura.io/ws/v3/de43fd0c912d4bdc94712ab4b37613ea`)],
    [5, new ethers_1.ethers.providers.WebSocketProvider(`wss://goerli.infura.io/ws/v3/de43fd0c912d4bdc94712ab4b37613ea`)],
    [42161, new ethers_1.ethers.providers.AlchemyProvider(42161, 'vtMM4_eLnOvkjkdckprVw3cIa64EVkDZ')]
]);
exports.forkProviderMap = new Map([
    [1, new ethers_1.ethers.providers.JsonRpcProvider(`https://rpc.tenderly.co/fork/935740ae-abd2-41c3-bda7-d03f8b102c29`)],
]);
//# sourceMappingURL=defaultproviders.js.map