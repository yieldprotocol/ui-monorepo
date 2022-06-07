"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputToTokenValue = exports.truncateValue = exports.ratioToPercent = exports.getStrategySymbol = exports.formatStrategyName = exports.getStrategyAddrFromReceipt = exports.getSeriesAfterRollPosition = exports.getVaultIdFromReceipt = exports.getPositionPath = exports.nameFromMaturity = exports.baseIdFromSeriesId = exports.getSignId = exports.getAssetPairId = exports.getProcessCode = exports.generateVaultName = void 0;
const date_fns_1 = require("date-fns");
const ethers_1 = require("ethers");
const unique_names_generator_1 = require("unique-names-generator");
// TODO: maybe remove type dependence in this file? 
const types_1 = require("../types");
const generateVaultName = (id) => {
    const vaultNameConfig = {
        dictionaries: [unique_names_generator_1.adjectives, unique_names_generator_1.animals],
        separator: ' ',
        length: 2,
    };
    return (0, unique_names_generator_1.uniqueNamesGenerator)(Object.assign({ seed: parseInt(id.substring(14), 16) }, vaultNameConfig));
};
exports.generateVaultName = generateVaultName;
/* creates internal tracking code of a transaction type */
const getProcessCode = (txType, vaultOrSeriesId) => `${txType}_${vaultOrSeriesId}`;
exports.getProcessCode = getProcessCode;
/* get the assetPairId with input as either the base/ilk themselves OR an id-string */
const getAssetPairId = (baseId, ilkId) => `${baseId}:${ilkId}`;
exports.getAssetPairId = getAssetPairId;
/* get the internal id of a signature */
const getSignId = (signData) => `${signData.target.symbol}_${signData.spender}`;
exports.getSignId = getSignId;
/**
 * Calculate the baseId from the series nae
 * @param seriesId seriesID.
 * @returns string bytes32
 */
function baseIdFromSeriesId(seriesId) {
    return seriesId.slice(0, 6).concat('00000000');
}
exports.baseIdFromSeriesId = baseIdFromSeriesId;
/**
 *
 * Generate the series name from the maturity number.
 * Examples: full (defualt) : 'MMMM yyyy' ,  apr badge  : 'MMM yy' , mobile: 'MMM yyyy'
 * NOTE: subtraction used to accuount for time zone differences
 * */
const nameFromMaturity = (maturity, style = 'MMMM yyyy') => (0, date_fns_1.format)((0, date_fns_1.subDays)(new Date(maturity * 1000), 2), style);
exports.nameFromMaturity = nameFromMaturity;
const getPositionPath = (processCode, receipt, contractMap, seriesMap) => {
    // console.log('🦄 ~ file: appUtils.ts ~ line 188 ~ getPositionPath ~ receipt', receipt);
    const action = processCode.split('_')[0];
    const positionId = processCode.split('_')[1];
    switch (action) {
        // BORROW
        case types_1.ActionCodes.BORROW:
        case types_1.ActionCodes.ADD_COLLATERAL:
        case types_1.ActionCodes.REMOVE_COLLATERAL:
        case types_1.ActionCodes.REPAY:
        case types_1.ActionCodes.ROLL_DEBT:
        case types_1.ActionCodes.TRANSFER_VAULT:
        case types_1.ActionCodes.MERGE_VAULT:
            return `/vaultposition/${(0, exports.getVaultIdFromReceipt)(receipt, contractMap)}`;
        // LEND
        case types_1.ActionCodes.LEND:
        case types_1.ActionCodes.CLOSE_POSITION:
        case types_1.ActionCodes.REDEEM:
            return `/lendposition/${positionId}`;
        case types_1.ActionCodes.ROLL_POSITION:
            return `/lendposition/${(0, exports.getSeriesAfterRollPosition)(receipt, seriesMap)}`;
        // POOL
        case types_1.ActionCodes.ADD_LIQUIDITY:
        case types_1.ActionCodes.REMOVE_LIQUIDITY:
        case types_1.ActionCodes.ROLL_LIQUIDITY:
            return `/poolposition/${(0, exports.getStrategyAddrFromReceipt)(receipt)}`;
        default:
            return '/';
    }
};
exports.getPositionPath = getPositionPath;
const getVaultIdFromReceipt = (receipt, contractMap) => {
    var _a, _b;
    if (!receipt)
        return '';
    const cauldronAddr = (_a = contractMap === null || contractMap === void 0 ? void 0 : contractMap.get('Cauldron')) === null || _a === void 0 ? void 0 : _a.address;
    const vaultIdHex = (_b = receipt.events.filter((e) => e.address === cauldronAddr)[0]) === null || _b === void 0 ? void 0 : _b.topics[1];
    return (vaultIdHex === null || vaultIdHex === void 0 ? void 0 : vaultIdHex.slice(0, 26)) || '';
};
exports.getVaultIdFromReceipt = getVaultIdFromReceipt;
const getSeriesAfterRollPosition = (receipt, seriesMap) => {
    var _a;
    if (!receipt)
        return '';
    const contractAddress = (_a = receipt.events[7]) === null || _a === void 0 ? void 0 : _a.address;
    const series = [...seriesMap.values()].filter((s) => s.address === contractAddress)[0];
    return (series === null || series === void 0 ? void 0 : series.id) || '';
};
exports.getSeriesAfterRollPosition = getSeriesAfterRollPosition;
const getStrategyAddrFromReceipt = (receipt) => {
    if (!receipt)
        return '';
    return receipt.events[0].address;
};
exports.getStrategyAddrFromReceipt = getStrategyAddrFromReceipt;
const formatStrategyName = (name) => {
    const name_ = name ? `${name.slice(15, 22)} Strategy` : '';
    return `${name_}`;
};
exports.formatStrategyName = formatStrategyName;
const getStrategySymbol = (name) => name.slice(2).slice(0, -2);
exports.getStrategySymbol = getStrategySymbol;
const ratioToPercent = (ratio, decimals = 2) => {
    const _multiplier = Math.pow(10, decimals);
    return Math.round((ratio * 100 + Number.EPSILON) * _multiplier) / _multiplier;
};
exports.ratioToPercent = ratioToPercent;
/**
 * TRUNCATE a string value to a certain number of 'decimal' points
 * @param input
 * @param decimals
 * @returns
 */
const truncateValue = (input, decimals) => {
    const re = new RegExp(`(\\d+\\.\\d{${decimals}})(\\d)`);
    if (input !== undefined && parseInt(input)) {
        const input_ = input[0] === '.' ? '0'.concat(input) : input;
        const inpu = input_ === null || input_ === void 0 ? void 0 : input_.match(re); // inpu = truncated 'input'... get it?
        if (inpu) {
            return inpu[1];
        }
        return input === null || input === void 0 ? void 0 : input.valueOf();
    }
    return '0.0';
};
exports.truncateValue = truncateValue;
/**
 * Convert a human readbale string input to a BN (respecting the token decimals )
 * @param input
 * @param decimals
 * @returns
 */
const inputToTokenValue = (input, tokenDecimals) => {
    if (input) {
        const _cleaned = (0, exports.truncateValue)(input, tokenDecimals);
        return ethers_1.ethers.utils.parseUnits(_cleaned, tokenDecimals);
    }
    return ethers_1.ethers.constants.Zero;
};
exports.inputToTokenValue = inputToTokenValue;
//# sourceMappingURL=yieldUtils.js.map