"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHAIN_ID_421611_ASSET_ORACLE_INFO = exports.CHAIN_ID_42161_ASSET_ORACLE_INFO = exports.CHAIN_ID_42_ASSET_ORACLE_INFO = exports.CHAIN_ID_5_ASSET_ORACLE_INFO = exports.CHAIN_ID_4_ASSET_ORACLE_INFO = exports.CHAIN_ID_1_ASSET_ORACLE_INFO = exports.ORACLE_INFO = void 0;
const assets_1 = require("./assets");
const RATE = '0x5241544500000000000000000000000000000000000000000000000000000000';
const COMPOUND_MULTI_ORACLE = 'CompoundMultiOracle';
const COMPOSITE_MULTI_ORACLE = 'CompositeMultiOracle';
const CHAINLINK_MULTI_ORACLE = 'ChainlinkMultiOracle';
const YEARNVAULT_MULTI_ORACLE = 'YearnVaultMultiOracle';
const CHAINLINK_USD_ORACLE = 'ChainlinkUSDOracle';
const NOTIONAL_MULTI_ORACLE = 'NotionalMultiOracle';
const ACCUMULATOR_MULTI_ORACLE = 'AccumulatorMultiOracle';
// map chain id to oracle info
exports.ORACLE_INFO = new Map();
// map asset (quote) and other asset (base) to a specific oracle based on where there is relevant price info for the pair
exports.CHAIN_ID_1_ASSET_ORACLE_INFO = new Map();
exports.CHAIN_ID_4_ASSET_ORACLE_INFO = new Map();
exports.CHAIN_ID_5_ASSET_ORACLE_INFO = new Map();
exports.CHAIN_ID_42_ASSET_ORACLE_INFO = new Map();
exports.CHAIN_ID_42161_ASSET_ORACLE_INFO = new Map();
exports.CHAIN_ID_421611_ASSET_ORACLE_INFO = new Map();
/* chain id 1, 4, 5, 42 (these chain id's all use the same oracle contracts) */
// USDC base
const usdcIlkOracle1 = new Map();
usdcIlkOracle1.set(assets_1.WETH, CHAINLINK_MULTI_ORACLE);
usdcIlkOracle1.set(assets_1.DAI, CHAINLINK_MULTI_ORACLE);
usdcIlkOracle1.set(assets_1.USDC, CHAINLINK_MULTI_ORACLE);
usdcIlkOracle1.set(assets_1.WBTC, CHAINLINK_MULTI_ORACLE);
usdcIlkOracle1.set(assets_1.stETH, COMPOSITE_MULTI_ORACLE);
usdcIlkOracle1.set(assets_1.wstETH, COMPOSITE_MULTI_ORACLE);
usdcIlkOracle1.set(assets_1.ENS, COMPOSITE_MULTI_ORACLE);
usdcIlkOracle1.set(assets_1.LINK, CHAINLINK_MULTI_ORACLE);
usdcIlkOracle1.set(assets_1.UNI, CHAINLINK_MULTI_ORACLE);
usdcIlkOracle1.set(assets_1.yvUSDC, YEARNVAULT_MULTI_ORACLE);
usdcIlkOracle1.set(assets_1.MKR, COMPOSITE_MULTI_ORACLE);
usdcIlkOracle1.set(assets_1.FRAX, CHAINLINK_MULTI_ORACLE);
/* notional additions */
usdcIlkOracle1.set(assets_1.FUSDC2203, NOTIONAL_MULTI_ORACLE);
usdcIlkOracle1.set(assets_1.FUSDC2206, NOTIONAL_MULTI_ORACLE);
usdcIlkOracle1.set(assets_1.FUSDC2209, NOTIONAL_MULTI_ORACLE);
/* convex */
usdcIlkOracle1.set(assets_1.CVX3CRV, COMPOSITE_MULTI_ORACLE);
/* rate */
usdcIlkOracle1.set(RATE, COMPOUND_MULTI_ORACLE);
exports.CHAIN_ID_1_ASSET_ORACLE_INFO.set(assets_1.USDC, usdcIlkOracle1);
// DAI base
const daiIlkOracle1 = new Map();
daiIlkOracle1.set(assets_1.WETH, CHAINLINK_MULTI_ORACLE);
daiIlkOracle1.set(assets_1.DAI, CHAINLINK_MULTI_ORACLE);
daiIlkOracle1.set(assets_1.USDC, CHAINLINK_MULTI_ORACLE);
daiIlkOracle1.set(assets_1.WBTC, CHAINLINK_MULTI_ORACLE);
daiIlkOracle1.set(assets_1.stETH, COMPOSITE_MULTI_ORACLE);
daiIlkOracle1.set(assets_1.wstETH, COMPOSITE_MULTI_ORACLE);
daiIlkOracle1.set(assets_1.ENS, COMPOSITE_MULTI_ORACLE);
daiIlkOracle1.set(assets_1.LINK, CHAINLINK_MULTI_ORACLE);
daiIlkOracle1.set(assets_1.UNI, CHAINLINK_MULTI_ORACLE);
daiIlkOracle1.set(assets_1.yvUSDC, YEARNVAULT_MULTI_ORACLE);
daiIlkOracle1.set(assets_1.MKR, COMPOSITE_MULTI_ORACLE);
daiIlkOracle1.set(assets_1.FRAX, CHAINLINK_MULTI_ORACLE);
/* notional additions */
daiIlkOracle1.set(assets_1.FDAI2203, NOTIONAL_MULTI_ORACLE);
daiIlkOracle1.set(assets_1.FDAI2206, NOTIONAL_MULTI_ORACLE);
daiIlkOracle1.set(assets_1.FDAI2209, NOTIONAL_MULTI_ORACLE);
/* convex */
daiIlkOracle1.set(assets_1.CVX3CRV, COMPOSITE_MULTI_ORACLE);
/* rate oracle */
daiIlkOracle1.set(RATE, COMPOUND_MULTI_ORACLE);
exports.CHAIN_ID_1_ASSET_ORACLE_INFO.set(assets_1.DAI, daiIlkOracle1);
// WETH base
const wethIlkOracle1 = new Map();
wethIlkOracle1.set(assets_1.WETH, CHAINLINK_MULTI_ORACLE);
wethIlkOracle1.set(assets_1.DAI, CHAINLINK_MULTI_ORACLE);
wethIlkOracle1.set(assets_1.USDC, CHAINLINK_MULTI_ORACLE);
wethIlkOracle1.set(assets_1.WBTC, CHAINLINK_MULTI_ORACLE);
wethIlkOracle1.set(assets_1.stETH, COMPOSITE_MULTI_ORACLE);
wethIlkOracle1.set(assets_1.wstETH, COMPOSITE_MULTI_ORACLE);
wethIlkOracle1.set(assets_1.ENS, COMPOSITE_MULTI_ORACLE);
wethIlkOracle1.set(assets_1.LINK, CHAINLINK_MULTI_ORACLE);
wethIlkOracle1.set(assets_1.UNI, CHAINLINK_MULTI_ORACLE);
wethIlkOracle1.set(assets_1.yvUSDC, YEARNVAULT_MULTI_ORACLE);
wethIlkOracle1.set(assets_1.MKR, COMPOSITE_MULTI_ORACLE);
wethIlkOracle1.set(assets_1.FRAX, CHAINLINK_MULTI_ORACLE);
/* rate */
wethIlkOracle1.set(RATE, COMPOUND_MULTI_ORACLE);
exports.CHAIN_ID_1_ASSET_ORACLE_INFO.set(assets_1.WETH, wethIlkOracle1);
// FRAX base
const fraxIlkOracle1 = new Map();
fraxIlkOracle1.set(assets_1.WETH, CHAINLINK_MULTI_ORACLE);
fraxIlkOracle1.set(assets_1.DAI, CHAINLINK_MULTI_ORACLE);
fraxIlkOracle1.set(assets_1.USDC, CHAINLINK_MULTI_ORACLE);
fraxIlkOracle1.set(assets_1.WBTC, CHAINLINK_MULTI_ORACLE);
fraxIlkOracle1.set(assets_1.stETH, COMPOSITE_MULTI_ORACLE);
fraxIlkOracle1.set(assets_1.wstETH, COMPOSITE_MULTI_ORACLE);
fraxIlkOracle1.set(assets_1.ENS, COMPOSITE_MULTI_ORACLE);
fraxIlkOracle1.set(assets_1.LINK, CHAINLINK_MULTI_ORACLE);
fraxIlkOracle1.set(assets_1.UNI, CHAINLINK_MULTI_ORACLE);
fraxIlkOracle1.set(assets_1.MKR, COMPOSITE_MULTI_ORACLE);
/* rate */
fraxIlkOracle1.set(RATE, ACCUMULATOR_MULTI_ORACLE);
exports.CHAIN_ID_1_ASSET_ORACLE_INFO.set(assets_1.FRAX, fraxIlkOracle1);
/* chain id 42161, 421611 (aribtrum mainnet and arbitrum rinkeby use the same oracle contracts) */
// USDC base
const usdcIlkOracle421611 = new Map();
usdcIlkOracle421611.set(assets_1.WETH, CHAINLINK_USD_ORACLE);
usdcIlkOracle421611.set(assets_1.DAI, CHAINLINK_USD_ORACLE);
usdcIlkOracle421611.set(assets_1.USDC, CHAINLINK_USD_ORACLE);
usdcIlkOracle421611.set(assets_1.WBTC, CHAINLINK_USD_ORACLE);
usdcIlkOracle421611.set(assets_1.stETH, CHAINLINK_USD_ORACLE);
usdcIlkOracle421611.set(assets_1.wstETH, CHAINLINK_USD_ORACLE);
usdcIlkOracle421611.set(assets_1.ENS, CHAINLINK_USD_ORACLE);
usdcIlkOracle421611.set(assets_1.LINK, CHAINLINK_USD_ORACLE);
usdcIlkOracle421611.set(assets_1.UNI, CHAINLINK_USD_ORACLE);
usdcIlkOracle421611.set(assets_1.yvUSDC, YEARNVAULT_MULTI_ORACLE);
usdcIlkOracle421611.set(assets_1.MKR, CHAINLINK_USD_ORACLE);
usdcIlkOracle421611.set(RATE, ACCUMULATOR_MULTI_ORACLE);
// usdcIlkOracle421611.set(RATE, ACCUMLATOR_ORACLE);
exports.CHAIN_ID_421611_ASSET_ORACLE_INFO.set(assets_1.USDC, usdcIlkOracle421611);
// DAI base
const daiIlkOracle421611 = new Map();
daiIlkOracle421611.set(assets_1.WETH, CHAINLINK_USD_ORACLE);
daiIlkOracle421611.set(assets_1.DAI, CHAINLINK_USD_ORACLE);
daiIlkOracle421611.set(assets_1.USDC, CHAINLINK_USD_ORACLE);
daiIlkOracle421611.set(assets_1.WBTC, CHAINLINK_USD_ORACLE);
daiIlkOracle421611.set(assets_1.stETH, CHAINLINK_USD_ORACLE);
daiIlkOracle421611.set(assets_1.wstETH, CHAINLINK_USD_ORACLE);
daiIlkOracle421611.set(assets_1.ENS, CHAINLINK_USD_ORACLE);
daiIlkOracle421611.set(assets_1.LINK, CHAINLINK_USD_ORACLE);
daiIlkOracle421611.set(assets_1.UNI, CHAINLINK_USD_ORACLE);
daiIlkOracle421611.set(assets_1.yvUSDC, YEARNVAULT_MULTI_ORACLE);
daiIlkOracle421611.set(assets_1.MKR, CHAINLINK_USD_ORACLE);
daiIlkOracle421611.set(RATE, ACCUMULATOR_MULTI_ORACLE);
exports.CHAIN_ID_421611_ASSET_ORACLE_INFO.set(assets_1.DAI, daiIlkOracle421611);
// wETH BASE
const ethIlkOracle421611 = new Map();
ethIlkOracle421611.set(assets_1.WETH, CHAINLINK_USD_ORACLE);
ethIlkOracle421611.set(assets_1.DAI, CHAINLINK_USD_ORACLE);
ethIlkOracle421611.set(assets_1.USDC, CHAINLINK_USD_ORACLE);
ethIlkOracle421611.set(assets_1.WBTC, CHAINLINK_USD_ORACLE);
ethIlkOracle421611.set(assets_1.stETH, CHAINLINK_USD_ORACLE);
ethIlkOracle421611.set(assets_1.wstETH, CHAINLINK_USD_ORACLE);
ethIlkOracle421611.set(RATE, ACCUMULATOR_MULTI_ORACLE);
exports.CHAIN_ID_421611_ASSET_ORACLE_INFO.set(assets_1.WETH, ethIlkOracle421611);
exports.ORACLE_INFO.set(1, exports.CHAIN_ID_1_ASSET_ORACLE_INFO);
exports.ORACLE_INFO.set(4, exports.CHAIN_ID_1_ASSET_ORACLE_INFO);
exports.ORACLE_INFO.set(5, exports.CHAIN_ID_1_ASSET_ORACLE_INFO);
exports.ORACLE_INFO.set(42, exports.CHAIN_ID_1_ASSET_ORACLE_INFO);
exports.ORACLE_INFO.set(42161, exports.CHAIN_ID_421611_ASSET_ORACLE_INFO);
exports.ORACLE_INFO.set(421611, exports.CHAIN_ID_421611_ASSET_ORACLE_INFO);
/** 1
       "CompoundMultiOracle": "0x53FBa816BD69a7f2a096f58687f87dd3020d0d5c",
      "ChainlinkMultiOracle": "0xcDCe5C87f691058B61f3A65913f1a3cBCbAd9F52",
      "CompositeMultiOracle": "0xA81414a544D0bd8a28257F4038D3D24B08Dd9Bb4",
      "YearnVaultMultiOracle": "0xC597E9cA52Afc13F7F5EDdaC9e53DEF569236016",
      "NotionalMultiOracle": "0x660bB2F1De01AacA46FCD8004e852234Cf65F3fb",
      "AccumulatorMultiOracle": "0x95750d6F5fba4ed1cc4Dc42D2c01dFD3DB9a11eC",
 */
/** 42161
"ChainlinkUSDOracle": "0x30e042468e333Fde8E52Dd237673D7412045D2AC",
"AccumulatorOracle": "0x0ad9Ef93673B6081c0c3b753CcaaBDdd8d2e7848",
"AccumulatorMultiOracle": "0x0ad9Ef93673B6081c0c3b753CcaaBDdd8d2e7848",
*/
//# sourceMappingURL=oracles.js.map