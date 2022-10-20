"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputToTokenValue = exports.bnToW3bNumber = exports.ratioToPercent = exports.getStrategySymbol = exports.formatStrategyName = exports.strategyAddrFromReceipt = exports.newSeriesIdFromReceipt = exports.vaultIdFromReceipt = exports.dateFromMaturity = exports.nameFromMaturity = exports.baseIdFromSeriesId = exports.getSignId = exports.getAssetPairId = exports.getProcessCode = exports.generateVaultName = void 0;
const tslib_1 = require("tslib");
const date_fns_1 = require("date-fns");
const ethers_1 = require("ethers");
const unique_names_generator_1 = require("unique-names-generator");
tslib_1.__exportStar(require("./constants"), exports);
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
const dateFromMaturity = (maturity, style) => {
    return {
        date: new Date(maturity * 1000),
        display: (0, date_fns_1.format)(new Date(maturity * 1000), style || 'dd MMM yyyy'),
        mobile: `${(0, exports.nameFromMaturity)(maturity, style || 'MMM yyyy')}`,
    };
};
exports.dateFromMaturity = dateFromMaturity;
const vaultIdFromReceipt = (receipt, contractMap) => {
    var _a, _b;
    if (!receipt)
        return '';
    const cauldronAddr = (_a = contractMap === null || contractMap === void 0 ? void 0 : contractMap.get('Cauldron')) === null || _a === void 0 ? void 0 : _a.address;
    const vaultIdHex = (_b = receipt.events.filter((e) => e.address === cauldronAddr)[0]) === null || _b === void 0 ? void 0 : _b.topics[1];
    return (vaultIdHex === null || vaultIdHex === void 0 ? void 0 : vaultIdHex.slice(0, 26)) || '';
};
exports.vaultIdFromReceipt = vaultIdFromReceipt;
const newSeriesIdFromReceipt = (receipt, seriesMap) => {
    var _a;
    if (!receipt)
        return '';
    const contractAddress = (_a = receipt.events[7]) === null || _a === void 0 ? void 0 : _a.address;
    const series = [...seriesMap.values()].filter((s) => s.address === contractAddress)[0];
    return (series === null || series === void 0 ? void 0 : series.id) || '';
};
exports.newSeriesIdFromReceipt = newSeriesIdFromReceipt;
const strategyAddrFromReceipt = (receipt) => {
    if (!receipt)
        return '';
    return receipt.events[0].address;
};
exports.strategyAddrFromReceipt = strategyAddrFromReceipt;
const formatStrategyName = (name) => {
    const name_ = name ? `${name.slice(15, 22)} Strategy` : '';
    return `${name_}`;
};
exports.formatStrategyName = formatStrategyName;
const getStrategySymbol = (name) => name.slice(2).slice(0, -2);
exports.getStrategySymbol = getStrategySymbol;
/* convert a ratio value to a percentage with a certain decimal precision */
const ratioToPercent = (ratio, decimals = 2) => {
    const _multiplier = Math.pow(10, decimals);
    return Math.round((ratio * 100 + Number.EPSILON) * _multiplier) / _multiplier;
};
exports.ratioToPercent = ratioToPercent;
/**
 * TRUNCATE a string value to a certain number of 'decimal' points
 * @param input <string | undefined>
 * @param decimals <number>
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
/**
 * Convert a bignumber to a W3bNumber
 * (which packages the bn together with a display value)
 * @param value [ BigNumber|string ]
 * @param decimals [number] default 18
 * @param displayDecimals [number] default 6
 * @returns [W3bNumber]
 */
const bnToW3bNumber = (value, decimals = 18, displayDecimals = 6) => {
    const input_hstr = ethers_1.ethers.utils.formatUnits(value, decimals); // hStr wil be the same as dsp because it is what the user is entereing.
    const input_dsp = displayDecimals
        ? Number(Math.round(Number(parseFloat(input_hstr) + 'e' + displayDecimals.toString())) +
            'e-' +
            displayDecimals.toString())
        : parseFloat(input_hstr);
    return {
        dsp: input_dsp,
        hStr: input_hstr,
        big: value,
    };
};
exports.bnToW3bNumber = bnToW3bNumber;
/**
 *
 * Convert a human readbale string input to a BN (respecting the token decimals )
 * @param input
 * @param decimals
 * @returns
 */
const inputToTokenValue = (input, decimals) => {
    if (input) {
        const _cleaned = truncateValue(input, decimals);
        return ethers_1.ethers.utils.parseUnits(_cleaned, decimals);
    }
    return ethers_1.ethers.constants.Zero;
};
exports.inputToTokenValue = inputToTokenValue;
//# sourceMappingURL=yieldUtils.js.map