"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProvider = exports.providerø = exports.provider$ = void 0;
const tslib_1 = require("tslib");
const rxjs_1 = require("rxjs");
const defaultprovider_1 = tslib_1.__importDefault(require("../config/defaultprovider"));
/** @internal */
exports.provider$ = new rxjs_1.BehaviorSubject(defaultprovider_1.default);
// export const provider$: Subject<ethers.providers.BaseProvider> = new Subject();
exports.providerø = exports.provider$.pipe((0, rxjs_1.share)());
const updateProvider = (newProvider) => {
    exports.provider$.next(newProvider); // update to whole new protocol
};
exports.updateProvider = updateProvider;
exports.providerø
    .subscribe((provider) => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return console.log('NEW CHAIN ID', (yield provider.getNetwork()).chainId); }));
//# sourceMappingURL=provider.js.map