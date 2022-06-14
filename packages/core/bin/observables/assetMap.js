"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAssets = exports.assetMapø = exports.assetMap$ = void 0;
const tslib_1 = require("tslib");
const rxjs_1 = require("rxjs");
const ethers_1 = require("ethers");
const types_1 = require("../types");
const connection_1 = require("./connection");
const yieldProtocol_1 = require("./yieldProtocol");
const contracts = tslib_1.__importStar(require("../contracts"));
const assets_1 = require("../config/assets");
const constants_1 = require("../utils/constants");
const utils_1 = require("../utils");
const messages_1 = require("./messages");
/** @internal */
exports.assetMap$ = new rxjs_1.BehaviorSubject(new Map([]));
/**
 * Unsubscribed Assetmap observable
 */
exports.assetMapø = exports.assetMap$.pipe((0, rxjs_1.share)());
/**
 * Update Assets function
 * @param assetList  list of assets to update
 * @param account optional: account in use
 */
const updateAssets = (assetList, account) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    /* if passed an empty list, update ALL assets in the assetMap$ subject */
    const list = (assetList === null || assetList === void 0 ? void 0 : assetList.length) ? assetList : Array.from(exports.assetMap$.value.values());
    list.map((asset) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        // account && console.log('here we have the acccount',  account );
        // account && _addBalanceListeners(asset, account ); 
        const assetUpdate = yield _updateAsset(asset, account);
        exports.assetMap$.next(new Map(exports.assetMap$.value.set(asset.id, assetUpdate))); // note: new Map to enforce ref update
    }));
});
exports.updateAssets = updateAssets;
/**
 * Observe YieldProtocolø changes, and update map accordingly
 * 1. 'charge' asset list
 * 2. update asset list
 * */
(0, rxjs_1.combineLatest)([yieldProtocol_1.yieldProtocolø, connection_1.accountø])
    .pipe((0, rxjs_1.filter)(([protocol]) => protocol.assetRootMap.size > 0), (0, rxjs_1.withLatestFrom)(connection_1.providerø))
    .subscribe(([[_protocol, _account], _provider]) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    /* 'Charge' all the assets (using the current provider) */
    const chargedList = Array.from(_protocol.assetRootMap.values()).map((a) => _chargeAsset(a, _provider));
    /* Update the assets with dynamic/user data */
    yield (0, exports.updateAssets)(chargedList, _account);
    (0, messages_1.sendMsg)({ message: 'Strategies Loaded', type: messages_1.MessageType.INTERNAL });
}));
/**
 * Observe providerø changes, and update map accordingly ('charge assets/series' with live contracts & listeners )
 * 1. 'Charge asset' with latest provider info for each
 * 2. Set as new assetMap$
 * */
connection_1.providerø
    .pipe((0, rxjs_1.withLatestFrom)(exports.assetMap$), 
/* only proceed if a valid provider and map has elements */
(0, rxjs_1.filter)(([prov, aMap]) => ethers_1.ethers.providers.BaseProvider.isProvider(prov) && aMap.size > 0))
    .subscribe(([provider, assetMap]) => {
    assetMap.forEach((v, k, m) => {
        m.set(k, _chargeAsset(v, provider));
    });
    exports.assetMap$.next(assetMap);
});
// /**
//  * Observe Account$ changes ('update dynamic/User Data')
//  * */
// accountø
//   // .pipe(filter( (acc) => acc !== undefined ) )
//   .subscribe((account) => {
//     console.log('account changed:', account)
//     updateAssets([], account);
//   });
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
const _updateAsset = (asset, account) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    /* Setup users asset info  */
    const balance = asset.name !== 'UNKNOWN' && account ? yield asset.getBalance(account) : constants_1.ZERO_BN;
    return Object.assign(Object.assign({}, asset), { balance, balance_: (0, utils_1.truncateValue)(ethers_1.ethers.utils.formatUnits(balance, asset.decimals), 2) });
});
const _addBalanceListeners = (asset, address) => {
    console.log('here we should be adding listeners for :', asset.symbol, ':', address);
    // const {assetContract} = asset;
    // !address && assetContract.removeAllListeners();
    // address && assetContract.on("Transfer", (from, to, value, event) => {
    //   console.log("WOOHA : balance change!!");
    //   console.log({
    //       from: from,
    //       to: to,
    //       value: value.toNumber(),
    //       data: event
    //   });
    // };
    // address && assetContract.on("Transfer", async (from ) => {
    //   if (from === address){
    //     console.log("WOOHA : balance change!!") 
    //       const bal_ = await assetContract.balanceOf(address);
    //       // handle new balance    
    //   }
    // });
};
//# sourceMappingURL=assetMap.js.map