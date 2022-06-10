"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAccount = exports.accountø = exports.account$ = void 0;
const rxjs_1 = require("rxjs");
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
// /** @internal */
// export const signer$: BehaviorSubject<string | undefined> = new BehaviorSubject(undefined as string | undefined); // TODO weird typing here ??
// export const signerø: Observable<string | undefined> = account$.pipe(share());
// // export const updateSigner = (newSigner?: string) => {
// //   signer$.next(newAccount || undefined);
// // };
// providerø.subscribe( (provider) => {
//   provider.addListener('asdasd', (e)=> console.log( e))
// });
//# sourceMappingURL=account.js.map