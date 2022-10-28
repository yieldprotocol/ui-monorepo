"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCachedItems = exports.setBrowserCachedValue = exports.getBrowserCachedValue = exports.copyToClipboard = void 0;
/**
 * Copy string to clipboard
 * @param string string to copy
 */
const copyToClipboard = (string) => {
    const el = document.createElement('textarea');
    el.value = string;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};
exports.copyToClipboard = copyToClipboard;
/**
 * Broswer Caching Functions (used)
 * */
const getBrowserCachedValue = (index) => typeof window !== 'undefined' && localStorage.getItem(index) !== null && JSON.parse(localStorage.getItem(index));
exports.getBrowserCachedValue = getBrowserCachedValue;
const setBrowserCachedValue = (index, valueToStore) => typeof window !== 'undefined' && localStorage.setItem(index, JSON.stringify(valueToStore));
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
//# sourceMappingURL=browserUtils.js.map