"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAssets = exports.assetsø = void 0;
const tslib_1 = require("tslib");
const rxjs_1 = require("rxjs");
const types_1 = require("../types");
const connection_1 = require("./connection");
const protocol_1 = require("./protocol");
const contracts = tslib_1.__importStar(require("../contracts"));
const assets_1 = require("../config/assets");
const constants_1 = require("../utils/constants");
const messages_1 = require("./messages");
const yieldUtils_1 = require("../utils/yieldUtils");
const assetMap$ = new rxjs_1.BehaviorSubject(new Map([]));
/**
 * Unsubscribed Assetmap observable
 */
exports.assetsø = assetMap$.pipe((0, rxjs_1.shareReplay)(1));
/**
 * Update Assets function
 * @param assetList  list of assets to update
 * @param account optional: account in use
 */
const updateAssets = (assetList, account) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    /* if passed an empty list, update ALL assets in the assetMap$ subject */
    const list = (assetList === null || assetList === void 0 ? void 0 : assetList.length) ? assetList : Array.from(assetMap$.value.values());
    yield Promise.all(list.map((asset) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const assetUpdate = account ? yield _updateAccountInfo(asset, account) : asset;
        assetMap$.next(new Map(assetMap$.value.set(asset.id, assetUpdate))); // note: new Map to enforce ref update
    })));
});
exports.updateAssets = updateAssets;
/**
 * Observe protocolø changes, and update map accordingly
 * 1. 'charge' asset list
 * 2. update asset list
 * */
protocol_1.protocolø
    .pipe((0, rxjs_1.filter)((protocol) => protocol.assetRootMap.size > 0), (0, rxjs_1.withLatestFrom)(connection_1.providerø, connection_1.accountø))
    .subscribe(([_protocol, _provider, _account]) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    /* 'Charge' all the assets (using the current provider) */
    const chargedList = Array.from(_protocol.assetRootMap.values()).map((a) => _chargeAsset(a, _provider));
    /* Update the assets with dynamic/user data */
    yield (0, exports.updateAssets)(chargedList, _account);
    console.log('Asset loading complete.');
    (0, messages_1.sendMsg)({ message: 'Assets Loaded.', type: messages_1.MessageType.INTERNAL, id: 'assetsLoaded' });
}));
/**
 * Observe Accountø changes ('update dynamic/User Data')
 * */
connection_1.accountø.pipe((0, rxjs_1.withLatestFrom)(exports.assetsø)).subscribe(([account, assetMap]) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (account && assetMap.size) {
        yield (0, exports.updateAssets)(Array.from(assetMap.values()), account);
        console.log('Assets updated with new account balances');
        (0, messages_1.sendMsg)({ message: 'Asset account balances updated.', type: messages_1.MessageType.INTERNAL, origin: 'assetMap' });
    }
    ;
}));
/* Add on extra/calculated ASSET info, contract instances and methods (note: no async ) + add listners */
const _chargeAsset = (asset, provider) => {
    /* add any asset listeners required */
    var _a, _b;
    /* attach either contract, (or contract of the wrappedToken ) */
    let assetContract;
    let getBalance;
    let getAllowance;
    // TODO: possibly refactor this?
    switch (asset.tokenType) {
        case types_1.TokenType.ERC20_:
            assetContract = contracts.ERC20__factory.connect(asset.address, provider);
            getBalance = (acc) => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return assets_1.ETH_BASED_ASSETS.includes(asset.proxyId) ? provider === null || provider === void 0 ? void 0 : provider.getBalance(acc) : assetContract.balanceOf(acc); });
            getAllowance = (acc, spender) => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return assetContract.allowance(acc, spender); });
            break;
        case types_1.TokenType.ERC1155_:
            assetContract = contracts.ERC1155__factory.connect(asset.address, provider);
            getBalance = (acc) => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return assetContract.balanceOf(acc, asset.tokenIdentifier); });
            getAllowance = (acc, spender) => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return assetContract.isApprovedForAll(acc, spender); });
            // setAllowance = async (spender: string) => {
            //   console.log(spender);
            //   console.log(asset.address);
            //   assetContract.setApprovalForAll(spender, true);
            // };
            break;
        default:
            // Default is a ERC20Permit;
            assetContract = contracts.ERC20Permit__factory.connect(asset.address, provider);
            getBalance = (acc) => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return assets_1.ETH_BASED_ASSETS.includes(asset.id) ? provider === null || provider === void 0 ? void 0 : provider.getBalance(acc) : assetContract.balanceOf(acc); });
            getAllowance = (acc, spender) => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return assetContract.allowance(acc, spender); });
            break;
    }
    return Object.assign(Object.assign({}, asset), { 
        /* Attach the asset contract */
        assetContract, 
        /* re-add in the wrap handler addresses when charging, because cache doesn't preserve map */
        wrapHandlerAddresses: (_a = assets_1.ASSETS.get(asset.id)) === null || _a === void 0 ? void 0 : _a.wrapHandlerAddresses, unwrapHandlerAddresses: (_b = assets_1.ASSETS.get(asset.id)) === null || _b === void 0 ? void 0 : _b.unwrapHandlerAddresses, 
        /* attach the various functions required */
        getBalance,
        getAllowance });
};
const _updateAccountInfo = (asset, account) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    /* Setup users asset info  */
    const balance_ = asset.name !== 'UNKNOWN' && account ? yield asset.getBalance(account) : constants_1.ZERO_BN;
    return Object.assign(Object.assign({}, asset), { balance: (0, yieldUtils_1.bnToW3Number)(balance_, asset.decimals, 2) // asset.digitFormat ) 
     });
});
//# sourceMappingURL=assets.js.map