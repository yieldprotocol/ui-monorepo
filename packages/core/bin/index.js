"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewFunctions = exports.viewObservables = exports.yieldConstants = exports.yieldFunctions = exports.yieldObservables = void 0;
const tslib_1 = require("tslib");
const rxjs_1 = require("rxjs");
const buildProtocol_1 = require("./initProtocol/buildProtocol");
const connection_1 = require("./observables/connection");
const assetMap_1 = require("./observables/assetMap");
const seriesMap_1 = require("./observables/seriesMap");
const yieldProtocol_1 = require("./observables/yieldProtocol");
const strategyMap_1 = require("./observables/strategyMap");
const vaultMap_1 = require("./observables/vaultMap");
const appConfig_1 = require("./observables/appConfig");
const connection_2 = require("./observables/connection");
const selected_1 = require("./observables/selected");
const constants = tslib_1.__importStar(require("./utils/constants"));
const assetConstants = tslib_1.__importStar(require("./config/assets"));
const observables_1 = require("./observables");
const input_1 = require("./viewObservables/input");
const messages_1 = require("./observables/messages");
const borrowView_1 = require("./viewObservables/borrowView");
const collateralView_1 = require("./viewObservables/collateralView");
/*
 * FIRST LOAD > Handle initial setup protocol with DEFAULTS on FIRST LOAD
 * */
appConfig_1.appConfig$
    .pipe(
/* if config file has a default provider and * other checks if required: */
// filter((conf: IYieldConfig) => conf.defaultProvider !== undefined),
/* only Once at the beginning if the above is true (ie. not on every config change): */
(0, rxjs_1.first)())
    .subscribe((config) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    // console.log(config.diagnostics);
    connection_2.provider$.next(config.defaultProvider);
}));
// .unsubscribe(); // maybe not needed becasue of first() operator?
/**
 * Observe provider$ changes  => Load/re-load protocol (TODO only if network id changes?)
 * */
connection_2.provider$
    .pipe((0, rxjs_1.withLatestFrom)(appConfig_1.appConfig$))
    .subscribe(([provider, config]) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    yieldProtocol_1.yieldProtocol$.next(yield (0, buildProtocol_1.buildProtocol)(provider, config.browserCaching));
}));
/* Expose the observables */
const yieldObservables = {
    yieldProtocolø: yieldProtocol_1.yieldProtocolø,
    seriesMapø: seriesMap_1.seriesMapø,
    assetMapø: assetMap_1.assetMapø,
    vaultMapø: vaultMap_1.vaultMapø,
    strategyMapø: strategyMap_1.strategyMapø,
    providerø: connection_2.providerø,
    accountø: connection_1.accountø,
    accountProviderø: connection_2.accountProviderø,
    selectedø: selected_1.selectedø,
    transactionMapø: observables_1.transactionMapø,
    assetPairMapø: observables_1.assetPairMapø,
    userSettingsø: observables_1.userSettingsø,
    messagesø: messages_1.messagesø,
};
exports.yieldObservables = yieldObservables;
const viewObservables = {
    // borrow section */
    borrowInputø: input_1.borrowInputø,
    collateralInputø: input_1.collateralInputø,
    isBorrowPossibleø: borrowView_1.isBorrowPossibleø,
    isRollVaultPossibleø: borrowView_1.isRollVaultPossibleø,
    maxDebtLimitø: borrowView_1.maxDebtLimitø,
    minDebtLimitø: borrowView_1.minDebtLimitø,
    maximumRepayø: borrowView_1.maximumRepayø,
    minimumRepayø: borrowView_1.minimumRepayø,
    // with collateral
    collateralizationPercentø: collateralView_1.collateralizationPercentø,
    collateralizationRatioø: collateralView_1.collateralizationRatioø,
};
exports.viewObservables = viewObservables;
const viewFunctions = {
    updateBorrowInput: input_1.updateBorrowInput,
    updateCollateralInput: input_1.updateCollateralInput,
    updateRepayInput: input_1.updateRepayInput,
    updateLendInput: input_1.updateLendInput,
    updateCloseInput: input_1.updateCloseInput,
    updateAddLiqInput: input_1.updateAddLiqInput,
    updateRemoveLiqInput: input_1.updateRemoveLiqInput,
};
exports.viewFunctions = viewFunctions;
/* Expose any required functions */
const yieldFunctions = {
    updateProvider: connection_2.updateProvider,
    updateYieldConfig: appConfig_1.updateYieldConfig,
    updateAccount: connection_1.updateAccount,
    /* selector functions */
    selectIlk: selected_1.selectIlk,
    selectBase: selected_1.selectBase,
    selectVault: selected_1.selectVault,
    selectSeries: selected_1.selectSeries,
    selectStrategy: selected_1.selectStrategy,
};
exports.yieldFunctions = yieldFunctions;
/* Expose constants that might be useful */
const yieldConstants = Object.assign(Object.assign({}, constants), assetConstants);
exports.yieldConstants = yieldConstants;
//# sourceMappingURL=index.js.map