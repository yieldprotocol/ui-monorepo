import { ethers } from "ethers";
import { Observable, BehaviorSubject } from "rxjs";
/** @internal */
export declare const provider$: BehaviorSubject<ethers.providers.BaseProvider>;
export declare const providerø: Observable<ethers.providers.BaseProvider>;
export declare const updateProvider: (newProvider: ethers.providers.BaseProvider) => void;
