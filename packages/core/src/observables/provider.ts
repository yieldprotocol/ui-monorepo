import { ethers } from 'ethers';
import { Observable, BehaviorSubject, share } from 'rxjs';
import defaultProvider from '../config/defaultprovider';

/** @internal */
export const provider$ = new BehaviorSubject<ethers.providers.BaseProvider>(defaultProvider);
// export const provider$: Subject<ethers.providers.BaseProvider> = new Subject();

export const providerø = provider$.pipe<ethers.providers.BaseProvider>(share());
export const updateProvider = (newProvider: ethers.providers.BaseProvider) => {
  provider$.next(newProvider); // update to whole new protocol
};
