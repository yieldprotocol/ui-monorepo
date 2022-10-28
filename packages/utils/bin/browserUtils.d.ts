/**
 * Copy string to clipboard
 * @param string string to copy
 */
export declare const copyToClipboard: (string: string) => void;
/**
 * Broswer Caching Functions (used)
 * */
export declare const getBrowserCachedValue: (index: string) => any;
export declare const setBrowserCachedValue: (index: string, valueToStore: any) => false | void;
export declare const clearCachedItems: (keys: string[]) => void;
