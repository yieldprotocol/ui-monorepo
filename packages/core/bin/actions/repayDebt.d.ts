import { IVault } from '../types';
/**
 * REPAY FN
 * @param vault
 * @param amount
 * @param reclaimCollateral
 */
export declare const repayDebt: (amount: string | undefined, vault: IVault, reclaimCollateral: boolean) => Promise<void>;
