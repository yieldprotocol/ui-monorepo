"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lend = void 0;
const tslib_1 = require("tslib");
const ui_math_1 = require("@yield-protocol/ui-math");
const assets_1 = require("../config/assets");
const observables_1 = require("../observables");
const chainActions_1 = require("../chainActions");
const types_1 = require("../types");
const _addRemoveEth_1 = require("./_addRemoveEth");
const yieldUtils_1 = require("../utils/yieldUtils");
const lend = (amount, series) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    /* generate the reproducible processCode for tx tracking and tracing */
    const processCode = (0, yieldUtils_1.getProcessCode)(types_1.ActionCodes.LEND, series.id);
    console.log(processCode);
    /* Get the values from the observables/subjects */
    const ladleAddress = observables_1.yieldProtocol$.value.ladle.address;
    const assetMap = observables_1.assetMap$.value;
    const account = observables_1.account$.value;
    const { slippageTolerance } = observables_1.userSettings$.value;
    const base = assetMap.get(series.baseId);
    const _amount = (0, yieldUtils_1.inputToTokenValue)(amount, base === null || base === void 0 ? void 0 : base.decimals);
    const _inputAsFyToken = (0, ui_math_1.sellBase)(series.baseReserves, series.fyTokenReserves, _amount, series.getTimeTillMaturity(), series.ts, series.g1, series.decimals);
    const _inputAsFyTokenWithSlippage = (0, ui_math_1.calculateSlippage)(_inputAsFyToken, slippageTolerance.toString(), true);
    /* if approveMAx, check if signature is required */
    const alreadyApproved = (yield base.getAllowance(account, ladleAddress)).gte(_amount);
    /* ETH is used as a base */
    const isEthBase = assets_1.ETH_BASED_ASSETS.includes(series.baseId);
    const permitCallData = yield (0, chainActions_1.sign)([
        {
            target: base,
            spender: 'LADLE',
            amount: _amount,
            ignoreIf: alreadyApproved === true,
        },
    ], processCode);
    const addEthCallData = () => {
        if (isEthBase)
            return (0, _addRemoveEth_1.addEth)(_amount, series.poolAddress);
        return [];
    };
    const calls = [
        ...permitCallData,
        ...addEthCallData(),
        {
            operation: types_1.LadleActions.Fn.TRANSFER,
            args: [base.address, series.poolAddress, _amount],
            ignoreIf: isEthBase,
        },
        {
            operation: types_1.LadleActions.Fn.ROUTE,
            args: [account, _inputAsFyTokenWithSlippage],
            fnName: types_1.RoutedActions.Fn.SELL_BASE,
            targetContract: series.poolContract,
            ignoreIf: false,
        },
    ];
    // await transact(calls, processCode);
    // updateSeries([series]);
    // updateAssets([base]);
    // updateTradeHistory([series]);
});
exports.lend = lend;
//# sourceMappingURL=lend.js.map