import { ethers } from 'ethers';
import { first, filter, withLatestFrom } from 'rxjs';

import { buildProtocol } from './initProtocol/buildProtocol';
import { IYieldConfig, IYieldFunctions, IYieldObservables } from './types';
import { accountø, updateAccount } from './observables/account';
import { assetMapø } from './observables/assetMap';
import { seriesMapø } from './observables/seriesMap';
import { yieldProtocol$, yieldProtocolø } from './observables/yieldProtocol';
import { strategyMapø } from './observables/strategyMap';
import { vaultMapø } from './observables/vaultMap';
import { appConfig$, updateYieldConfig } from './observables/appConfig';
import { provider$, providerø, updateProvider } from './observables/provider';
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

/*
 * FIRST LOAD > Handle initial setup protocol with DEFAULTS on FIRST LOAD
 * */
appConfig$
  .pipe(
    /* if config file has a default provider and * other checks if required: */
    // filter((conf: IYieldConfig) => conf.defaultProvider !== undefined),

    /* only Once at the beginning if the above is true (ie. not on every config change): */
    first()
  )
  .subscribe(async (config: IYieldConfig) => {
    // console.log(config.diagnostics);
    provider$.next(config.defaultProvider);
  });
// .unsubscribe(); // maybe not needed becasue of first() operator?

/**
 * Observe provider$ changes  => Load/re-load protocol (TODO only if network id changes?)
 * */
provider$
  .pipe(withLatestFrom(appConfig$))
  .subscribe(async ([provider, config]: [ethers.providers.BaseProvider, IYieldConfig]) => {
    yieldProtocol$.next(await buildProtocol(provider, config.browserCaching));
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