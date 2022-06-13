import { BigNumber } from 'ethers';
import { IAsset, ICallData } from '../types';
/**
 * @internal
 * */
export declare const wrapAsset: (value: BigNumber, asset: IAsset, processCode: string, chainId: number, to?: string | undefined) => Promise<ICallData[]>;
/**
 * @internal
 * */
export declare const unwrapAsset: (asset: IAsset, receiver: string, chainId: number) => Promise<ICallData[]>;
