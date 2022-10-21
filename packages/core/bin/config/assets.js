"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ASSETS = exports.IGNORE_BASE_ASSETS = exports.ETH_BASED_ASSETS = exports.CONVEX_BASED_ASSETS = exports.CVX3CRV = exports.FUSDC2209 = exports.FDAI2209 = exports.FUSDC2206 = exports.FDAI2206 = exports.FUSDC2203 = exports.FDAI2203 = exports.FRAX = exports.MKR = exports.yvUSDC = exports.UNI = exports.ENS = exports.LINK = exports.wstETH = exports.stETH = exports.WBTC = exports.USDC = exports.DAI = exports.WETH = exports.UNKNOWN = void 0;
const types_1 = require("../types");
exports.UNKNOWN = '0x000000000000';
exports.WETH = '0x303000000000';
exports.DAI = '0x303100000000';
exports.USDC = '0x303200000000';
exports.WBTC = '0x303300000000';
exports.stETH = '0x303500000000';
exports.wstETH = '0x303400000000';
exports.LINK = '0x303600000000';
exports.ENS = '0x303700000000';
exports.UNI = '0x313000000000';
exports.yvUSDC = '0x303900000000';
exports.MKR = '0x313100000000';
exports.FRAX = '0x313800000000';
/* Notional fCash assets */
exports.FDAI2203 = '0x313200000000';
exports.FUSDC2203 = '0x313300000000';
exports.FDAI2206 = '0x313400000000';
exports.FUSDC2206 = '0x313500000000';
exports.FDAI2209 = '0x313600000000';
exports.FUSDC2209 = '0x313700000000';
/* Convex Curve LP token assets */
exports.CVX3CRV = '0x313900000000';
/* logic lists */
exports.CONVEX_BASED_ASSETS = [exports.CVX3CRV];
exports.ETH_BASED_ASSETS = ['WETH', 'ETH', exports.WETH];
exports.IGNORE_BASE_ASSETS = ['ENS'];
/* Map of assets (populated below) */
exports.ASSETS = new Map();
/* Unknown token for temporarily handling new tokens added */
exports.ASSETS.set(exports.UNKNOWN, {
    version: '1',
    name: 'UNKNOWN',
    decimals: 18,
    symbol: 'UNKNOWN',
    showToken: false,
    digitFormat: 2,
    tokenType: types_1.TokenType.ERC20,
});
exports.ASSETS.set(exports.DAI, {
    version: '1',
    name: 'Dai stable coin',
    isYieldBase: true,
    decimals: 18,
    symbol: 'DAI',
    showToken: true,
    digitFormat: 2,
    tokenType: types_1.TokenType.ERC20_DaiPermit,
});
exports.ASSETS.set(exports.USDC, {
    version: '1',
    isYieldBase: true,
    name: 'USDC Stable coin',
    decimals: 18,
    symbol: 'USDC',
    showToken: true,
    digitFormat: 2,
    tokenType: types_1.TokenType.ERC20_Permit,
});
exports.ASSETS.set(exports.WBTC, {
    version: '1',
    name: 'Wrapped Bitcoin',
    decimals: 18,
    symbol: 'WBTC',
    showToken: true,
    digitFormat: 6,
    tokenType: types_1.TokenType.ERC20,
});
exports.ASSETS.set(exports.ENS, {
    version: '1',
    name: 'Ethereum Naming Service',
    decimals: 18,
    symbol: 'ENS',
    showToken: true,
    digitFormat: 2,
    tokenType: types_1.TokenType.ERC20_Permit,
});
exports.ASSETS.set(exports.WETH, {
    version: '1',
    isYieldBase: true,
    name: 'Wrapped Ether',
    decimals: 18,
    symbol: 'WETH',
    displaySymbol: 'ETH',
    showToken: true,
    digitFormat: 6,
    tokenType: types_1.TokenType.ERC20,
});
exports.ASSETS.set(exports.wstETH, {
    version: '1',
    name: 'Wrapped Staked Ether',
    decimals: 18,
    symbol: 'wstETH',
    displaySymbol: 'wstETH',
    showToken: true,
    digitFormat: 6,
    tokenType: types_1.TokenType.ERC20_Permit,
    wrapHandlerAddresses: new Map([]),
    unwrapHandlerAddresses: new Map([
        [1, '0x491aB93faa921C8E634F891F96512Be14fD3DbB1'],
        [4, '0x64BA0F1D2E5479BF132936328e8c533c95646fE8'],
        [5, '0x9f65A6c2b2F12117573323443C8C2290f4C1e675'],
    ]),
});
exports.ASSETS.set(exports.stETH, {
    version: '1',
    name: 'Staked Eth',
    decimals: 18,
    symbol: 'stETH',
    showToken: false,
    digitFormat: 6,
    tokenType: types_1.TokenType.ERC20_Permit,
    wrapHandlerAddresses: new Map([
        [1, '0x491aB93faa921C8E634F891F96512Be14fD3DbB1'],
        [4, '0x64BA0F1D2E5479BF132936328e8c533c95646fE8'],
        [5, '0x9f65A6c2b2F12117573323443C8C2290f4C1e675'],
    ]),
    unwrapHandlerAddresses: new Map([]),
    proxyId: exports.wstETH,
});
exports.ASSETS.set(exports.LINK, {
    version: '1',
    name: 'ChainLink',
    decimals: 18,
    symbol: 'LINK',
    showToken: true,
    digitFormat: 2,
    tokenType: types_1.TokenType.ERC20,
});
exports.ASSETS.set(exports.yvUSDC, {
    version: '1',
    name: 'curve',
    decimals: 18,
    symbol: 'yvUSDC',
    showToken: true,
    digitFormat: 2,
    tokenType: types_1.TokenType.ERC20,
    limitToSeries: ['0x303230350000', '0x303230360000', '0x303230370000'],
});
exports.ASSETS.set(exports.UNI, {
    version: '1',
    name: 'Uniswap token',
    decimals: 18,
    symbol: 'UNI',
    showToken: true,
    digitFormat: 4,
    tokenType: types_1.TokenType.ERC20_Permit,
});
exports.ASSETS.set(exports.MKR, {
    version: '1',
    name: 'Maker Token',
    decimals: 18,
    symbol: 'MKR',
    showToken: false,
    digitFormat: 2,
    tokenType: types_1.TokenType.ERC20_MKR,
});
exports.ASSETS.set(exports.FDAI2203, {
    version: '1',
    name: 'fDAI2203',
    decimals: 8,
    symbol: 'FDAI2203',
    showToken: false,
    digitFormat: 2,
    tokenType: types_1.TokenType.ERC1155,
    tokenIdentifier: 563371972493313,
    limitToSeries: ['0x303130350000'],
});
exports.ASSETS.set(exports.FUSDC2203, {
    version: '1',
    name: 'fUSDC2203',
    decimals: 8,
    symbol: 'FUSDC2203',
    showToken: false,
    digitFormat: 2,
    tokenType: types_1.TokenType.ERC1155,
    tokenIdentifier: 844846949203969,
    limitToSeries: ['0x303230350000'],
});
exports.ASSETS.set(exports.FDAI2206, {
    version: '1',
    name: 'fDAI2206',
    decimals: 8,
    symbol: 'FDAI2206',
    showToken: true,
    digitFormat: 2,
    tokenType: types_1.TokenType.ERC1155,
    tokenIdentifier: 563373963149313,
    limitToSeries: ['0x303130360000'],
});
exports.ASSETS.set(exports.FUSDC2206, {
    version: '1',
    name: 'fUSDC2206',
    decimals: 8,
    symbol: 'FUSDC2206',
    showToken: true,
    digitFormat: 2,
    tokenType: types_1.TokenType.ERC1155,
    tokenIdentifier: 844848939859969,
    limitToSeries: ['0x303230360000'],
});
exports.ASSETS.set(exports.FDAI2209, {
    version: '1',
    name: 'fDAI2209',
    decimals: 8,
    symbol: 'FDAI2209',
    showToken: true,
    digitFormat: 2,
    tokenType: types_1.TokenType.ERC1155,
    tokenIdentifier: 563375953805313,
    limitToSeries: ['0x303130370000'],
});
exports.ASSETS.set(exports.FUSDC2209, {
    version: '1',
    name: 'fUSDC2209',
    decimals: 8,
    symbol: 'FUSDC2209',
    showToken: true,
    digitFormat: 2,
    tokenType: types_1.TokenType.ERC1155,
    tokenIdentifier: 844850930515969,
    limitToSeries: ['0x303230370000'],
});
exports.ASSETS.set(exports.CVX3CRV, {
    version: '1',
    name: 'cvx3crv',
    decimals: 18,
    symbol: 'cvx3crv',
    showToken: false,
    digitFormat: 2,
    tokenType: types_1.TokenType.ERC20,
    limitToSeries: [
        '0x303130360000',
        '0x303130370000',
        '0x303230370000',
        '0x303230360000', // june usdc
    ],
});
exports.ASSETS.set(exports.FRAX, {
    version: '1',
    name: 'frax',
    decimals: 18,
    symbol: 'FRAX',
    isYieldBase: true,
    showToken: true,
    digitFormat: 2,
    tokenType: types_1.TokenType.ERC20,
    limitToSeries: [],
});
//# sourceMappingURL=assets.js.map