import { BehaviorSubject, Observable } from "rxjs";
/** @internal */
export declare const account$: BehaviorSubject<string | undefined>;
/**
 * The current user account address.
 * */
export declare const accountø: Observable<string | undefined>;
/**
 * @param newAccount
 */
export declare const updateAccount: (newAccount?: string) => void;
/** @internal */
export declare const signer$: BehaviorSubject<string | undefined>;
export declare const signerø: Observable<string | undefined>;
