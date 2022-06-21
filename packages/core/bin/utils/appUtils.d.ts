export declare const copyToClipboard: (str: string) => void;
/**
 *
 * Caching fns
 *
 * */
export declare const getBrowserCachedValue: (index: string) => any;
export declare const setBrowserCachedValue: (index: string, valueToStore: any) => false | void;
export declare const clearCachedItems: (keys: string[]) => void;
/**
 * Get the name of a function that calls this Fn. :)
 * @returns name of the function that called it
 */
export declare const getOrigin: () => void;
/**
 * Convert array to chunks of arrays with size n
 * @param a any array
 * @param size chunk size
 * @returns array of any[]
 */
export declare const chunkArray: (a: any[], size: number) => any[][];
export declare const logToConsole: (message: string, type?: string) => void;
export declare enum SeasonType {
    WINTER = "WINTER",
    SPRING = "SPRING",
    SUMMER = "SUMMER",
    FALL = "FALL"
}
export declare const getSeason: (dateInSecs: number) => SeasonType;
export declare const truncateValue: (input: string | undefined, decimals: number) => string;
export declare const abbreviateHash: (addr: string, buffer?: number) => string;
/**
 * Number formatting if reqd.
 * */
export declare const nFormatter: (num: number, digits: number) => string;
/**
 * Color functions
 * */
export declare const modColor: (color: any, amount: any) => string;
export declare const contrastColor: (hex: any) => "brand" | "brand-light";
export declare const invertColor: (hex: any) => string;
export declare const buildGradient: (colorFrom: string, colorTo: string) => string;
export declare const numberWithCommas: (x: number) => string;
export declare const formatValue: (x: string | number, decimals: number) => string;
