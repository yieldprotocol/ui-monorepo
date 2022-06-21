import { IVault } from '../types';
export declare const borrow: (amount?: string, collateralAmount?: string, vault?: IVault | string, getValuesFromNetwork?: boolean) => Promise<void>;
