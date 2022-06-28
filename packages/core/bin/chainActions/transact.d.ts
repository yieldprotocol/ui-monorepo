import { ICallData } from '../types';
export declare const transact: (calls: ICallData[], processCode: string, callback?: () => void) => Promise<void>;
