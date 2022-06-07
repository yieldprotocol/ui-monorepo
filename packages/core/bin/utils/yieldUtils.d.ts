import { BigNumber } from "ethers";
import { ActionCodes, ISignData } from "../types";
export declare const generateVaultName: (id: string) => string;
export declare const getProcessCode: (txType: ActionCodes, vaultOrSeriesId: string | null) => string;
export declare const getAssetPairId: (baseId: string, ilkId: string) => string;
export declare const getSignId: (signData: ISignData) => string;
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
export declare const getPositionPath: (processCode: string, receipt: any, contractMap?: any, seriesMap?: any) => string;
export declare const getVaultIdFromReceipt: (receipt: any, contractMap: any) => any;
export declare const getSeriesAfterRollPosition: (receipt: any, seriesMap: any) => any;
export declare const getStrategyAddrFromReceipt: (receipt: any) => any;
export declare const formatStrategyName: (name: string) => string;
export declare const getStrategySymbol: (name: string) => string;
export declare const ratioToPercent: (ratio: number, decimals?: number) => number;
/**
 * TRUNCATE a string value to a certain number of 'decimal' points
 * @param input
 * @param decimals
 * @returns
 */
export declare const truncateValue: (input: string | undefined, decimals: number) => string;
/**
 * Convert a human readbale string input to a BN (respecting the token decimals )
 * @param input
 * @param decimals
 * @returns
 */
export declare const inputToTokenValue: (input: string | undefined, tokenDecimals: number) => BigNumber;
