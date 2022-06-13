"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAccountProvider = exports.accountProviderø = exports.accountProvider$ = exports.updateAccount = exports.accountø = exports.account$ = exports.updateProvider = exports.providerø = exports.provider$ = exports.updateChainId = exports.chainIdø = exports.chainId$ = exports.chainId = void 0;
const tslib_1 = require("tslib");
const ethers_1 = require("ethers");
const rxjs_1 = require("rxjs");
const defaultprovider_1 = require("../config/defaultprovider");
const utils_1 = require("../utils");
const appConfig_1 = require("./appConfig");
/**
 * FIRST LOAD > Handle initial setup protocol with DEFAULTS on FIRST LOAD
 */
exports.chainId = (() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    /* if in a browser environment */
    if (typeof window !== 'undefined') {
        if (window.ethereum) { // first try from the injected provider
            const injectedId = yield window.ethereum.request({ method: 'eth_chainId' });
            console.log('Injected chainId:', injectedId);
            return parseInt(injectedId, 16);
        }
        const fromCache = (0, utils_1.getBrowserCachedValue)(`lastChainIdUsed`);
        console.log('ChainId from cache:', fromCache);
        return fromCache; // second, from the last id used in the cache
    }
    /* in a non-browser environment : return 1 */
    // console.log('ChainId from default:', appConfig$.value.defaultChainId);
    return 1; // defaults to the defaultChainId in the settings
}))();
// /** @internal */
exports.chainId$ = new rxjs_1.Subject();
exports.chainIdø = exports.chainId$.pipe((0, rxjs_1.shareReplay)());
/* When the chainId changes, we refresh the browser */
const updateChainId = (chainId) => {
    /* Cache the last chain used browser-side  */
    (0, utils_1.setBrowserCachedValue)(`lastChainIdUsed`, chainId);
    location.reload();
};
exports.updateChainId = updateChainId;
/** @internal */
exports.provider$ = new rxjs_1.Subject();
exports.providerø = exports.provider$.pipe((0, rxjs_1.shareReplay)());
const updateProvider = (newProvider) => {
    exports.provider$.next(newProvider); // update to whole new protocol
};
exports.updateProvider = updateProvider;
/** @internal */
exports.account$ = new rxjs_1.BehaviorSubject(undefined);
exports.accountø = exports.account$.pipe((0, rxjs_1.share)());
const updateAccount = (newAccount) => {
    /* Check if account is a vaild address before assigning */
    const isValidAcc = ethers_1.ethers.utils.isAddress(newAccount);
    exports.account$.next(isValidAcc ? newAccount : undefined);
};
exports.updateAccount = updateAccount;
/**
 * The accountProvider is the sign provider (web3Provider) that handles the user account, signing and transacting.
 * It also adds a number of listeners to monitor account changes etc.
 **/
/** @internal */
exports.accountProvider$ = new rxjs_1.BehaviorSubject(defaultprovider_1.defaultAccountProvider);
exports.accountProviderø = exports.accountProvider$.pipe((0, rxjs_1.shareReplay)());
const updateAccountProvider = (newProvider) => {
    // TODO: wrap the EIP provider into a ethers.web3Provider if required.
    exports.accountProvider$.next(newProvider); // update to whole new protocol
};
exports.updateAccountProvider = updateAccountProvider;
/* handle any events on the accountProvider ( web3Provider ) */
exports.accountProviderø
    .pipe((0, rxjs_1.withLatestFrom)(appConfig_1.appConfigø))
    .subscribe(([accProvider, appConfig]) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    /**
     * MetaMask requires requesting permission to connect users accounts >
     * however, we can attempt to skip this if the user already has a connected account
     * */
    try {
        appConfig.autoConnectAccountProvider &&
            exports.account$.next((yield accProvider.send('eth_requestAccounts', []))[0]);
    }
    catch (e) {
        console.log(e);
    }
    /**
     * Attach listeners for EIP1193 events
     * (Unless supressed, or not in a browser environment )
     * */
    if (typeof window !== 'undefined' && !appConfig.supressInjectedListeners) {
        window.ethereum.on('accountsChanged', (addr) => exports.account$.next(addr[0]));
        /* Reload the page on every network change as per reccommendation */
        window.ethereum.on('chainChanged', (id) => (0, exports.updateChainId)(parseInt(id, 16)));
        /* Connect/Disconnect listeners */
        window.ethereum.on('connect', () => console.log('connected'));
        window.ethereum.on('disconnect', () => console.log('disconnected'));
    }
}));
//# sourceMappingURL=connection.js.map