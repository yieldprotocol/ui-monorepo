"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleActions = exports.RoutedActions = exports.LadleActions = void 0;
var LadleActions;
(function (LadleActions) {
    let Fn;
    (function (Fn) {
        Fn["BUILD"] = "build";
        Fn["TWEAK"] = "tweak";
        Fn["GIVE"] = "give";
        Fn["DESTROY"] = "destroy";
        Fn["STIR"] = "stir";
        Fn["POUR"] = "pour";
        Fn["SERVE"] = "serve";
        Fn["ROLL"] = "roll";
        Fn["CLOSE"] = "close";
        Fn["REPAY"] = "repay";
        Fn["REPAY_VAULT"] = "repayVault";
        Fn["REPAY_LADLE"] = "repayLadle";
        Fn["REPAY_FROM_LADLE"] = "repayFromLadle";
        Fn["CLOSE_FROM_LADLE"] = "closeFromLadle";
        Fn["RETRIEVE"] = "retrieve";
        Fn["FORWARD_PERMIT"] = "forwardPermit";
        Fn["FORWARD_DAI_PERMIT"] = "forwardDaiPermit";
        Fn["JOIN_ETHER"] = "joinEther";
        Fn["EXIT_ETHER"] = "exitEther";
        Fn["TRANSFER"] = "transfer";
        Fn["ROUTE"] = "route";
        Fn["REDEEM"] = "redeem";
        Fn["MODULE"] = "moduleCall";
    })(Fn = LadleActions.Fn || (LadleActions.Fn = {}));
})(LadleActions = exports.LadleActions || (exports.LadleActions = {}));
var RoutedActions;
(function (RoutedActions) {
    let Fn;
    (function (Fn) {
        Fn["SELL_BASE"] = "sellBase";
        Fn["SELL_FYTOKEN"] = "sellFYToken";
        Fn["MINT_POOL_TOKENS"] = "mint";
        Fn["BURN_POOL_TOKENS"] = "burn";
        Fn["MINT_WITH_BASE"] = "mintWithBase";
        Fn["BURN_FOR_BASE"] = "burnForBase";
        Fn["MINT_STRATEGY_TOKENS"] = "mint";
        Fn["BURN_STRATEGY_TOKENS"] = "burn";
        Fn["WRAP"] = "wrap";
        Fn["UNWRAP"] = "unwrap";
        Fn["CHECKPOINT"] = "checkpoint";
    })(Fn = RoutedActions.Fn || (RoutedActions.Fn = {}));
})(RoutedActions = exports.RoutedActions || (exports.RoutedActions = {}));
var ModuleActions;
(function (ModuleActions) {
    let Fn;
    (function (Fn) {
        Fn["WRAP_ETHER"] = "wrap";
        Fn["ADD_CONVEX_VAULT"] = "addVault";
    })(Fn = ModuleActions.Fn || (ModuleActions.Fn = {}));
})(ModuleActions = exports.ModuleActions || (exports.ModuleActions = {}));
//# sourceMappingURL=operations.js.map