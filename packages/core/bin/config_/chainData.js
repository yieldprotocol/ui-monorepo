"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHAIN_INFO = exports.SUPPORTED_CHAIN_IDS = exports.SUPPORTED_RPC_URLS = exports.RPC_URLS = void 0;
exports.RPC_URLS = {
    1: process.env.REACT_APP_RPC_URL_1,
    4: process.env.REACT_APP_RPC_URL_4,
    5: process.env.REACT_APP_RPC_URL_5,
    42: process.env.REACT_APP_RPC_URL_42,
    10: process.env.REACT_APP_RPC_URL_10,
    69: process.env.REACT_APP_RPC_URL_69,
    42161: process.env.REACT_APP_RPC_URL_42161,
    421611: process.env.REACT_APP_RPC_URL_421611,
};
exports.SUPPORTED_RPC_URLS = {
    1: exports.RPC_URLS[1],
    4: exports.RPC_URLS[4],
    5: exports.RPC_URLS[5],
    42161: exports.RPC_URLS[42161],
    // 421611: RPC_URLS[421611],
};
exports.SUPPORTED_CHAIN_IDS = Object.keys(exports.SUPPORTED_RPC_URLS).map((chainId) => +chainId);
exports.CHAIN_INFO = new Map();
exports.CHAIN_INFO.set(1, { name: 'Ethereum', color: '#29b6af', explorer: 'https://etherscan.io' });
exports.CHAIN_INFO.set(3, { name: 'Ropsten', color: '#ff4a8d', explorer: 'https://ropsten.etherscan.io' });
exports.CHAIN_INFO.set(4, { name: 'Rinkeby', color: '#f6c343', explorer: 'https://rinkeby.etherscan.io' });
exports.CHAIN_INFO.set(5, { name: 'Goerli', color: '#3099f2', explorer: 'https://goerli.etherscan.io' });
exports.CHAIN_INFO.set(42, { name: 'Kovan', color: '#7F7FFE', explorer: 'https://kovan.etherscan.io' });
exports.CHAIN_INFO.set(10, {
    name: 'Optimism',
    color: '#EB0822',
    bridge: 'https://gateway.optimism.io',
    explorer: 'https://optimistic.etherscan.io',
    rpcUrl: 'https://mainnet.optimism.io',
    nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
    },
});
exports.CHAIN_INFO.set(69, {
    name: 'Optimism Kovan',
    color: '#EB0822',
    bridge: 'https://gateway.optimism.io',
    explorer: 'https://kovan-optimistic.etherscan.io',
    rpcUrl: 'https://kovan.optimism.io',
    nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
    },
});
exports.CHAIN_INFO.set(42161, {
    name: 'Arbitrum',
    color: '#1F2937',
    colorSecondary: '#28A0F0',
    bridge: 'https://bridge.arbitrum.io',
    explorer: 'https://arbiscan.io/',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
    },
});
exports.CHAIN_INFO.set(421611, {
    name: 'Arbitrum Testnet',
    color: '#1F2937',
    colorSecondary: '#28A0F0',
    bridge: 'https://bridge.arbitrum.io',
    explorer: 'https://testnet.arbiscan.io',
    rpcUrl: 'https://rinkeby.arbitrum.io/rpc',
    nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
    },
});
//# sourceMappingURL=chainData.js.map