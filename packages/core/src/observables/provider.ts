import { ethers } from "ethers";
import { Observable, BehaviorSubject, share } from "rxjs";
import defaultProvider from "../config/defaultprovider";

/** @internal */
export const provider$: BehaviorSubject<ethers.providers.BaseProvider> = new BehaviorSubject(defaultProvider);
// export const provider$: Subject<ethers.providers.BaseProvider> = new Subject();

export const providerø: Observable<ethers.providers.BaseProvider> = provider$.pipe(share());
export const updateProvider = (newProvider: ethers.providers.BaseProvider) => {
  provider$.next(newProvider); // update to whole new protocol
};
