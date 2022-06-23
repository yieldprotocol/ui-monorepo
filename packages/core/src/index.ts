import * as constants from './utils/constants';
import * as assetConstants from './config/assets';

// TODO: import all dynamically when things are up and running
// import * as yieldObservables from './observables';

import { addLiquidity, borrow, repayDebt } from './actions';

import {
  transactionsø,
  assetPairsø,
  userSettingsø,
  accountProviderø,
  accountø,
  assetsø,
  chainIdø,
  providerø,
  selectBase,
  selectedø,
  selectIlk,
  selectSeries,
  selectStrategy,
  selectVault,
  seriesø,
  strategiesø,
  updateAccount,
  updateProvider,
  updateAppConfig,
  updateProtocol,
  vaultsø,
  protocolø,
} from './observables';
import {
  borrowInputø,
  collateralInputø,
  updateBorrowInput,
  updateCollateralInput,
  updateLendInput,
  updateCloseInput,
  updateAddLiqInput,
  updateRemoveLiqInput,
  updateRepayInput,
} from './viewObservables/input';
import { internalMessagesø, messagesø } from './observables/messages';
import {
  isBorrowPossibleø,
  isRollVaultPossibleø,
  maxDebtLimitø,
  maximumRepayø,
  minDebtLimitø,
  minimumRepayø,
} from './viewObservables/borrowView';
import { collateralizationPercentø, collateralizationRatioø } from './viewObservables/collateralView';
import { combineLatest } from 'rxjs';
import { buildProtocol } from './initProtocol/buildProtocol';
import { appConfigø } from './observables/appConfig';
import { IYieldObservables, IYieldFunctions } from './types';

/**
 * On app start (or provider change ) (and on providerø, chainId$ or appConfig$ observed changes ),
 * appConfig gathers all the required information from env etc.
 * sets things up, and then the stream finishes indicating that everything is ready to go.
 */
combineLatest([providerø, appConfigø, chainIdø]).subscribe(async ([provider, config, chainId]) => {
  updateProtocol(await buildProtocol(provider, chainId, config));
});

/* Expose the observables */
const yieldObservables: IYieldObservables = {
  protocolø,
  seriesø,
  assetsø,
  vaultsø,
  strategiesø,
  providerø,
  accountø,
  accountProviderø,
  selectedø,
  transactionsø,
  assetPairsø,
  userSettingsø,
  messagesø,
};

const viewObservables: any = {
  // borrow section */
  borrowInputø,
  collateralInputø,

  isBorrowPossibleø,
  isRollVaultPossibleø,

  maxDebtLimitø,
  minDebtLimitø,
  maximumRepayø,
  minimumRepayø,

  // with collateral
  collateralizationPercentø,
  collateralizationRatioø,
};

const viewFunctions: any = {
  updateBorrowInput,
  updateCollateralInput,
  updateRepayInput,

  updateLendInput,
  updateCloseInput,

  updateAddLiqInput,
  updateRemoveLiqInput,
};

/* Expose any required functions */
const yieldFunctions: IYieldFunctions = {
  /* actions */
  borrow,
  repayDebt,
  addLiquidity,

  updateProvider,
  updateAppConfig,
  updateAccount,

  /* selector functions */
  selectIlk,
  selectBase,
  selectVault,
  selectSeries,
  selectStrategy,
};

/* Expose constants that might be useful */
const yieldConstants = { ...constants, ...assetConstants };

export { yieldObservables, yieldFunctions, yieldConstants, viewObservables, viewFunctions };
