"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewFunctions = exports.viewObservables = exports.yieldConstants = exports.yieldFunctions = exports.yieldObservables = void 0;
const tslib_1 = require("tslib");
const constants = tslib_1.__importStar(require("./utils/constants"));
const assetConstants = tslib_1.__importStar(require("./config/assets"));
// TODO: import all dynamically when things are up and running
// import * as yieldObservables from './observables';
const actions_1 = require("./actions");
const observables_1 = require("./observables");
const input_1 = require("./viewObservables/input");
const messages_1 = require("./observables/messages");
const borrowView_1 = require("./viewObservables/borrowView");
const collateralView_1 = require("./viewObservables/collateralView");
const rxjs_1 = require("rxjs");
const buildProtocol_1 = require("./initProtocol/buildProtocol");
const appConfig_1 = require("./observables/appConfig");
/**
 * On app start (or provider change ) (and on providerø, chainId$ or appConfig$ observed changes ),
 * appConfig gathers all the required information from env etc.
 * sets things up, and then the stream finishes indicating that everything is ready to go.
 */
(0, rxjs_1.combineLatest)([observables_1.providerø, appConfig_1.appConfigø, observables_1.chainIdø]).subscribe(([provider, config, chainId]) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    (0, observables_1.updateProtocol)(yield (0, buildProtocol_1.buildProtocol)(provider, chainId, config));
}));
/* Expose the observables */
const yieldObservables = {
    protocolø: observables_1.protocolø,
    seriesø: observables_1.seriesø,
    assetsø: observables_1.assetsø,
    vaultsø: observables_1.vaultsø,
    strategiesø: observables_1.strategiesø,
    providerø: observables_1.providerø,
    accountø: observables_1.accountø,
    accountProviderø: observables_1.accountProviderø,
    selectedø: observables_1.selectedø,
    transactionsø: observables_1.transactionsø,
    assetPairsø: observables_1.assetPairsø,
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
    /* actions */
    borrow: actions_1.borrow,
    repayDebt: actions_1.repayDebt,
    addLiquidity: actions_1.addLiquidity,
    updateProvider: observables_1.updateProvider,
    updateAppConfig: observables_1.updateAppConfig,
    updateAccount: observables_1.updateAccount,
    /* selector functions */
    selectIlk: observables_1.selectIlk,
    selectBase: observables_1.selectBase,
    selectVault: observables_1.selectVault,
    selectSeries: observables_1.selectSeries,
    selectStrategy: observables_1.selectStrategy,
};
exports.yieldFunctions = yieldFunctions;
/* Expose constants that might be useful */
const yieldConstants = Object.assign(Object.assign({}, constants), assetConstants);
exports.yieldConstants = yieldConstants;
//# sourceMappingURL=index.js.map