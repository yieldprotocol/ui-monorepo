"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chunkArray = exports.getOrigin = void 0;
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
//# sourceMappingURL=generalUtils.js.map