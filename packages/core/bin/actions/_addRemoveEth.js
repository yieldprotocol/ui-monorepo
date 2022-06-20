"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeEth = exports.addEth = void 0;
const tslib_1 = require("tslib");
const rxjs_1 = require("rxjs");
const observables_1 = require("../observables");
const types_1 = require("../types");
const operations_1 = require("../types/operations");
const constants_1 = require("../utils/constants");
/**
 * @internal
 * */
const addEth = (value, to = undefined, alternateEthAssetId = undefined) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { moduleMap } = yield (0, rxjs_1.lastValueFrom)(observables_1.yieldProtocolø.pipe((0, rxjs_1.first)()));
    const WrapEtherModuleContract = moduleMap.get('WrapEtherModule');
    const account = yield (0, rxjs_1.lastValueFrom)(observables_1.accountø.pipe((0, rxjs_1.first)()));
    /* if there is a destination 'to' then use the ladle module (wrapEtherModule) */
    if (to)
        return [
            {
                operation: types_1.LadleActions.Fn.MODULE,
                fnName: operations_1.ModuleActions.Fn.WRAP_ETHER,
                args: [to || account, value],
                targetContract: WrapEtherModuleContract,
                ignoreIf: value.lte(constants_1.ZERO_BN),
                overrides: { value },
            },
        ];
    /* else use simple JOIN_ETHER  with optional */
    return [
        {
            operation: types_1.LadleActions.Fn.JOIN_ETHER,
            args: [alternateEthAssetId || '0x303000000000'],
            ignoreIf: value.lte(constants_1.ZERO_BN),
            overrides: { value },
        },
    ];
});
exports.addEth = addEth;
//
/**
 * @internal
 * @comment EXIT_ETHER sweeps all out of the ladle, so *value* is not important > it must just be bigger than zero to not be ignored
 * */
const removeEth = (value, to = undefined) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const account = yield (0, rxjs_1.lastValueFrom)(observables_1.accountø.pipe((0, rxjs_1.first)()));
    return [
        {
            operation: types_1.LadleActions.Fn.EXIT_ETHER,
            args: [to || account],
            ignoreIf: value.eq(constants_1.ZERO_BN), // ignores if value is ZERO. NB NOTE: sign (+-) is irrelevant here
        },
    ];
});
exports.removeEth = removeEth;
//# sourceMappingURL=_addRemoveEth.js.map