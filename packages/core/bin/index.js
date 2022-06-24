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
const rxjs_1 = require("rxjs");
const buildProtocol_1 = require("./initProtocol/buildProtocol");
const appConfig_1 = require("./observables/appConfig");
const yieldObservables = tslib_1.__importStar(require("./observables"));
exports.yieldObservables = yieldObservables;
const viewObservables = tslib_1.__importStar(require("./viewObservables"));
exports.viewObservables = viewObservables;
/**
 * On app start (or provider change ) (and on providerø, chainId$ or appConfig$ observed changes ),
 * appConfig gathers all the required information from env etc.
 * sets things up, and then the stream finishes indicating that everything is ready to go.
 */
(0, rxjs_1.combineLatest)([observables_1.providerø, appConfig_1.appConfigø, observables_1.chainIdø]).subscribe(([provider, config, chainId]) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    (0, observables_1.updateProtocol)(yield (0, buildProtocol_1.buildProtocol)(provider, chainId, config));
}));
/* Expose the observables */
// const yieldObservables: IYieldObservables = {
//   protocolø,
//   seriesø,
//   assetsø,
//   vaultsø,
//   strategiesø,
//   providerø,
//   accountø,
//   accountProviderø,
//   selectedø,
//   transactionsø,
//   assetPairsø,
//   userSettingsø,
//   messagesø,
// };
// const viewObservables: any = {
//   // borrow section */
//   borrowInputø,
//   collateralInputø,
//   isBorrowPossibleø,
//   isRollVaultPossibleø,
//   maxDebtLimitø,
//   minDebtLimitø,
//   maximumRepayø,
//   minimumRepayø,
//   // with collateral
//   collateralizationPercentø,
//   collateralizationRatioø,
// };
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