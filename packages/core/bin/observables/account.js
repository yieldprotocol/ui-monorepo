"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signerø = exports.signer$ = exports.updateAccount = exports.accountø = exports.account$ = void 0;
const rxjs_1 = require("rxjs");
const provider_1 = require("./provider");
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
provider_1.providerø.subscribe((provider) => {
    provider.addListener('asdasd', (e) => console.log(e));
});
/** @internal */
exports.signer$ = new rxjs_1.BehaviorSubject(undefined); // TODO weird typing here ??
exports.signerø = exports.account$.pipe((0, rxjs_1.share)());
// export const updateSigner = (newSigner?: string) => {
//   signer$.next(newAccount || undefined);
// };
provider_1.providerø.subscribe((provider) => {
    provider.addListener('asdasd', (e) => console.log(e));
});
//# sourceMappingURL=account.js.map