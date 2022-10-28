"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCollateral = void 0;
const tslib_1 = require("tslib");
const ethers_1 = require("ethers");
const rxjs_1 = require("rxjs");
const chainActions_1 = require("../chainActions");
const assetsConfig_1 = require("../config/assetsConfig");
const observables_1 = require("../observables");
const messages_1 = require("../observables/messages");
const types_1 = require("../types");
const operations_1 = require("../types/operations");
const utils_1 = require("../utils");
const yieldUtils_1 = require("../utils/yieldUtils");
const _addRemoveEth_1 = require("./_addRemoveEth");
const _wrapUnwrapAsset_1 = require("./_wrapUnwrapAsset");
const addCollateral = (amount, vault) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    /* Subscribe to and get the values from the observables:  */
    (0, rxjs_1.combineLatest)([observables_1.protocolø, observables_1.assetsø, observables_1.vaultsø, observables_1.accountø, observables_1.selectedø])
        .pipe((0, rxjs_1.take)(1)) // only take one and then finish.
        .subscribe(([{ ladle, moduleMap }, assetMap, vaultMap, account, selected,]) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a;
        /* Get the values from the observables/subjects */
        const ladleAddress = ladle.address;
        /** Use the vault/vaultId provided else use blank vault TODO: Add a check for existing vault */
        const getValidatedVault = (v) => {
            if (v) {
                if (v.id)
                    return v;
                if (vaultMap.has(v))
                    return vaultMap.get(v);
                (0, messages_1.sendMsg)({
                    message: 'Vault ID provided, but not recognised.',
                    type: messages_1.MessageType.WARNING,
                    origin: 'Borrow()',
                });
                throw new Error('Vault ID provided, but was not recognised.');
            }
            (0, messages_1.sendMsg)({
                message: 'No Vault ID provided. Creating a new Vault...',
                type: messages_1.MessageType.INFO,
                origin: 'Borrow()',
            });
            return undefined;
        };
        const _vault = getValidatedVault(vault);
        const vaultId = _vault ? _vault.id : utils_1.BLANK_VAULT;
        /* Set the ilk based on if a vault has been selected or it's a new vault */
        const ilk = _vault ? assetMap.get(_vault.ilkId) : selected.ilk;
        /* generate the reproducible txCode for tx tracking and tracing */
        const txCode = (0, utils_1.getProcessCode)(types_1.ActionCodes.ADD_COLLATERAL, vaultId);
        /* parse inputs to BigNumber in Wei */
        const _amount = (0, yieldUtils_1.inputToTokenValue)(amount, ilk.decimals);
        /* check if the ilk/asset is an eth asset variety, if so pour to Ladle */
        const isEthCollateral = assetsConfig_1.ETH_BASED_ASSETS.includes(ilk === null || ilk === void 0 ? void 0 : ilk.proxyId);
        /* is convex-type collateral */
        const isConvexCollateral = assetsConfig_1.CONVEX_BASED_ASSETS.includes(ilk === null || ilk === void 0 ? void 0 : ilk.proxyId);
        const ConvexLadleModuleContract = moduleMap.get('ConvexLadleModule');
        /* if approveMAx, check if signature is required : note: getAllowance may return FALSE if ERC1155 */
        const _allowance = yield (ilk === null || ilk === void 0 ? void 0 : ilk.getAllowance(account, ilk.joinAddress));
        const alreadyApproved = ethers_1.ethers.BigNumber.isBigNumber(_allowance) ? _allowance.gte(_amount) : _allowance;
        /* Handle wrapping of tokens:  */
        const wrapAssetCallData = yield (0, _wrapUnwrapAsset_1.wrapAsset)(_amount, ilk, txCode);
        /* Gather all the required signatures - sign() processes them and returns them as ICallData types */
        const permitCallData = yield (0, chainActions_1.sign)([
            {
                target: ilk,
                spender: ilk === null || ilk === void 0 ? void 0 : ilk.joinAddress,
                amount: _amount,
                /* ignore if: 1) collateral is ETH 2) approved already 3) wrapAssets call is > 0 (because the permit is handled with wrapping) */
                ignoreIf: isEthCollateral || alreadyApproved === true || wrapAssetCallData.length > 0,
            },
        ], txCode);
        /* Handle adding eth if required (ie. if the ilk is ETH_BASED). If not, else simply sent ZERO to the addEth fn */
        const addEthCallData = yield (0, _addRemoveEth_1.addEth)(assetsConfig_1.ETH_BASED_ASSETS.includes(ilk === null || ilk === void 0 ? void 0 : ilk.proxyId) ? _amount : utils_1.ZERO_BN, undefined, ilk === null || ilk === void 0 ? void 0 : ilk.proxyId);
        /* pour destination based on ilk/asset is an eth asset variety */
        const pourToAddress = () => {
            if (isEthCollateral)
                return ladleAddress;
            return account;
        };
        /**
         * BUILD CALL DATA ARRAY
         * */
        const calls = [
            /* If vault is null, build a new vault, else ignore */
            {
                operation: types_1.LadleActions.Fn.BUILD,
                args: [(_a = selected.series) === null || _a === void 0 ? void 0 : _a.id, ilk === null || ilk === void 0 ? void 0 : ilk.proxyId, '0'],
                ignoreIf: !!vault, // ignore if vault exists
            },
            /* If convex-type collateral, add vault using convex ladle module */
            {
                operation: types_1.LadleActions.Fn.MODULE,
                fnName: operations_1.ModuleActions.Fn.ADD_CONVEX_VAULT,
                args: [ilk === null || ilk === void 0 ? void 0 : ilk.joinAddress, vaultId],
                targetContract: ConvexLadleModuleContract,
                ignoreIf: !!vault || !isConvexCollateral,
            },
            /* handle wrapped token deposit, if required */
            ...wrapAssetCallData,
            /* add in add ETH calls */
            ...addEthCallData,
            /* handle permits if required */
            ...permitCallData,
            {
                operation: types_1.LadleActions.Fn.POUR,
                args: [vaultId, pourToAddress(), _amount, ethers_1.ethers.constants.Zero],
                ignoreIf: false, // never ignore
            },
        ];
        /* TRANSACT */
        (0, chainActions_1.transact)(calls, txCode);
    }));
});
exports.addCollateral = addCollateral;
//# sourceMappingURL=addCollateral.js.map