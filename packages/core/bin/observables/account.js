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
//# sourceMappingURL=account.js.map