"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatValue = exports.numberWithCommas = exports.nFormatter = exports.abbreviateHash = exports.truncateValue = void 0;
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
exports.truncateValue = truncateValue;
/* handle Address/hash shortening */
const abbreviateHash = (addr, buffer = 4) => `${addr === null || addr === void 0 ? void 0 : addr.substring(0, buffer)}...${addr === null || addr === void 0 ? void 0 : addr.substring(addr.length - buffer)}`;
exports.abbreviateHash = abbreviateHash;
/**
 * Number formatting if reqd.
 * */
const nFormatter = (num, digits) => {
    const si = [
        { value: 1, symbol: '' },
        { value: 1e3, symbol: 'k' },
        { value: 1e6, symbol: 'M' },
        { value: 1e9, symbol: 'G' },
        { value: 1e12, symbol: 'T' },
        { value: 1e15, symbol: 'P' },
        { value: 1e18, symbol: 'E' },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
};
exports.nFormatter = nFormatter;
const numberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
exports.numberWithCommas = numberWithCommas;
const formatValue = (x, decimals) => (0, exports.numberWithCommas)(Number((0, exports.truncateValue)(x === null || x === void 0 ? void 0 : x.toString(), decimals)));
exports.formatValue = formatValue;
//# sourceMappingURL=formattingUtils.js.map