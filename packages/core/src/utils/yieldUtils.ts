import { format, subDays } from "date-fns";
import { BigNumber, ethers } from "ethers";
import { Config, adjectives, animals, uniqueNamesGenerator } from "unique-names-generator";

// TODO: maybe remove type dependence in this file? 
import { ActionCodes, IAssetRoot, ISignData, W3Number} from "../types";

export const generateVaultName = (id: string) => {
  const vaultNameConfig: Config = {
    dictionaries: [adjectives, animals],
    separator: ' ',
    length: 2,
  };
  return uniqueNamesGenerator({ seed: parseInt(id.substring(14), 16), ...vaultNameConfig });
};

/* creates internal tracking code of a transaction type */ 
export const getProcessCode = (txType: ActionCodes, vaultOrSeriesId: string | null) => `${txType}_${vaultOrSeriesId}`;

/* get the assetPairId with input as either the base/ilk themselves OR an id-string */
export const getAssetPairId = (baseId:string, ilkId:string) => `${baseId}:${ilkId}` 

/* get the internal id of a signature */
export const getSignId = (signData: ISignData)  => `${signData.target.symbol}_${signData.spender}`

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

 export const getPositionPath = (processCode: string, receipt: any, contractMap?: any, seriesMap?: any) => {
    // console.log('🦄 ~ file: appUtils.ts ~ line 188 ~ getPositionPath ~ receipt', receipt);
    const action = processCode.split('_')[0];
    const positionId = processCode.split('_')[1];
    switch (action) {
      // BORROW
      case ActionCodes.BORROW:
      case ActionCodes.ADD_COLLATERAL:
      case ActionCodes.REMOVE_COLLATERAL:
      case ActionCodes.REPAY:
      case ActionCodes.ROLL_DEBT:
      case ActionCodes.TRANSFER_VAULT:
      case ActionCodes.MERGE_VAULT:
        return `/vaultposition/${getVaultIdFromReceipt(receipt, contractMap)}`;
      // LEND
      case ActionCodes.LEND:
      case ActionCodes.CLOSE_POSITION:
      case ActionCodes.REDEEM:
        return `/lendposition/${positionId}`;
      case ActionCodes.ROLL_POSITION:
        return `/lendposition/${getSeriesAfterRollPosition(receipt, seriesMap)}`;
      // POOL
      case ActionCodes.ADD_LIQUIDITY:
      case ActionCodes.REMOVE_LIQUIDITY:
      case ActionCodes.ROLL_LIQUIDITY:
        return `/poolposition/${getStrategyAddrFromReceipt(receipt)}`;
      default:
        return '/';
    }
  };
  
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
 * TRUNCATE a string value to a certain number of 'decimal' points 
 * @param input 
 * @param decimals 
 * @returns 
 */
export const truncateValue = (input: string | undefined, decimals: number) => {
  const re = new RegExp(`(\\d+\\.\\d{${decimals}})(\\d)`);
  if (input !== undefined && parseInt(input) ) {
    const input_ = input![0] === '.' ? '0'.concat(input!) : input;
    const inpu = input_?.match(re); // inpu = truncated 'input'... get it?
    if (inpu) {
      return inpu[1];
    }
    return input?.valueOf();
  }
  return '0.0';
};

/**
 * Convert a bignumber to a W3Number 
 * (which packages the bn together with a display value)
 * @param bigNumber 
 * @param tokenDecimals 
 * @param digitFormat 
 * @returns W3Number
 */
export const bnToW3Number = (bigNumber: BigNumber, tokenDecimals: number, digitFormat:number = 2): W3Number => {
  const bn = bigNumber;
  const hStr =  ethers.utils.formatUnits(bigNumber, tokenDecimals)
  const dsp = truncateValue(hStr, digitFormat )
  return { bn, hStr, dsp }
}

/**
 * Convert a human readbale string input to a BN (respecting the token decimals ) 
 * @param input 
 * @param decimals 
 * @returns 
 */
 export const inputToTokenValue = (input: string | undefined, tokenDecimals: number): BigNumber => {
   if (input) {
    const _cleaned = truncateValue(input, tokenDecimals!);
    return ethers.utils.parseUnits(_cleaned, tokenDecimals);
   } 
   return ethers.constants.Zero;
};
