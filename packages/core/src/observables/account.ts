import { BehaviorSubject, Observable, share } from 'rxjs';

/** @internal */
export const account$ = new BehaviorSubject<string | undefined>(undefined);

/**
 * The current user account address.
 *
 */
export const accountø = account$.pipe(share());

/**
 * @param newAccount
 */
export const updateAccount = (newAccount?: string) => {
  account$.next(newAccount);
};
