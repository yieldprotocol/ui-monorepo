var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsx as _jsx } from "react/jsx-runtime";
import React, { useEffect } from "react";
import { yieldObservables, yieldFunctions, yieldConstants, viewObservables, viewFunctions, } from "@yield-protocol/ui-core";
/* Build the context */
var YieldContext = React.createContext({});
/* useObservable hook */
export var useObservable = function (observable, showError) {
    if (showError === void 0) { showError = false; }
    var _a = React.useState(), value = _a[0], setValue = _a[1];
    var _b = React.useState(), error = _b[0], setError = _b[1];
    useEffect(function () {
        var subscription = observable.subscribe({
            next: setValue,
            error: function (e) {
                console.log(e), setError;
            },
        });
        return function () { return subscription.unsubscribe(); };
    }, [observable]);
    return showError ? [value, error] : value;
};
/* Build up the Provider state */
var YieldProvider = function (_a) {
    var props = _a.props, children = _a.children;
    var yieldProtocolø = yieldObservables.yieldProtocolø, assetMapø = yieldObservables.assetMapø, seriesMapø = yieldObservables.seriesMapø, strategyMapø = yieldObservables.strategyMapø, vaultMapø = yieldObservables.vaultMapø, accountø = yieldObservables.accountø, messagesø = yieldObservables.messagesø, transactionMapø = yieldObservables.transactionMapø, selectedø = yieldObservables.selectedø;
    var yieldProtocol = useObservable(yieldProtocolø);
    var assetMap = useObservable(assetMapø);
    var seriesMap = useObservable(seriesMapø);
    var strategyMap = useObservable(strategyMapø);
    var vaultMap = useObservable(vaultMapø);
    // const provider = useObservable(providerø) as unknown as string;
    // const accountProvider = useObservable(accountProviderø) as unknown as string;
    var account = useObservable(accountø);
    var messages = useObservable(messagesø);
    var selected = useObservable(selectedø);
    var transactions = useObservable(transactionMapø);
    return (_jsx(YieldContext.Provider, __assign({ value: {
            messages: messages,
            transactions: transactions,
            yieldProtocol: yieldProtocol,
            assetMap: assetMap,
            seriesMap: seriesMap,
            strategyMap: strategyMap,
            vaultMap: vaultMap,
            account: account,
            selected: selected,
            yieldFunctions: yieldFunctions,
            yieldConstants: yieldConstants,
            viewObservables: viewObservables,
            viewFunctions: viewFunctions,
        } }, { children: children })));
};
/* Returns the Context & Provider */
export { YieldContext, YieldProvider };
