import { BehaviorSubject, Observable, share } from "rxjs";
import { providerø } from "./provider";

/** @internal */
export const account$: BehaviorSubject<string | undefined> = new BehaviorSubject(undefined as string | undefined); // TODO weird typing here ??

/**
 * The current user account address.
 * */
export const accountø: Observable<string | undefined> = account$.pipe(share());

/**
 * @param newAccount 
 */
export const updateAccount = (newAccount?: string) => {
  account$.next(newAccount || undefined);
};

providerø.subscribe( (provider) => {
  provider.addListener('asdasd', (e)=> console.log( e))
});