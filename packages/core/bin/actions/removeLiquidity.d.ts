import { ISeries, IVault } from '../types';
export declare const removeLiquidity: (amount: string, series: ISeries, matchingVault: IVault | undefined, tradeFyToken?: boolean) => Promise<void>;
