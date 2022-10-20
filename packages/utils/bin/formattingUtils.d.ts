/**
 * TRUNCATE a string value to a certain number of 'decimal' points
 * @param input <string | undefined>
 * @param decimals <number>
 * @returns
 */
export declare const truncateValue: (input: string | undefined, decimals: number) => string;
export declare const abbreviateHash: (addr: string, buffer?: number) => string;
/**
 * Number formatting if reqd.
 * */
export declare const nFormatter: (num: number, digits: number) => string;
export declare const numberWithCommas: (x: number) => string;
export declare const formatValue: (x: string | number, decimals: number) => string;
