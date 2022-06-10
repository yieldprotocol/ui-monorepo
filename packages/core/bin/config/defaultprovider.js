"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultProvider = exports.defaultAccountProvider = exports.defaultProvider = void 0;
const ethers_1 = require("ethers");
exports.defaultProvider = new ethers_1.ethers.providers.WebSocketProvider(`wss://mainnet.infura.io/ws/v3/de43fd0c912d4bdc94712ab4b37613ea`);
exports.defaultAccountProvider = new ethers_1.ethers.providers.Web3Provider(window.ethereum);
const getDefaultProvider = (chainId) => {
    console.log(chainId);
    if (chainId === 1)
        return new ethers_1.ethers.providers.WebSocketProvider(`wss://mainnet.infura.io/ws/v3/de43fd0c912d4bdc94712ab4b37613ea`);
    if (chainId === 5)
        return new ethers_1.ethers.providers.WebSocketProvider(`wss://goerli.infura.io/ws/v3/de43fd0c912d4bdc94712ab4b37613ea`);
    if (chainId === 42161)
        return new ethers_1.ethers.providers.AlchemyProvider(42161, 'vtMM4_eLnOvkjkdckprVw3cIa64EVkDZ');
    return new ethers_1.ethers.providers.WebSocketProvider(`wss://mainnet.infura.io/ws/v3/de43fd0c912d4bdc94712ab4b37613ea`);
};
exports.getDefaultProvider = getDefaultProvider;
// what MetaMask injects as window.ethereum into each page
// const defaultProvider = window.ethereum
//     ? new ethers.providers.Web3Provider(window.ethereum)
//     : new ethers.providers.JsonRpcProvider() // deafult localhost:8545
// const defaultProvider : ethers.providers.BaseProvider = new ethers.providers.WebSocketProvider('wss://mainnet.infura.io/ws/v3/de43fd0c912d4bdc94712ab4b37613ea');
// export const defaultProvider: ethers.providers.BaseProvider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/2af222f674024a0f84b5f0aad0da72a2')
// const defaultProvider: ethers.providers.BaseProvider = new ethers.providers.AlchemyProvider(
//   42161,
//   'vtMM4_eLnOvkjkdckprVw3cIa64EVkDZ'
// );
// const defaultProvider: ethers.providers.BaseProvider = new ethers.providers.AlchemyProvider(
//   1,
//   'ZXDCq5iy0KrKR0XjsqC6E4QG7Z_FuXDv'
// );
// const network = "homestead";
// const defaultProvider = ethers.getDefaultProvider(network, {
//     etherscan: '-',
//     infura: '-',
//     alchemy: 'ZXDCq5iy0KrKR0XjsqC6E4QG7Z_FuXDv',
//     ankr: '-',
//     pocket: '-'
//     // Or if using an application secret key:
//     // pocket: {
//     //   applicationId: ,
//     //   applicationSecretKey:
//     // },
// });
//# sourceMappingURL=defaultprovider.js.map