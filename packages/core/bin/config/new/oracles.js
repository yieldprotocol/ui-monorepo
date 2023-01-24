"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assets_1 = require("./assets");
const RATE = '0x5241544500000000000000000000000000000000000000000000000000000000';
const COMPOUND_MULTI_ORACLE = 'CompoundMultiOracle';
const COMPOSITE_MULTI_ORACLE = 'CompositeMultiOracle';
const CHAINLINK_MULTI_ORACLE = 'ChainlinkMultiOracle';
const YEARNVAULT_MULTI_ORACLE = 'YearnVaultMultiOracle';
const CHAINLINK_USD_ORACLE = 'ChainlinkUSDOracle';
const NOTIONAL_MULTI_ORACLE = 'NotionalMultiOracle';
const ACCUMULATOR_ORACLE = 'AccumulatorOracle';
// map chain id to oracle info
const ORACLES = new Map();
// map asset (quote) and other asset (base) to a specific oracle based on where there is relevant price info for the pair
const CHAIN_ID_1_ASSET_ORACLE_INFO = new Map();
const CHAIN_ID_42_ASSET_ORACLE_INFO = new Map();
const CHAIN_ID_42161_ASSET_ORACLE_INFO = new Map();
const CHAIN_ID_421611_ASSET_ORACLE_INFO = new Map();
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
usdcIlkOracle1.set(assets_1.CRAB, COMPOSITE_MULTI_ORACLE);
/* notional additions */
usdcIlkOracle1.set(assets_1.FUSDC2203, NOTIONAL_MULTI_ORACLE);
usdcIlkOracle1.set(assets_1.FUSDC2206, NOTIONAL_MULTI_ORACLE);
usdcIlkOracle1.set(assets_1.FUSDC2209, NOTIONAL_MULTI_ORACLE);
usdcIlkOracle1.set(assets_1.FUSDC2212, NOTIONAL_MULTI_ORACLE);
usdcIlkOracle1.set(assets_1.FUSDC2303, NOTIONAL_MULTI_ORACLE);
/* convex */
usdcIlkOracle1.set(assets_1.CVX3CRV, COMPOSITE_MULTI_ORACLE);
/* rate */
usdcIlkOracle1.set(RATE, COMPOUND_MULTI_ORACLE);
CHAIN_ID_1_ASSET_ORACLE_INFO.set(assets_1.USDC, usdcIlkOracle1);
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
daiIlkOracle1.set(assets_1.CRAB, COMPOSITE_MULTI_ORACLE);
/* notional additions */
daiIlkOracle1.set(assets_1.FDAI2203, NOTIONAL_MULTI_ORACLE);
daiIlkOracle1.set(assets_1.FDAI2206, NOTIONAL_MULTI_ORACLE);
daiIlkOracle1.set(assets_1.FDAI2209, NOTIONAL_MULTI_ORACLE);
daiIlkOracle1.set(assets_1.FDAI2212, NOTIONAL_MULTI_ORACLE);
daiIlkOracle1.set(assets_1.FDAI2303, NOTIONAL_MULTI_ORACLE);
/* convex */
daiIlkOracle1.set(assets_1.CVX3CRV, COMPOSITE_MULTI_ORACLE);
/* rate oracle */
daiIlkOracle1.set(RATE, COMPOUND_MULTI_ORACLE);
CHAIN_ID_1_ASSET_ORACLE_INFO.set(assets_1.DAI, daiIlkOracle1);
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
wethIlkOracle1.set(assets_1.CRAB, COMPOSITE_MULTI_ORACLE);
/* notional additions */
wethIlkOracle1.set(assets_1.FETH2212, NOTIONAL_MULTI_ORACLE);
wethIlkOracle1.set(assets_1.FETH2303, NOTIONAL_MULTI_ORACLE);
/* rate */
wethIlkOracle1.set(RATE, COMPOUND_MULTI_ORACLE);
CHAIN_ID_1_ASSET_ORACLE_INFO.set(assets_1.WETH, wethIlkOracle1);
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
fraxIlkOracle1.set(assets_1.CRAB, COMPOSITE_MULTI_ORACLE);
/* rate */
fraxIlkOracle1.set(RATE, ACCUMULATOR_ORACLE);
CHAIN_ID_1_ASSET_ORACLE_INFO.set(assets_1.FRAX, fraxIlkOracle1);
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
usdcIlkOracle421611.set(RATE, ACCUMULATOR_ORACLE);
// usdcIlkOracle421611.set(RATE, ACCUMLATOR_ORACLE);
CHAIN_ID_421611_ASSET_ORACLE_INFO.set(assets_1.USDC, usdcIlkOracle421611);
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
daiIlkOracle421611.set(RATE, ACCUMULATOR_ORACLE);
CHAIN_ID_421611_ASSET_ORACLE_INFO.set(assets_1.DAI, daiIlkOracle421611);
// wETH BASE
const ethIlkOracle421611 = new Map();
ethIlkOracle421611.set(assets_1.WETH, CHAINLINK_USD_ORACLE);
ethIlkOracle421611.set(assets_1.DAI, CHAINLINK_USD_ORACLE);
ethIlkOracle421611.set(assets_1.USDC, CHAINLINK_USD_ORACLE);
ethIlkOracle421611.set(assets_1.WBTC, CHAINLINK_USD_ORACLE);
ethIlkOracle421611.set(assets_1.stETH, CHAINLINK_USD_ORACLE);
ethIlkOracle421611.set(assets_1.wstETH, CHAINLINK_USD_ORACLE);
ethIlkOracle421611.set(RATE, ACCUMULATOR_ORACLE);
CHAIN_ID_421611_ASSET_ORACLE_INFO.set(assets_1.WETH, ethIlkOracle421611);
ORACLES.set(1, CHAIN_ID_1_ASSET_ORACLE_INFO);
ORACLES.set(4, CHAIN_ID_1_ASSET_ORACLE_INFO);
ORACLES.set(5, CHAIN_ID_1_ASSET_ORACLE_INFO);
ORACLES.set(42, CHAIN_ID_1_ASSET_ORACLE_INFO);
ORACLES.set(42161, CHAIN_ID_421611_ASSET_ORACLE_INFO);
ORACLES.set(421611, CHAIN_ID_421611_ASSET_ORACLE_INFO);
exports.default = ORACLES;
//# sourceMappingURL=oracles.js.map