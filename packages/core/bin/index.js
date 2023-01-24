"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yieldConfig = exports.viewFunctions = exports.viewObservables = exports.yieldConstants = exports.yieldFunctions = exports.yieldObservables = exports.initProtocol = void 0;
const tslib_1 = require("tslib");
const constants = tslib_1.__importStar(require("./utils/constants"));
const assetConstants = tslib_1.__importStar(require("./config/assetsConfig"));
// TODO: import all dynamically when things are up and running
// import * as yieldObservables from './observables';
const actions_1 = require("./actions");
const observables_1 = require("./observables");
const input_1 = require("./viewObservables/input");
const rxjs_1 = require("rxjs");
const buildProtocol_1 = require("./buildProtocol");
const yieldObservables = tslib_1.__importStar(require("./observables"));
exports.yieldObservables = yieldObservables;
const viewObservables = tslib_1.__importStar(require("./viewObservables"));
exports.viewObservables = viewObservables;
const assets_1 = tslib_1.__importDefault(require("./config/new/assets"));
const series_1 = tslib_1.__importDefault(require("./config/new/series"));
const oracles_1 = tslib_1.__importDefault(require("./config/new/oracles"));
const strategies_1 = tslib_1.__importDefault(require("./config/new/strategies"));
/**
 * On app start (and on providerø, chainId$ or appConfig$ observed changes ),
 * appConfig gathers all the required information from env etc.
 * sets things up, and then the stream finishes indicating that everything is ready to go.
 */
const initProtocol = (0, rxjs_1.combineLatest)([yieldObservables.providerø, yieldObservables.appConfigø, yieldObservables.chainIdø]).subscribe(([provider, config, chainId]) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    console.log(provider);
    (0, observables_1.updateProtocol)(yield (0, buildProtocol_1.buildProtocol)(provider, chainId, config));
}));
exports.initProtocol = initProtocol;
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
    updateConfig: observables_1.updateConfig,
    updateAccount: observables_1.updateAccount,
    /* selector functions */
    selectIlk: observables_1.selectIlk,
    selectBase: observables_1.selectBase,
    selectVault: observables_1.selectVault,
    selectSeries: observables_1.selectSeries,
    selectStrategy: observables_1.selectStrategy,
};
exports.yieldFunctions = yieldFunctions;
const yieldConfig = {
    series: series_1.default,
    assets: assets_1.default,
    strategies: strategies_1.default,
    oracles: oracles_1.default,
};
exports.yieldConfig = yieldConfig;
/* Expose constants that might be useful */
const yieldConstants = Object.assign(Object.assign({}, constants), assetConstants);
exports.yieldConstants = yieldConstants;
//# sourceMappingURL=index.js.map