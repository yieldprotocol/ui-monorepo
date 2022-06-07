"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatValue = exports.numberWithCommas = exports.buildGradient = exports.invertColor = exports.contrastColor = exports.modColor = exports.nFormatter = exports.abbreviateHash = exports.truncateValue = exports.getSeason = exports.SeasonType = exports.logToConsole = exports.chunkArray = exports.getOrigin = exports.clearCachedItems = exports.setBrowserCachedValue = exports.getBrowserCachedValue = exports.copyToClipboard = void 0;
const date_fns_1 = require("date-fns");
const copyToClipboard = (str) => {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};
exports.copyToClipboard = copyToClipboard;
/**
 *
 * Caching fns
 *
 * */
const getBrowserCachedValue = (index) => (typeof window !== "undefined") && localStorage.getItem(index) !== null && JSON.parse(localStorage.getItem(index));
exports.getBrowserCachedValue = getBrowserCachedValue;
const setBrowserCachedValue = (index, valueToStore) => (typeof window !== "undefined") && localStorage.setItem(index, JSON.stringify(valueToStore));
exports.setBrowserCachedValue = setBrowserCachedValue;
const clearCachedItems = (keys) => {
    if (keys.length > 0) {
        keys.forEach((k) => {
            window.localStorage.removeItem(k);
        });
    }
    else
        window.localStorage.clear();
};
exports.clearCachedItems = clearCachedItems;
/**
 * Get the name of a function that calls this Fn. :)
 * @returns name of the function that called it
 */
const getOrigin = () => {
    console.log(exports.getOrigin.caller);
    // return getOrigin.caller
};
exports.getOrigin = getOrigin;
/**
 * Convert array to chunks of arrays with size n
 * @param a any array
 * @param size chunk size
 * @returns array of any[]
 */
const chunkArray = (a, size) => Array.from(new Array(Math.ceil(a.length / size)), (_, i) => a.slice(i * size, i * size + size));
exports.chunkArray = chunkArray;
/* log to console + any extra action required, extracted  */
const logToConsole = (message, type = 'info') => {
    // eslint-disable-next-line no-console
    console.log(type, message);
};
exports.logToConsole = logToConsole;
// TODO make it change based on hemisphere ( ie swap winter and summer)
var SeasonType;
(function (SeasonType) {
    SeasonType["WINTER"] = "WINTER";
    SeasonType["SPRING"] = "SPRING";
    SeasonType["SUMMER"] = "SUMMER";
    SeasonType["FALL"] = "FALL";
})(SeasonType = exports.SeasonType || (exports.SeasonType = {}));
const getSeason = (dateInSecs) => {
    const month = (0, date_fns_1.getMonth)(new Date(dateInSecs * 1000));
    const seasons = [
        SeasonType.WINTER,
        SeasonType.WINTER,
        SeasonType.SPRING,
        SeasonType.SPRING,
        SeasonType.SPRING,
        SeasonType.SUMMER,
        SeasonType.SUMMER,
        SeasonType.SUMMER,
        SeasonType.FALL,
        SeasonType.FALL,
        SeasonType.FALL,
        SeasonType.WINTER,
    ];
    return seasons[month];
};
exports.getSeason = getSeason;
/* Trunctate a string value to a certain number of 'decimal' point */
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
/**
 * Color functions
 * */
const modColor = (color, amount) => {
    let c;
    let cT;
    if (color.length === 9 || color.length === 8) {
        c = color.substring(0, color.length - 2);
        cT = color.slice(-2);
    }
    else {
        c = color;
        cT = 'FF';
    }
    // eslint-disable-next-line prefer-template
    return `#${c
        .replace(/^#/, '')
        .replace(/../g, (col) => `0${Math.min(255, Math.max(0, parseInt(col, 16) + amount)).toString(16)}`.substr(-2))}${cT}`;
};
exports.modColor = modColor;
const contrastColor = (hex) => {
    const hex_ = hex.slice(1);
    if (hex_.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    const r = parseInt(hex_.slice(0, 2), 16);
    const g = parseInt(hex_.slice(2, 4), 16);
    const b = parseInt(hex_.slice(4, 6), 16);
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? 'brand' : 'brand-light';
};
exports.contrastColor = contrastColor;
const invertColor = (hex) => {
    function padZero(str) {
        const zeros = new Array(2).join('0');
        return (zeros + str).slice(-2);
    }
    const hex_ = hex.slice(1);
    if (hex_.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    const r = (255 - parseInt(hex_.slice(0, 2), 16)).toString(16);
    const g = (255 - parseInt(hex_.slice(2, 4), 16)).toString(16);
    const b = (255 - parseInt(hex_.slice(4, 6), 16)).toString(16);
    // pad each with zeros and return
    return `#${padZero(r)}${padZero(g)}${padZero(b)}`;
};
exports.invertColor = invertColor;
const buildGradient = (colorFrom, colorTo) => `linear-gradient(to bottom right,
      ${(0, exports.modColor)(colorFrom || '#add8e6', -50)}, 
      ${(0, exports.modColor)(colorFrom || '#add8e6', 0)},
      ${(0, exports.modColor)(colorFrom || '#add8e6', 0)},
      ${(0, exports.modColor)(colorTo, 50)},
      ${(0, exports.modColor)(colorTo, 50)}, 
      ${(0, exports.modColor)(colorTo, 50)},
      ${(0, exports.modColor)(colorTo, 25)}, 
      ${(0, exports.modColor)(colorTo, 0)}, 
      ${(0, exports.modColor)(colorTo, 0)})
`;
exports.buildGradient = buildGradient;
const numberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
exports.numberWithCommas = numberWithCommas;
const formatValue = (x, decimals) => (0, exports.numberWithCommas)(Number((0, exports.truncateValue)(x === null || x === void 0 ? void 0 : x.toString(), decimals)));
exports.formatValue = formatValue;
//# sourceMappingURL=appUtils.js.map