"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unwrapAsset = exports.wrapAsset = void 0;
const tslib_1 = require("tslib");
const ethers_1 = require("ethers");
const rxjs_1 = require("rxjs");
const observables_1 = require("../observables");
const types_1 = require("../types");
const constants_1 = require("../utils/constants");
const wrapHandlerAbi = ['function wrap(address to)', 'function unwrap(address to)'];
/**
 * @internal
 * */
const wrapAsset = (value, asset, to // optional send destination : DEFAULT is assetJoin address
) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const account = yield (0, rxjs_1.lastValueFrom)(observables_1.accountø.pipe((0, rxjs_1.first)()));
    const chainId = yield (0, rxjs_1.lastValueFrom)(observables_1.chainIdø.pipe((0, rxjs_1.first)()));
    const accountProvider = yield (0, rxjs_1.lastValueFrom)(observables_1.accountProviderø.pipe((0, rxjs_1.first)())); //  await lastValueFrom(accountProviderø);
    // /* Get the signer from the accountProvider */
    const signer = accountProvider.getSigner(account);
    /* SET the destination address DEFAULTs to the assetJoin Address */
    const toAddress = to || asset.joinAddress;
    const wrapHandlerAddress = ((_a = asset.wrapHandlerAddresses) === null || _a === void 0 ? void 0 : _a.has(chainId))
        ? asset.wrapHandlerAddresses.get(chainId)
        : undefined;
    /* NB! IF a wraphandler exists, we assume that it is Yield uses the wrapped version of the token */
    if (wrapHandlerAddress && value.gt(constants_1.ZERO_BN)) {
        const wrapHandlerContract = new ethers_1.Contract(wrapHandlerAddress, wrapHandlerAbi, signer);
        const { assetContract } = asset; // NOTE: -> this is NOT the proxyID
        console.log('Asset Contract to be signed for wrapping: ', assetContract.id);
        /* Gather all the required signatures - sign() processes them and returns them as ICallData types */
        // const permitCallData: ICallData[] = await sign(
        //   [
        //     {
        //       target: asset, // full target contract
        //       spender: ladleAddress,
        //       amount: value,
        //       ignoreIf: false,
        //     },
        //   ],
        //   processCode
        // );
        return [
            // ...permitCallData,
            {
                operation: types_1.LadleActions.Fn.TRANSFER,
                args: [asset.address, wrapHandlerAddress, value],
                ignoreIf: false,
            },
            {
                operation: types_1.LadleActions.Fn.ROUTE,
                args: [toAddress],
                fnName: types_1.RoutedActions.Fn.WRAP,
                targetContract: wrapHandlerContract,
                ignoreIf: false,
            },
        ];
    }
    /* else if not a wrapped asset, (or value is 0) simply return empty array */
    return [];
});
exports.wrapAsset = wrapAsset;
/**
 * @internal
 * */
const unwrapAsset = (asset, receiver) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userSettings = yield (0, rxjs_1.lastValueFrom)(observables_1.userSettingsø.pipe((0, rxjs_1.first)()));
    const chainId = yield (0, rxjs_1.lastValueFrom)(observables_1.chainIdø.pipe((0, rxjs_1.first)()));
    const { unwrapTokens } = userSettings;
    const unwrapHandlerAddress = ((_b = asset.unwrapHandlerAddresses) === null || _b === void 0 ? void 0 : _b.has(chainId))
        ? asset.unwrapHandlerAddresses.get(chainId)
        : undefined;
    /* if there is an unwrap handler we assume the token needs to be unwrapped  ( unless the 'unwrapTokens' setting is false) */
    if (unwrapTokens && unwrapHandlerAddress) {
        console.log('Unwrapping tokens before return');
        const unwraphandlerContract = new ethers_1.Contract(unwrapHandlerAddress, wrapHandlerAbi); // TODO: signer
        return [
            {
                operation: types_1.LadleActions.Fn.ROUTE,
                args: [receiver],
                fnName: types_1.RoutedActions.Fn.UNWRAP,
                targetContract: unwraphandlerContract,
                ignoreIf: false,
            },
        ];
    }
    /* Else return empty array */
    console.log('NOT unwrapping tokens before return');
    return [];
});
exports.unwrapAsset = unwrapAsset;
//# sourceMappingURL=_wrapUnwrapAsset.js.map