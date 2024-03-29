"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rollDebt = void 0;
const tslib_1 = require("tslib");
const rxjs_1 = require("rxjs");
const chainActions_1 = require("../chainActions");
const observables_1 = require("../observables");
const types_1 = require("../types");
const utils_1 = require("../utils");
const rollDebt = (vault, toSeries) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    /* Subscribe to and get the values from the observables:  */
    observables_1.assetsø
        .pipe((0, rxjs_1.take)(1)) // only take one and then finish.
        .subscribe((assetMap) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const txCode = (0, utils_1.getProcessCode)(types_1.ActionCodes.ROLL_DEBT, vault.id);
        const base = assetMap.get(vault.baseId);
        const hasDebt = vault.accruedArt.big.gt(utils_1.ZERO_BN);
        const calls = [
            {
                // ladle.rollAction(vaultId: string, newSeriesId: string, max: BigNumberish)
                operation: types_1.LadleActions.Fn.ROLL,
                args: [vault.id, toSeries.id, '2', utils_1.MAX_128],
                ignoreIf: !hasDebt,
            },
            {
                // case where rolling vault with ZERO debt
                operation: types_1.LadleActions.Fn.TWEAK,
                args: [vault.id, toSeries.id, vault.ilkId],
                ignoreIf: hasDebt,
            },
        ];
        (0, chainActions_1.transact)(calls, txCode);
    }));
});
exports.rollDebt = rollDebt;
//# sourceMappingURL=rollDebt.js.map