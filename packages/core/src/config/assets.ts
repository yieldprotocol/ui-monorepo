import { IAssetInfo, TokenType } from '../types';

export const UNKNOWN = '0x000000000000';
export const WETH = '0x303000000000';
export const DAI = '0x303100000000';
export const USDC = '0x303200000000';
export const WBTC = '0x303300000000';
export const stETH = '0x303500000000';
export const wstETH = '0x303400000000';
export const LINK = '0x303600000000';
export const ENS = '0x303700000000';
export const UNI = '0x313000000000';
export const yvUSDC = '0x303900000000';
export const MKR = '0x313100000000';
export const FRAX = '0x313800000000';
/* Notional fCash assets */
export const FDAI2203 = '0x313200000000';
export const FUSDC2203 = '0x313300000000';
export const FDAI2206 = '0x313400000000';
export const FUSDC2206 = '0x313500000000';
export const FDAI2209 = '0x313600000000';
export const FUSDC2209 = '0x313700000000';
/* Convex Curve LP token assets */
export const CVX3CRV = '0x313900000000';

/* logic lists */
export const CONVEX_BASED_ASSETS = [ CVX3CRV ];
export const ETH_BASED_ASSETS = ['WETH', 'ETH', WETH];
export const IGNORE_BASE_ASSETS = ['ENS'];

/* Map of assets (populated below) */
export const ASSETS = new Map<string, IAssetInfo>();

/* Unknown token for temporarily handling new tokens added */
ASSETS.set(UNKNOWN, {
  version: '1',
  name: 'UNKNOWN',
  decimals: 18,
  symbol: 'UNKNOWN',
  showToken: false,
  digitFormat: 2,
  tokenType: TokenType.ERC20,
});

ASSETS.set(DAI, {
  version: '1',
  name: 'Dai stable coin',
  isYieldBase: true,
  decimals: 18,
  symbol: 'DAI',
  showToken: true,
  digitFormat: 2,
  tokenType: TokenType.ERC20_DaiPermit,
});

ASSETS.set(USDC, {
  version: '1',
  isYieldBase: true,
  name: 'USDC Stable coin',
  decimals: 18,
  symbol: 'USDC',
  showToken: true,
  digitFormat: 2,
  tokenType: TokenType.ERC20_Permit,
});

ASSETS.set(WBTC, {
  version: '1',
  name: 'Wrapped Bitcoin',
  decimals: 18,
  symbol: 'WBTC',
  showToken: true,
  digitFormat: 6,
  tokenType: TokenType.ERC20,
});

ASSETS.set(ENS, {
  version: '1',
  name: 'Ethereum Naming Service',
  decimals: 18,
  symbol: 'ENS',
  showToken: true,
  digitFormat: 2,
  tokenType: TokenType.ERC20_Permit,
});

ASSETS.set(WETH, {
  version: '1',
  isYieldBase: true,
  name: 'Wrapped Ether',
  decimals: 18,
  symbol: 'WETH',
  displaySymbol: 'ETH',
  showToken: true,
  digitFormat: 6,
  tokenType: TokenType.ERC20,
});

ASSETS.set(wstETH, {
  version: '1',
  name: 'Wrapped Staked Ether',
  decimals: 18,
  symbol: 'wstETH',
  displaySymbol: 'wstETH',
  showToken: true,
  digitFormat: 6,
  tokenType: TokenType.ERC20_Permit,
  wrapHandlerAddresses: new Map([]),
  unwrapHandlerAddresses: new Map([
    [1, '0x491aB93faa921C8E634F891F96512Be14fD3DbB1'],
    [4, '0x64BA0F1D2E5479BF132936328e8c533c95646fE8'],
    [5, '0x9f65A6c2b2F12117573323443C8C2290f4C1e675'],
  ]),
});

ASSETS.set(stETH, {
  version: '1',
  name: 'Staked Eth',
  decimals: 18,
  symbol: 'stETH',
  showToken: false,
  digitFormat: 6,
  tokenType: TokenType.ERC20_Permit,
  wrapHandlerAddresses: new Map([
    [1, '0x491aB93faa921C8E634F891F96512Be14fD3DbB1'],
    [4, '0x64BA0F1D2E5479BF132936328e8c533c95646fE8'],
    [5, '0x9f65A6c2b2F12117573323443C8C2290f4C1e675'],
  ]),
  unwrapHandlerAddresses: new Map([]),
  proxyId: wstETH,
});

ASSETS.set(LINK, {
  version: '1',
  name: 'ChainLink',
  decimals: 18,
  symbol: 'LINK',
  showToken: true,
  digitFormat: 2,
  tokenType: TokenType.ERC20,
});

ASSETS.set(yvUSDC, {
  version: '1',
  name: 'curve',
  decimals: 18,
  symbol: 'yvUSDC',
  showToken: true,
  digitFormat: 2,
  tokenType: TokenType.ERC20,
  limitToSeries: ['0x303230350000', '0x303230360000', '0x303230370000'],
});

ASSETS.set(UNI, {
  version: '1',
  name: 'Uniswap token',
  decimals: 18,
  symbol: 'UNI',
  showToken: true,
  digitFormat: 4,
  tokenType: TokenType.ERC20_Permit,
});

ASSETS.set(MKR, {
  version: '1',
  name: 'Maker Token',
  decimals: 18,
  symbol: 'MKR',
  showToken: false,
  digitFormat: 2,
  tokenType: TokenType.ERC20_MKR,
});

ASSETS.set(FDAI2203, {
  version: '1',
  name: 'fDAI2203',
  decimals: 8,
  symbol: 'FDAI2203',
  showToken: false,
  digitFormat: 2,
  tokenType: TokenType.ERC1155,
  tokenIdentifier: 563371972493313,
  limitToSeries: ['0x303130350000'],
});

ASSETS.set(FUSDC2203, {
  version: '1',
  name: 'fUSDC2203',
  decimals: 8,
  symbol: 'FUSDC2203',
  showToken: false,
  digitFormat: 2,
  tokenType: TokenType.ERC1155,
  tokenIdentifier: 844846949203969,
  limitToSeries: ['0x303230350000'],
});

ASSETS.set(FDAI2206, {
  version: '1',
  name: 'fDAI2206',
  decimals: 8,
  symbol: 'FDAI2206',
  showToken: true,
  digitFormat: 2,
  tokenType: TokenType.ERC1155,
  tokenIdentifier: 563373963149313,
  limitToSeries: ['0x303130360000'],
});

ASSETS.set(FUSDC2206, {
  version: '1',
  name: 'fUSDC2206',
  decimals: 8,
  symbol: 'FUSDC2206',
  showToken: true,
  digitFormat: 2,
  tokenType: TokenType.ERC1155,
  tokenIdentifier: 844848939859969,
  limitToSeries: ['0x303230360000'],
});

ASSETS.set(FDAI2209, {
  version: '1',
  name: 'fDAI2209',
  decimals: 8,
  symbol: 'FDAI2209',
  showToken: true,
  digitFormat: 2,
  tokenType: TokenType.ERC1155,
  tokenIdentifier: 563375953805313,
  limitToSeries: ['0x303130370000'],
});

ASSETS.set(FUSDC2209, {
  version: '1',
  name: 'fUSDC2209',
  decimals: 8,
  symbol: 'FUSDC2209',
  showToken: true,
  digitFormat: 2,
  tokenType: TokenType.ERC1155,
  tokenIdentifier: 844850930515969,
  limitToSeries: ['0x303230370000'],
});

ASSETS.set(CVX3CRV, {
  version: '1',
  name: 'cvx3crv',
  decimals: 18,
  symbol: 'cvx3crv',
  showToken: false,
  digitFormat: 2,
  tokenType: TokenType.ERC20,
  limitToSeries: [
    '0x303130360000', // june dai
    '0x303130370000', // sept dai
    '0x303230370000', // sept usdc
    '0x303230360000', // june usdc
  ],
});

ASSETS.set(FRAX, {
  version: '1',
  name: 'frax',
  decimals: 18,
  symbol: 'FRAX',
  isYieldBase: true,
  showToken: true,
  digitFormat: 2,
  tokenType: TokenType.ERC20,
  limitToSeries: [],
});
