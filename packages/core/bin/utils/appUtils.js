"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBrowserCachedValue = exports.getBrowserCachedValue = void 0;
const getBrowserCachedValue = (index) => typeof window !== 'undefined' && localStorage.getItem(index) !== null && JSON.parse(localStorage.getItem(index));
exports.getBrowserCachedValue = getBrowserCachedValue;
const setBrowserCachedValue = (index, valueToStore) => typeof window !== 'undefined' && localStorage.setItem(index, JSON.stringify(valueToStore));
exports.setBrowserCachedValue = setBrowserCachedValue;
//# sourceMappingURL=appUtils.js.map