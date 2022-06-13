import { combineLatest } from 'rxjs';
import { buildProtocol } from './initProtocol/buildProtocol';
import { IYieldFunctions, IYieldObservables } from './types';
import { accountø, chainIdø, updateAccount} from './observables/connection';
import { assetMapø } from './observables/assetMap';
import { seriesMapø } from './observables/seriesMap';
import { updateYieldProtocol, yieldProtocolø } from './observables/yieldProtocol';
import { strategyMapø } from './observables/strategyMap';
import { vaultMapø } from './observables/vaultMap';
import { appConfigø, updateYieldConfig } from './observables/appConfig';
import { accountProviderø, providerø, updateProvider } from './observables/connection';
import { selectBase, selectedø, selectIlk, selectSeries, selectStrategy, selectVault } from './observables/selected';

import * as constants from './utils/constants';
import * as assetConstants from './config/assets';

import { transactionMapø, assetPairMapø, userSettingsø } from './observables';
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
import { messagesø } from './observables/messages';
import {
  isBorrowPossibleø,
  isRollVaultPossibleø,
  maxDebtLimitø,
  maximumRepayø,
  minDebtLimitø,
  minimumRepayø,
} from './viewObservables/borrowView';
import { collateralizationPercentø, collateralizationRatioø } from './viewObservables/collateralView';

/** 
 * On app start (and on providerø, chainId$ or appConfig$ observed changes ), 
 * appConfig gathers all the required information from env etc.
 * sets things up, and then the stream finishes indicating that everything is ready to go.
 */
 combineLatest([ providerø, appConfigø, chainIdø ])
 .subscribe(async ([provider, config, chainId]) => {
   updateYieldProtocol(await buildProtocol(provider, chainId, config.browserCaching));
 });


/* Expose the observables */
const yieldObservables: IYieldObservables = {
  yieldProtocolø,
  seriesMapø,
  assetMapø,
  vaultMapø,
  strategyMapø,
  providerø,
  accountø,
  accountProviderø,
  selectedø,
  transactionMapø,
  assetPairMapø,
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
  updateProvider,
  updateYieldConfig,
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
