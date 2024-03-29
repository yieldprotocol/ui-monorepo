import * as constants from './utils/constants';
import * as assetConstants from './config/assetsConfig';

// TODO: import all dynamically when things are up and running
// import * as yieldObservables from './observables';
import { addLiquidity, borrow, repayDebt } from './actions';

import {
  selectBase,
  selectIlk,
  selectSeries,
  selectStrategy,
  selectVault,
  updateAccount,
  updateProvider,
  updateConfig,
  updateProtocol,
} from './observables';

import {
  updateBorrowInput,
  updateCollateralInput,
  updateLendInput,
  updateCloseInput,
  updateAddLiqInput,
  updateRemoveLiqInput,
  updateRepayInput,
} from './viewObservables/input';

import { combineLatest } from 'rxjs';
import { buildProtocol } from './buildProtocol';
import { IYieldConfig, IYieldFunctions } from './types';

import * as yieldObservables from './observables';
import * as viewObservables from './viewObservables';


import ASSETS from './config/new/assets';
import SERIES from './config/new/series';
import ORACLES from './config/new/oracles';
import STRATEGIES from './config/new/strategies';


/**
 * On app start (and on providerø, chainId$ or appConfig$ observed changes ),
 * appConfig gathers all the required information from env etc.
 * sets things up, and then the stream finishes indicating that everything is ready to go.
 */
const initProtocol = combineLatest([yieldObservables.providerø, yieldObservables.appConfigø, yieldObservables.chainIdø]).subscribe(
  async ([provider, config, chainId]) => {
    console.log( provider )
    updateProtocol( await buildProtocol(provider, chainId, config) );
  }
);

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
  updateConfig,
  updateAccount,

  /* selector functions */
  selectIlk,
  selectBase,
  selectVault,
  selectSeries,
  selectStrategy,
};

const yieldConfig = {
  series: SERIES,
  assets: ASSETS,
  strategies: STRATEGIES,
  oracles: ORACLES,
}

/* Expose constants that might be useful */
const yieldConstants = { ...constants, ...assetConstants };

export { initProtocol, yieldObservables, yieldFunctions, yieldConstants, viewObservables, viewFunctions, yieldConfig  };
