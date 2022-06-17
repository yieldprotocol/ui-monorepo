"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultForkMap = exports.defaultProviderMap = exports.defaultAccountProvider = void 0;
const ethers_1 = require("ethers");
exports.defaultAccountProvider = new ethers_1.ethers.providers.Web3Provider(window.ethereum);
exports.defaultProviderMap = new Map([
    [1, new ethers_1.ethers.providers.WebSocketProvider(`wss://mainnet.infura.io/ws/v3/de43fd0c912d4bdc94712ab4b37613ea`)],
    [5, new ethers_1.ethers.providers.WebSocketProvider(`wss://goerli.infura.io/ws/v3/de43fd0c912d4bdc94712ab4b37613ea`)],
    [42161, new ethers_1.ethers.providers.AlchemyProvider(42161, 'vtMM4_eLnOvkjkdckprVw3cIa64EVkDZ')]
]);
exports.defaultForkMap = new Map([
    [1, new ethers_1.ethers.providers.JsonRpcProvider()],
    [1337, new ethers_1.ethers.providers.JsonRpcProvider()],
]);
// hardhat node> https://mainnet.infura.io/v3/2af222f674024a0f84b5f0aad0da72a2
//# sourceMappingURL=defaultproviders.js.map