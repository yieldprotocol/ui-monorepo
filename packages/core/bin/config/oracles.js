"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ORACLES = exports.oracleAddresses = void 0;
const tslib_1 = require("tslib");
const assets = tslib_1.__importStar(require("./assets"));
const COMPOSITE_MULTI_ORACLE = 'CompositeMultiOracle';
const CHAINLINK_MULTI_ORACLE = 'ChainlinkMultiOracle';
const YEARNVAULT_MULTI_ORACLE = 'YearnVaultMultiOracle';
const NOTIONAL_MULTI_ORACLE = 'NotionalMultiOracle';
const CHAINLINK_USD_ORACLE = 'ChainlinkUSDOracle';
// export the addreses
exports.oracleAddresses = new Map([
    [
        1,
        {
            CompoundMultiOracle: '0x53FBa816BD69a7f2a096f58687f87dd3020d0d5c',
            ChainlinkMultiOracle: '0xcDCe5C87f691058B61f3A65913f1a3cBCbAd9F52',
            CompositeMultiOracle: '0xA81414a544D0bd8a28257F4038D3D24B08Dd9Bb4',
            YearnVaultMultiOracle: '0xC597E9cA52Afc13F7F5EDdaC9e53DEF569236016',
            NotionalMultiOracle: '0x660bB2F1De01AacA46FCD8004e852234Cf65F3fb',
        },
    ],
    [
        4,
        {
            CompoundMultiOracle: '0xe3D47c23c7EBddF81702421657fF7836d700bDF4',
            ChainlinkMultiOracle: '0xACD6af7bf3555C63686952C65b4a1D5E51c4586b',
            CompositeMultiOracle: '0x577DA88C253095b874941dda194a6c59489E644f',
            YearnVaultMultiOracle: '0x392333A9d4CfCC529a7DA3F6021c5dfc6C54e1EF',
            NotionalMultiOracle: '0x5F5F54757Dd8c04E28F092EDb8013B51F33F4e8F',
        },
    ],
    [
        5,
        {
            CompoundMultiOracle: '0xC6EDBfFb3e998abB792BB7A03160Af9171927287',
            ChainlinkMultiOracle: '0xaF9E20f4b75dd7bdBFb792AA1918558fCEDbcb68',
            CompositeMultiOracle: '0x3Ee221CD96BEaf3aD6EaB8AF4c05C5BEEbd902ed',
            YearnVaultMultiOracle: '0x691dB8F78413C0D2623FCA3dd71029EbC08a1603',
            NotionalMultiOracle: '0x5F5F54757Dd8c04E28F092EDb8013B51F33F4e8F',
        },
    ],
    [
        42161,
        {
            ChainlinkUSDOracle: '0x30e042468e333Fde8E52Dd237673D7412045D2AC',
            AccumulatorOracle: '0x0ad9Ef93673B6081c0c3b753CcaaBDdd8d2e7848',
        },
    ],
]);
// map chain id to oracle info
exports.ORACLES = new Map();
// map asset (quote) and other asset (base) to a specific oracle based on where there is relevant price info for the pair
const ETHEREUM_ORACLES = new Map();
const ARBITRUM_ORACLES = new Map();
// USDC base on Ethereum
const usdcBaseEthereum = new Map([
    [assets.WETH, CHAINLINK_MULTI_ORACLE],
    [assets.DAI, CHAINLINK_MULTI_ORACLE],
    [assets.USDC, CHAINLINK_MULTI_ORACLE],
    [assets.WBTC, CHAINLINK_MULTI_ORACLE],
    [assets.stETH, COMPOSITE_MULTI_ORACLE],
    [assets.wstETH, COMPOSITE_MULTI_ORACLE],
    [assets.ENS, COMPOSITE_MULTI_ORACLE],
    [assets.LINK, CHAINLINK_MULTI_ORACLE],
    [assets.UNI, CHAINLINK_MULTI_ORACLE],
    [assets.yvUSDC, YEARNVAULT_MULTI_ORACLE],
    [assets.MKR, COMPOSITE_MULTI_ORACLE],
    [assets.FRAX, CHAINLINK_MULTI_ORACLE],
    [assets.FUSDC2203, NOTIONAL_MULTI_ORACLE],
    [assets.FUSDC2206, NOTIONAL_MULTI_ORACLE],
    [assets.FUSDC2209, NOTIONAL_MULTI_ORACLE],
    [assets.CVX3CRV, COMPOSITE_MULTI_ORACLE], // convex
]);
ETHEREUM_ORACLES.set(assets.USDC, usdcBaseEthereum);
// DAI base on Ethereum
const daiBaseEthereum = new Map([
    [assets.WETH, CHAINLINK_MULTI_ORACLE],
    [assets.DAI, CHAINLINK_MULTI_ORACLE],
    [assets.USDC, CHAINLINK_MULTI_ORACLE],
    [assets.WBTC, CHAINLINK_MULTI_ORACLE],
    [assets.stETH, COMPOSITE_MULTI_ORACLE],
    [assets.wstETH, COMPOSITE_MULTI_ORACLE],
    [assets.ENS, COMPOSITE_MULTI_ORACLE],
    [assets.LINK, CHAINLINK_MULTI_ORACLE],
    [assets.UNI, CHAINLINK_MULTI_ORACLE],
    [assets.yvUSDC, YEARNVAULT_MULTI_ORACLE],
    [assets.MKR, COMPOSITE_MULTI_ORACLE],
    [assets.FRAX, CHAINLINK_MULTI_ORACLE],
    [assets.FDAI2203, NOTIONAL_MULTI_ORACLE],
    [assets.FDAI2206, NOTIONAL_MULTI_ORACLE],
    [assets.FDAI2209, NOTIONAL_MULTI_ORACLE],
    [assets.CVX3CRV, COMPOSITE_MULTI_ORACLE], // convex
]);
ETHEREUM_ORACLES.set(assets.DAI, daiBaseEthereum);
// WETH base on Ethereum
const wethBaseEthereum = new Map([
    [assets.WETH, CHAINLINK_MULTI_ORACLE],
    [assets.DAI, CHAINLINK_MULTI_ORACLE],
    [assets.USDC, CHAINLINK_MULTI_ORACLE],
    [assets.WBTC, CHAINLINK_MULTI_ORACLE],
    [assets.stETH, COMPOSITE_MULTI_ORACLE],
    [assets.wstETH, COMPOSITE_MULTI_ORACLE],
    [assets.ENS, COMPOSITE_MULTI_ORACLE],
    [assets.LINK, CHAINLINK_MULTI_ORACLE],
    [assets.UNI, CHAINLINK_MULTI_ORACLE],
    [assets.yvUSDC, YEARNVAULT_MULTI_ORACLE],
    [assets.MKR, COMPOSITE_MULTI_ORACLE],
    [assets.FRAX, CHAINLINK_MULTI_ORACLE],
]);
ETHEREUM_ORACLES.set(assets.WETH, wethBaseEthereum);
// FRAX base on Ethereum
const fraxBaseEthereum = new Map([
    [assets.WETH, CHAINLINK_MULTI_ORACLE],
    [assets.DAI, CHAINLINK_MULTI_ORACLE],
    [assets.USDC, CHAINLINK_MULTI_ORACLE],
    [assets.WBTC, CHAINLINK_MULTI_ORACLE],
    [assets.stETH, COMPOSITE_MULTI_ORACLE],
    [assets.wstETH, COMPOSITE_MULTI_ORACLE],
    [assets.ENS, COMPOSITE_MULTI_ORACLE],
    [assets.LINK, CHAINLINK_MULTI_ORACLE],
    [assets.UNI, CHAINLINK_MULTI_ORACLE],
    [assets.MKR, COMPOSITE_MULTI_ORACLE],
]);
ETHEREUM_ORACLES.set(assets.FRAX, fraxBaseEthereum);
/* chain id 42161, 421611 (aribtrum mainnet and arbitrum rinkeby use the same oracle contracts) */
// USDC base on Arbiturm
const usdcBaseArbitrum = new Map([
    [assets.WETH, CHAINLINK_USD_ORACLE],
    [assets.DAI, CHAINLINK_USD_ORACLE],
    [assets.USDC, CHAINLINK_USD_ORACLE],
    [assets.WBTC, CHAINLINK_USD_ORACLE],
    [assets.stETH, CHAINLINK_USD_ORACLE],
    [assets.wstETH, CHAINLINK_USD_ORACLE],
    [assets.ENS, CHAINLINK_USD_ORACLE],
    [assets.LINK, CHAINLINK_USD_ORACLE],
    [assets.UNI, CHAINLINK_USD_ORACLE],
    [assets.yvUSDC, YEARNVAULT_MULTI_ORACLE],
    [assets.MKR, CHAINLINK_USD_ORACLE],
]);
ARBITRUM_ORACLES.set(assets.USDC, usdcBaseArbitrum);
// DAI base on Arbiturm
const daiBaseArbitrum = new Map([
    [assets.WETH, CHAINLINK_USD_ORACLE],
    [assets.DAI, CHAINLINK_USD_ORACLE],
    [assets.USDC, CHAINLINK_USD_ORACLE],
    [assets.WBTC, CHAINLINK_USD_ORACLE],
    [assets.stETH, CHAINLINK_USD_ORACLE],
    [assets.wstETH, CHAINLINK_USD_ORACLE],
    [assets.ENS, CHAINLINK_USD_ORACLE],
    [assets.LINK, CHAINLINK_USD_ORACLE],
    [assets.UNI, CHAINLINK_USD_ORACLE],
    [assets.yvUSDC, YEARNVAULT_MULTI_ORACLE],
    [assets.MKR, CHAINLINK_USD_ORACLE],
]);
ARBITRUM_ORACLES.set(assets.DAI, daiBaseArbitrum);
/* Set a general ORACLE_INFO MAP for export */
exports.ORACLES.set(1, ETHEREUM_ORACLES);
exports.ORACLES.set(4, ETHEREUM_ORACLES);
exports.ORACLES.set(5, ETHEREUM_ORACLES);
exports.ORACLES.set(42, ETHEREUM_ORACLES);
exports.ORACLES.set(42161, ARBITRUM_ORACLES);
exports.ORACLES.set(421611, ARBITRUM_ORACLES);
//# sourceMappingURL=oracles.js.map