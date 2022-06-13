import { IStrategy, AddLiquidityType, IVault } from '../types';
export declare const addLiquidity: (amount: string, strategy: IStrategy, method?: AddLiquidityType, matchingVault?: IVault | undefined) => Promise<void>;
