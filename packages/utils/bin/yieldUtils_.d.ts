import { BigNumber } from 'ethers';
export * from './constants_';
export interface W3bNumber {
    dsp: number;
    hStr: string;
    big: BigNumber;
}
export declare const generateVaultName: (id: string) => string;
export declare const getProcessCode: (txType: string, vaultOrSeriesId: string | null) => string;
export declare const getAssetPairId: (baseId: string, ilkId: string) => string;
export declare const getSignId: (signData: {
    target: {
        symbol: string;
    };
    spender: string;
}) => string;
/**
 * Calculate the baseId from the series nae
 * @param seriesId seriesID.
 * @returns string bytes32
 */
export declare function baseIdFromSeriesId(seriesId: string): string;
/**
 *
 * Generate the series name from the maturity number.
 * Examples: full (defualt) : 'MMMM yyyy' ,  apr badge  : 'MMM yy' , mobile: 'MMM yyyy'
 * NOTE: subtraction used to accuount for time zone differences
 * */
export declare const nameFromMaturity: (maturity: number, style?: string) => string;
export declare const vaultIdFromReceipt: (receipt: any, contractMap: any) => any;
export declare const newSeriesIdFromReceipt: (receipt: any, seriesMap: any) => any;
export declare const strategyAddrFromReceipt: (receipt: any) => any;
export declare const formatStrategyName: (name: string) => string;
export declare const getStrategySymbol: (name: string) => string;
export declare const ratioToPercent: (ratio: number, decimals?: number) => number;
/**
 * Convert a bignumber to a W3bNumber
 * (which packages the bn together with a display value)
 * @param value [ BigNumber|string ]
 * @param decimals [number] default 18
 * @param displayDecimals [number] default 6
 * @returns [W3bNumber]
 */
export declare const bnToW3bNumber: (value: BigNumber, decimals?: number, displayDecimals?: number) => W3bNumber;
/**
 *
 * Convert a human readbale string input to a BN (respecting the token decimals )
 * @param input
 * @param decimals
 * @returns
 */
export declare const inputToTokenValue: (input: string | undefined, decimals: number) => BigNumber;
