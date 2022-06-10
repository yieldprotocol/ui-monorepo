"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAccount = exports.accountø = exports.account$ = exports.updateAccountProvider = exports.accountProviderø = exports.accountProvider$ = exports.updateProvider = exports.providerø = exports.provider$ = exports.updateChainId = exports.chainIdø = exports.chainId$ = void 0;
const tslib_1 = require("tslib");
const rxjs_1 = require("rxjs");
const defaultprovider_1 = require("../config/defaultprovider");
const utils_1 = require("../utils");
const appConfig_1 = require("./appConfig");
// const getDefaultChainId = async () : Promise<number> => {
//   /* if in a browser environment */
//   if (typeof window !== 'undefined') {
//     if ((window as any).ethereum) {
//       // first try from the injected provider
//       const injectedId = await (window as any).ethereum.request({ method: 'eth_chainId' });
//       return parseInt(injectedId, 16);
//     }
//     const fromCache = getBrowserCachedValue(`lastChainIdUsed`);
//     return fromCache; // second, from the last id used in the cache
//   }
//   /* in a non-browser environment */
//   return appConfig$.value.defaultChainId; // defaults to the defaultChainId in the settings
// };
/** @internal */
exports.chainId$ = new rxjs_1.BehaviorSubject(1);
exports.chainIdø = exports.chainId$.pipe((0, rxjs_1.share)());
const updateChainId = (chainId) => {
    /* Cache the last chain used browser-side  */
    (0, utils_1.setBrowserCachedValue)(`lastChainIdUsed`, chainId);
    // chainId$.next( chainId ); // no need here
    location.reload();
};
exports.updateChainId = updateChainId;
/**
 * FIRST LOAD > Handle initial setup protocol with DEFAULTS on FIRST LOAD
 */
//  (async () => {
//   /* if in a browser environment */
//   if (typeof window !== 'undefined') {
//     if ((window as any).ethereum) { // first try from the injected provider
//       const injectedId = await (window as any).ethereum.request({ method: 'eth_chainId' });
//       console.log('InjectedID', injectedId );
//       chainId$.next( parseInt(injectedId, 16) )
//     }
//     const fromCache = getBrowserCachedValue(`lastChainIdUsed`)
//     chainId$.next( fromCache ); // second, from the last id used in the cache
//   }
//   /* in a non-browser environment */
//   chainId$.next(appConfig$.value.defaultChainId); // defaults to the defaultChainId in the settings
// })()
/** @internal */
exports.provider$ = new rxjs_1.BehaviorSubject((0, defaultprovider_1.getDefaultProvider)(1));
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
exports.accountProviderø = exports.accountProvider$.pipe((0, rxjs_1.share)());
const updateAccountProvider = (newProvider) => {
    // TODO: wrap the EIP provider into a ethers.web3Provider if required.
    exports.accountProvider$.next(newProvider); // update to whole new protocol
};
exports.updateAccountProvider = updateAccountProvider;
/* handle any events on the accountProvider ( web3Provider ) */
exports.accountProviderø.subscribe((accProvider) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    console.log('NEW CHAIN ID', (yield accProvider.getNetwork()).chainId);
    /**
     * MetaMask requires requesting permission to connect users accounts >
     * however, we can attempt to skip this if the user already has a connected account
     * */
    try {
        appConfig_1.appConfig$.value.autoConnectAccountProvider &&
            exports.account$.next((yield accProvider.send('eth_requestAccounts', []))[0]);
    }
    catch (e) {
        console.log(e);
    }
    /**
     * Attach listeners for EIP1193 events
     * (Unless supressed, or not in a browser environment )
     * */
    if (typeof window !== 'undefined' && !appConfig_1.appConfig$.value.supressInjectedListeners) {
        window.ethereum.on('accountsChanged', (addr) => exports.account$.next(addr[0]));
        /* Reload the page on every network change as per reccommendation */
        window.ethereum.on('chainChanged', (id) => (0, exports.updateChainId)(parseInt(id, 16)));
        /* Connect/Disconnect listeners */
        window.ethereum.on('connect', () => console.log('connected'));
        window.ethereum.on('disconnect', () => console.log('disconnected'));
    }
}));
/** @internal */
exports.account$ = new rxjs_1.BehaviorSubject(undefined);
exports.accountø = exports.account$.pipe((0, rxjs_1.share)());
const updateAccount = (newAccount) => {
    exports.account$.next(newAccount || undefined);
};
exports.updateAccount = updateAccount;
//# sourceMappingURL=connection.js.map