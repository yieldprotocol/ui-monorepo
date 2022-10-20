import { format, subDays } from "date-fns";
import { BigNumber, ethers } from "ethers";
import { Config, adjectives, animals, uniqueNamesGenerator } from "unique-names-generator";
import { truncateValue } from "./appUtils";

export * from './constants';

export interface W3bNumber {
  dsp: number;
  hStr: string;
  big: BigNumber;
}

export const generateVaultName = (id: string) => {
  const vaultNameConfig: Config = {
    dictionaries: [adjectives, animals],
    separator: ' ',
    length: 2,
  };
  return uniqueNamesGenerator({ seed: parseInt(id.substring(14), 16), ...vaultNameConfig });
};

/* creates internal tracking code of a transaction type */ 
export const getProcessCode = (txType: string, vaultOrSeriesId: string | null) => `${txType}_${vaultOrSeriesId}`;

/* get the assetPairId with input as either the base/ilk themselves OR an id-string */
export const getAssetPairId = (baseId:string, ilkId:string) => `${baseId}:${ilkId}` 

/* get the internal id of a signature */
export const getSignId = (signData: {target: {symbol:string}, spender:string })  => `${signData.target.symbol}_${signData.spender}`

/**
 * Calculate the baseId from the series nae
 * @param seriesId seriesID.
 * @returns string bytes32
 */
 export function baseIdFromSeriesId(seriesId: string): string {
  return seriesId.slice(0, 6).concat('00000000');
}

/**
 *
 * Generate the series name from the maturity number.
 * Examples: full (defualt) : 'MMMM yyyy' ,  apr badge  : 'MMM yy' , mobile: 'MMM yyyy'
 * NOTE: subtraction used to accuount for time zone differences
 * */
 export const nameFromMaturity = (maturity: number, style: string = 'MMMM yyyy') =>
 format(subDays(new Date(maturity * 1000), 2), style);
  
  export const getVaultIdFromReceipt = (receipt: any, contractMap: any) => {
    if (!receipt) return '';
    const cauldronAddr = contractMap?.get('Cauldron')?.address!;
    const vaultIdHex = receipt.events.filter((e: any) => e.address === cauldronAddr)[0]?.topics[1]!;
    return vaultIdHex?.slice(0, 26) || '';
  };
  
  export const getSeriesAfterRollPosition = (receipt: any, seriesMap: any) => {
    if (!receipt) return '';
    const contractAddress = receipt.events[7]?.address!;
    const series = [...seriesMap.values()].filter((s) => s.address === contractAddress)[0];
    return series?.id! || '';
  };
  
  export const getStrategyAddrFromReceipt = (receipt: any) => {
    if (!receipt) return '';
    return receipt.events[0].address;
  };
  
  export const formatStrategyName = (name: string) => {
    const name_ = name ? `${name.slice(15, 22)} Strategy` : '';
    return `${name_}`;
  };
  
  export const getStrategySymbol = (name: string) => name.slice(2).slice(0, -2);

  export const ratioToPercent = (ratio:number, decimals:number=2): number => { 
    const _multiplier = Math.pow(10,decimals);
    return Math.round((ratio*100 + Number.EPSILON) * _multiplier) / _multiplier;
  }


/**
 * Convert a bignumber to a W3bNumber 
 * (which packages the bn together with a display value)
 * @param value BigNumber|string  
 * @param decimals number
 * @param displayDecimals number
 * @returns W3bNumber
 */
export const bnToW3bNumber = (value: BigNumber, decimals: number = 18, displayDecimals: number = 6): W3bNumber => {
  const input_hstr = ethers.utils.formatUnits(value, decimals); // hStr wil be the same as dsp because it is what the user is entereing.
  const input_dsp = displayDecimals
    ? Number(
        Math.round(Number(parseFloat(input_hstr) + 'e' + displayDecimals.toString())) +
          'e-' +
          displayDecimals.toString()
      )
    : parseFloat(input_hstr);
  return {
    dsp: input_dsp,
    hStr: input_hstr,
    big:value,
  };
};
// export const bnToW3bNumber = (bigNumber: BigNumber, tokenDecimals: number, digitFormat:number = 2): W3bNumber => {
//   const big = bigNumber;
//   const hStr =  ethers.utils.formatUnits(bigNumber, tokenDecimals)
//   const dsp = truncateValue(hStr, digitFormat )
//   return { big, hStr, dsp }
// }

/**
 * Convert a human readbale string input to a BN (respecting the token decimals ) 
 * @param input 
 * @param decimals 
 * @returns 
 */
 export const inputToTokenValue = (input: string | undefined, decimals: number): BigNumber => {
   if (input) {
    const _cleaned = truncateValue(input, decimals!);
    return ethers.utils.parseUnits(_cleaned, decimals);
   } 
   return ethers.constants.Zero;
};
