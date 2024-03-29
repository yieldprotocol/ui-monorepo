"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAccountProvider = exports.accountProviderø = exports.updateAccount = exports.accountø = exports.updateProvider = exports.providerø = exports.updateChainId = exports.chainIdø = void 0;
const tslib_1 = require("tslib");
const ethers_1 = require("ethers");
const rxjs_1 = require("rxjs");
const config_1 = require("../config");
const appUtils_1 = require("../utils/appUtils");
const appConfig_1 = require("./appConfig");
const messages_1 = require("./messages");
/** @internal */
exports.chainIdø = appConfig_1.appConfigø.pipe((0, rxjs_1.mergeMap)((config) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    /* if in a browser environment */
    if (typeof window !== 'undefined') {
        if (window.ethereum) {
            // first try from the injected provider
            const injectedId = yield window.ethereum.request({ method: 'eth_chainId' });
            console.log('Injected chainId:', injectedId);
            return parseInt(injectedId, 16);
        }
        const fromCache = (0, appUtils_1.getBrowserCachedValue)(`lastChainIdUsed`);
        console.log('ChainId from cache:', fromCache);
        return fromCache; // second, from the last id used in the cache
    }
    /* in a non-browser environment : return the chainId set in the default */
    console.log('ChainId from default:', config.defaultChainId);
    return config.defaultChainId; // defaults to the defaultChainId in the settings
    // console.log( config)
    // return chainId
})), (0, rxjs_1.shareReplay)(1));
/**
 * When the chainId changes, we cache the previous value, and then refresh the browser
 * */
const updateChainId = (chainId) => {
    /* Cache the last chain used browser-side  */
    (0, appUtils_1.setBrowserCachedValue)(`lastChainIdUsed`, chainId);
    location.reload();
};
exports.updateChainId = updateChainId;
const provider$ = new rxjs_1.Subject();
exports.providerø = provider$.pipe((0, rxjs_1.shareReplay)(1));
const updateProvider = (newProvider) => {
    provider$.next(newProvider); // update to whole new protocol
};
exports.updateProvider = updateProvider;
/**
 * Update the provider on start ( when there is a chainId and appConfig)
 * */
(0, rxjs_1.combineLatest)([exports.chainIdø, appConfig_1.appConfigø])
    // .pipe(take(1)) // once on start
    .subscribe(([chainId, appConfig]) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a;
    /* Set the provider ( forked or not ) */
    if (appConfig.useFork && appConfig.defaultForkMap.has(chainId)) {
        const forkProvider = appConfig.defaultForkMap.get(chainId)();
        /* Set account provider, and account provider as the fork */
        const account = (yield forkProvider.listAccounts())[0];
        provider$.next(forkProvider);
        account$.next(account);
        accountProvider$.next(forkProvider);
        (0, messages_1.sendMsg)({
            message: `Using forked Environment. (block ${(_a = (yield forkProvider.getBlockNumber())) === null || _a === void 0 ? void 0 : _a.toString()})`,
            timeoutOverride: Infinity,
            id: 'FORKED_ENV',
        });
    }
    else if (appConfig.defaultProviderMap.has(chainId)) {
        provider$.next(appConfig.defaultProviderMap.get(chainId)());
    }
    else {
        (0, messages_1.sendMsg)({ message: 'NETWORK NOT SUPPORTED', type: messages_1.MessageType.WARNING, timeoutOverride: Infinity });
    }
}));
const account$ = new rxjs_1.BehaviorSubject(undefined);
exports.accountø = account$.pipe((0, rxjs_1.shareReplay)(1));
const updateAccount = (newAccount) => {
    /* Check if account is a vaild address before assigning */
    const isValidAcc = ethers_1.ethers.utils.isAddress(newAccount);
    account$.next(isValidAcc ? newAccount : undefined);
};
exports.updateAccount = updateAccount;
/**
 * The accountProvider is the sign provider (web3Provider) that handles the user account, signing and transacting.
 * It also adds a number of listeners to monitor account changes etc.
 **/
const accountProvider$ = new rxjs_1.BehaviorSubject(config_1.defaultAccountProvider);
exports.accountProviderø = accountProvider$.pipe((0, rxjs_1.shareReplay)(1));
const updateAccountProvider = (newProvider) => {
    // TODO: wrap the EIP provider into a ethers.web3Provider if required.
    accountProvider$.next(newProvider); // update to whole new protocol
};
exports.updateAccountProvider = updateAccountProvider;
/**
 * Handle any events on the accountProvider ( web3Provider )
 * */
(0, rxjs_1.combineLatest)([exports.accountProviderø, appConfig_1.appConfigø]).subscribe(([accProvider, appConfig]) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    /**
     * MetaMask requires requesting permission to connect users accounts >
     * however, we can attempt to skip this if the user already has a connected account
     * */
    try {
        appConfig.autoConnectAccountProvider &&
            !appConfig.useFork &&
            account$.next((yield accProvider.send('eth_requestAccounts', []))[0]);
    }
    catch (e) {
        console.log(e);
    }
    // function connect() {
    //   ethereum
    //     .request({ method: 'eth_requestAccounts' })
    //     .then(handleAccountsChanged)
    //     .catch((err) => {
    //       if (err.code === 4001) {
    //         // EIP-1193 userRejectedRequest error
    //         // If this happens, the user rejected the connection request.
    //         console.log('Please connect to MetaMask.');
    //       } else {
    //         console.error(err);
    //       }
    //     });
    // }
    /**
     * Attach listeners for EIP1193 events
     * (Unless supressed, or not in a browser environment )
     * */
    if (typeof window !== 'undefined' && !appConfig.supressInjectedListeners) {
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
                // MetaMask is locked or the user has not connected any accounts
                console.log('Please connect to MetaMask.');
            }
            else if (accounts[0] !== account$.value) {
                account$.next(accounts[0]);
            }
        });
        /* Reload the page on every network change as per reccommendation */
        window.ethereum.on('chainChanged', (id) => (0, exports.updateChainId)(parseInt(id, 16)));
        /* Connect/Disconnect listeners */
        window.ethereum.on('connect', () => console.log('connected'));
        window.ethereum.on('disconnect', () => console.log('disconnected'));
    }
    /**
     * if using the accountProvider as the base provider
     * TODO: untested
     * */
    if (appConfig.useAccountProviderAsProvider)
        (0, exports.updateProvider)(accProvider);
}));
//# sourceMappingURL=connection.js.map