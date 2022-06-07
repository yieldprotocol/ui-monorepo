import { ethers } from 'ethers';
import { sellBase, calculateSlippage } from '@yield-protocol/ui-math';

import { ETH_BASED_ASSETS } from '../config/assets';

import { userSettings$, yieldProtocol$, assetMap$, account$  } from '../observables';
import { sign } from '../chainActions';

import { ISeries, ActionCodes, ICallData, LadleActions, RoutedActions } from '../types';
import { addEth } from './_addRemoveEth';
import { getProcessCode, inputToTokenValue } from '../utils/yieldUtils';

export const lend = async (amount: string | undefined, series: ISeries) => {
  /* generate the reproducible processCode for tx tracking and tracing */
  const processCode = getProcessCode(ActionCodes.LEND, series.id);
  console.log(processCode);

  /* Get the values from the observables/subjects */
  const ladleAddress = yieldProtocol$.value.ladle.address;
  const assetMap = assetMap$.value;
  const account = account$.value;
  const { slippageTolerance } = userSettings$.value;

  const base = assetMap.get(series.baseId)!;

  const _amount = inputToTokenValue(amount, base?.decimals)

  const _inputAsFyToken = sellBase(
    series.baseReserves,
    series.fyTokenReserves,
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
    processCode
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

  // await transact(calls, processCode);
  // updateSeries([series]);
  // updateAssets([base]);
  // updateTradeHistory([series]);
};
