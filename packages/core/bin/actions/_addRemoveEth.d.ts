import { BigNumber } from 'ethers';
import { ICallData } from '../types';
/**
 * @internal
 * */
export declare const addEth: (value: BigNumber, to?: string | undefined, alternateEthAssetId?: string | undefined) => ICallData[];
/**
 * @internal
 * @comment EXIT_ETHER sweeps all out of the ladle, so *value* is not important > it must just be bigger than zero to not be ignored
 * */
export declare const removeEth: (value: BigNumber, to?: string | undefined) => ICallData[];
