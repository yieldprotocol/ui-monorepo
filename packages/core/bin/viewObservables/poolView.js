"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPartialRemoveRequiredø = exports.removeLiquidityReturnø = exports.borrowAndPoolVaultø = exports.maximumRemoveLiquidityø = exports.isBuyAndPoolPossibleø = exports.maximumAddLiquidityø = void 0;
const ui_math_1 = require("@yield-protocol/ui-math");
const ethers_1 = require("ethers");
const rxjs_1 = require("rxjs");
const observables_1 = require("../observables");
const utils_1 = require("../utils");
const input_1 = require("./input");
// maxRemoveNoVault,
// maxRemoveWithVault,
// partialRemoveRequired, // boolean
// removeBaseReceived,
// removeFyTokenReceived,
// removeBaseReceived_,
// removeFyTokenReceived_,
/**
 * @category Pool | Add Liquidity
 */
exports.maximumAddLiquidityø = observables_1.selectedø.pipe((0, rxjs_1.map)(({ base }) => {
    return (base === null || base === void 0 ? void 0 : base.balance) || utils_1.ZERO_BN;
}));
/**
 * Check if it is possible to use BUY and POOL strategy is available for a particular INPUT and selected strategy.
 * @category Pool | Add Liquidity
 */
exports.isBuyAndPoolPossibleø = (0, rxjs_1.combineLatest)([
    input_1.addLiquidityInputø,
    observables_1.selectedø,
    observables_1.userSettingsø,
]).pipe(
/* don't emit if input is zero or there isn't a strategy selected */
(0, rxjs_1.filter)(([input, selected]) => input.gt(utils_1.ZERO_BN) && !!selected.series), (0, rxjs_1.map)(([input, { series }, { slippageTolerance }]) => {
    const strategySeries = series; // filtered, we can safetly assume current series defined.
    let _fyTokenToBuy = utils_1.ZERO_BN;
    const _maxFyTokenOut = (0, ui_math_1.maxFyTokenOut)(strategySeries.baseReserves, strategySeries.fyTokenReserves, strategySeries.getTimeTillMaturity(), strategySeries.ts, strategySeries.g1, strategySeries.decimals);
    [_fyTokenToBuy] = (0, ui_math_1.fyTokenForMint)(strategySeries.baseReserves, strategySeries.fyTokenRealReserves, strategySeries.fyTokenReserves, (0, ui_math_1.calculateSlippage)(input, slippageTolerance.toString(), true), strategySeries.getTimeTillMaturity(), strategySeries.ts, strategySeries.g1, strategySeries.decimals, slippageTolerance);
    /* Check if buy and pool option is allowed */
    const buyAndPoolAllowed = _fyTokenToBuy.gt(ethers_1.ethers.constants.Zero) &&
        _fyTokenToBuy.lt(_maxFyTokenOut) &&
        parseFloat(strategySeries.apr) > 0.25;
    // diagnostics && console.log('Can BuyAndPool?', buyAndPoolAllowed);
    return buyAndPoolAllowed;
}));
/**
 * Maximum removalable liquidity
 * - currently liquidity is always removable, so the balance is the strategy token balance
 *
 * @category Pool | Remove Liquidity
 */
exports.maximumRemoveLiquidityø = observables_1.selectedø.pipe((0, rxjs_1.map)(({ strategy }) => (strategy === null || strategy === void 0 ? void 0 : strategy.accountBalance) || utils_1.ZERO_BN));
/**
 * Get the vault ( if adding liquidity was done using the 'Borrow and Pool' method. )
 * @category Pool | Remove Liquidity
 */
exports.borrowAndPoolVaultø = (0, rxjs_1.combineLatest)([observables_1.selectedø, observables_1.vaultMapø]).pipe((0, rxjs_1.filter)(([selected]) => !!selected.strategy), (0, rxjs_1.map)(([{ strategy }, vaultMap]) => {
    const { baseId, currentSeriesId } = strategy;
    const arr = Array.from(vaultMap.values());
    const _matchingVault = arr
        .sort((vaultA, vaultB) => (vaultA.id > vaultB.id ? 1 : -1))
        .sort((vaultA, vaultB) => (vaultA.art.lt(vaultB.art) ? 1 : -1))
        .find((v) => v.ilkId === baseId && v.baseId === baseId && v.seriesId === currentSeriesId && v.isActive);
    // diagnostics && console.log('Matching Vault:', _matchingVault?.id || 'No matching vault.');
    return _matchingVault;
}));
/**
 *
 * Indicates the amount of [0] Base and [1] fyTokens that will be returned when partially removing liquidity tokens
 * based on the input
 * @returns [ base returned, fyTokens returned]
 * @category Pool | Remove Liquidity
 *
 * */
exports.removeLiquidityReturnø = (0, rxjs_1.combineLatest)([
    input_1.removeLiquidityInputø,
    observables_1.selectedø,
    exports.borrowAndPoolVaultø,
]).pipe((0, rxjs_1.filter)(([input, selected]) => input.gt(utils_1.ZERO_BN) && !!selected.series), (0, rxjs_1.map)(([input, { strategy, series }, borrowAndPoolVault]) => {
    const strategySeries = series; // NOTE: filtered, we can safetly assume strategy currentSeries is defined.
    if (!!borrowAndPoolVault) {
        /**
         * CASE Matching vault (with debt) exists: USE 1 , 2.1 or 2.2
         * */
        /* Check the amount of fyTokens potentially recieved */
        const lpReceived = (0, ui_math_1.burnFromStrategy)(strategy === null || strategy === void 0 ? void 0 : strategy.strategyPoolBalance, strategy === null || strategy === void 0 ? void 0 : strategy.strategyTotalSupply, input);
        const [_baseReceived, _fyTokenReceived] = (0, ui_math_1.burn)(strategySeries.baseReserves, strategySeries.fyTokenRealReserves, strategySeries.totalSupply, lpReceived);
        // diagnostics && console.log('burnt (base, fytokens)', _baseReceived.toString(), _fyTokenReceived.toString());
        if (_fyTokenReceived.gt(borrowAndPoolVault === null || borrowAndPoolVault === void 0 ? void 0 : borrowAndPoolVault.accruedArt)) {
            /**
             * Fytoken received greater than debt : USE REMOVE OPTION 2.1 or 2.2
             * */
            // diagnostics &&
            //   console.log(
            //     'FyTokens received will be greater than debt: an extra sellFytoken trade is required: REMOVE OPTION 2.1 or 2.2 '
            //   );
            const _extraFyTokensToSell = _fyTokenReceived.sub(borrowAndPoolVault.accruedArt);
            // diagnostics && console.log(_extraFyTokensToSell.toString(), 'FyTokens Need to be sold');
            const _extraFyTokenValue = (0, ui_math_1.sellFYToken)(strategySeries.baseReserves, strategySeries.fyTokenRealReserves, _extraFyTokensToSell, (0, ui_math_1.secondsToFrom)(strategySeries.maturity.toString()), strategySeries.ts, strategySeries.g2, strategySeries.decimals);
            if (_extraFyTokenValue.gt(utils_1.ZERO_BN)) {
                /**
                 * CASE> extra fyToken TRADE IS POSSIBLE :  USE REMOVE OPTION 2.1
                 * */
                const totalValue = _baseReceived.add(_extraFyTokenValue); // .add(_fyTokenReceived);
                return [totalValue, utils_1.ZERO_BN];
            }
            else {
                /**
                 * CASE> extra fyToken TRADE NOT POSSIBLE ( limited by protocol ): USE REMOVE OPTION 2.2
                 * */
                const _fyTokenVal = _fyTokenReceived.sub(borrowAndPoolVault.accruedArt);
                const _baseVal = _baseReceived; // .add(matchingVault.art);
                return [_baseVal, _fyTokenVal];
            }
        }
        else {
            /**
             * CASE> fytokenReceived less than debt : USE REMOVE OPTION 1
             *  */
            const _value = _baseReceived; // .add(_fyTokenReceived);
            // diagnostics &&
            //   console.log(
            //     'FyTokens received will Less than debt: straight No extra trading is required : USE REMOVE OPTION 1 '
            //   );
            return [_value, utils_1.ZERO_BN];
        }
    }
    else {
        /**
         * SCENARIO > No matching vault exists : USE REMOVE OPTION 4
         * */
        /* Check the amount of fyTokens potentially recieved */
        const lpReceived = (0, ui_math_1.burnFromStrategy)(strategy.strategyPoolBalance, strategy.strategyTotalSupply, input);
        const [_baseReceived, _fyTokenReceived] = (0, ui_math_1.burn)(strategySeries.baseReserves, strategySeries.fyTokenRealReserves, strategySeries.totalSupply, lpReceived);
        /* Calculate the token Value */
        const [tokenSellValue, totalTokenValue] = (0, ui_math_1.strategyTokenValue)(input, strategy === null || strategy === void 0 ? void 0 : strategy.strategyTotalSupply, strategy === null || strategy === void 0 ? void 0 : strategy.strategyPoolBalance, strategySeries.baseReserves, strategySeries.fyTokenRealReserves, strategySeries.totalSupply, strategySeries.getTimeTillMaturity(), strategySeries.ts, strategySeries.g2, strategySeries.decimals);
        // diagnostics && console.log('NO VAULT : pool trade is possible  : USE REMOVE OPTION 4.1 ');
        if (tokenSellValue.gt(utils_1.ZERO_BN))
            return [totalTokenValue, utils_1.ZERO_BN];
        // diagnostics && console.log('NO VAULT : trade not possible : USE REMOVE OPTION 4.2');
        return [_baseReceived, _fyTokenReceived];
    }
}));
/**
* Check if not all liquidity can be removed, and a partial removal is required.
* @category Pool | Remove Liquidity
*/
exports.isPartialRemoveRequiredø = exports.removeLiquidityReturnø.pipe((0, rxjs_1.map)((removals) => {
    //diagnostics &&  console.log( 'partial removal is required')
    const areFyTokensReturned = removals[1].gt(utils_1.ZERO_BN);
    return areFyTokensReturned;
}));
//# sourceMappingURL=poolView.js.map