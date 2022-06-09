"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAccount = exports.accountø = exports.account$ = exports.updateAccountProvider = exports.accountProviderø = exports.accountProvider$ = exports.updateProvider = exports.providerø = exports.provider$ = void 0;
const tslib_1 = require("tslib");
const rxjs_1 = require("rxjs");
const defaultprovider_1 = require("../config/defaultprovider");
/** @internal */
exports.provider$ = new rxjs_1.BehaviorSubject(defaultprovider_1.defaultProvider);
// export const provider$: Subject<ethers.providers.BaseProvider> = new Subject();
exports.providerø = exports.provider$.pipe((0, rxjs_1.share)());
const updateProvider = (newProvider) => {
    exports.provider$.next(newProvider); // update to whole new protocol
};
exports.updateProvider = updateProvider;
// providerø.subscribe(async (provider) => console.log('NEW CHAIN ID', (await provider.getNetwork()).chainId));
/**
 * The accountProvider is the sign provider (web3Provider) that handles the user account, signing and transacting.
 * It also adds a number of listeners to monitor account changes etc.
 **/
/** @internal */
exports.accountProvider$ = new rxjs_1.BehaviorSubject(defaultprovider_1.defaultAccountProvider);
// export const provider$: Subject<ethers.providers.BaseProvider> = new Subject();
exports.accountProviderø = exports.accountProvider$.pipe((0, rxjs_1.share)());
const updateAccountProvider = (newProvider) => {
    // TODO: wrap the EIP provider into a ethers.web3Provider if required.
    exports.accountProvider$.next(newProvider); // update to whole new protocol
};
exports.updateAccountProvider = updateAccountProvider;
/* handle any events on the accountProvider ( web3Provider ) */
exports.accountProviderø.subscribe((accProvider) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    console.log('NEW CHAIN ID', (yield accProvider.getNetwork()).chainId);
    // console.log('NEW ADDRESSS', await accProvider.getSigner().getAddress() );
    //  account$.next(await accProvider.getSigner().getAddress());
}));
/** @internal */
exports.account$ = new rxjs_1.BehaviorSubject(undefined); // TODO weird typing here ??
/**
 * The current user account address.
 * */
exports.accountø = exports.account$.pipe((0, rxjs_1.share)());
/**
 * @param newAccount
 */
const updateAccount = (newAccount) => {
    exports.account$.next(newAccount || undefined);
};
exports.updateAccount = updateAccount;
//# sourceMappingURL=connected.js.map