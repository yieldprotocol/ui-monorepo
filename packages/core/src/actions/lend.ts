import { sellBase, calculateSlippage } from '@yield-protocol/ui-math';
import { ETH_BASED_ASSETS } from '../config/assets';
import {
  chainIdø,
  accountø,
  assetMapø,
  userSettingsø,
  yieldProtocolø,
} from '../observables';
import { sign, transact } from '../chainActions';

import { ISeries, ActionCodes, ICallData, LadleActions, RoutedActions } from '../types';
import { addEth } from './_addRemoveEth';
import { getProcessCode, inputToTokenValue } from '../utils/yieldUtils';
import { combineLatest, take } from 'rxjs';

export const lend = async (amount: string | undefined, series: ISeries) => {
  /* Subscribe to and get the values from the observables:  */
  combineLatest([yieldProtocolø, chainIdø, assetMapø, accountø, userSettingsø])
    .pipe(take(1)) // only take one and then finish.
    .subscribe(
      async ([
        { ladle },
        chainId,
        assetMap,
        account,
        { slippageTolerance },
      ]) => {
        /* generate the reproducible processCode for tx tracking and tracing */
        const processCode = getProcessCode(ActionCodes.LEND, series.id);

        /* Get the values from the observables/subjects */
        const ladleAddress = ladle.address;
        const base = assetMap.get(series.baseId)!;
        const _amount = inputToTokenValue(amount, base?.decimals);

        const _inputAsFyToken = sellBase(
          series.baseReserves.bn,
          series.fyTokenReserves.bn,
          _amount,
          series.getTimeTillMaturity(),
          series.ts,
          series.g1,
          series.decimals
        );
        const _inputAsFyTokenWithSlippage = calculateSlippage(_inputAsFyToken, slippageTolerance.toString(), true);

        /* if approveMAx, check if signature is required */
        const alreadyApproved = (await base.getAllowance(account!, ladleAddress)).gte(_amount);

        /* ETH is used as a base */
        const isEthBase = ETH_BASED_ASSETS.includes(series.baseId);

        const permitCallData: ICallData[] = await sign(
          [
            {
              target: base,
              spender: 'LADLE',
              amount: _amount,
              ignoreIf: alreadyApproved === true,
            },
          ],
          processCode,
          chainId
        );

        const addEthCallData = () => {
          if (isEthBase) return addEth(_amount, series.poolAddress);
          return [];
        };

        const calls: ICallData[] = [
          ...permitCallData,
          ...addEthCallData(),
          {
            operation: LadleActions.Fn.TRANSFER,
            args: [base.address, series.poolAddress, _amount] as LadleActions.Args.TRANSFER,
            ignoreIf: isEthBase,
          },
          {
            operation: LadleActions.Fn.ROUTE,
            args: [account, _inputAsFyTokenWithSlippage] as RoutedActions.Args.SELL_BASE,
            fnName: RoutedActions.Fn.SELL_BASE,
            targetContract: series.poolContract,
            ignoreIf: false,
          },
        ];

        transact(calls, processCode);
      }
    );
};
