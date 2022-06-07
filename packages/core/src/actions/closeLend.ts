import { buyBase, calculateSlippage } from '@yield-protocol/ui-math';
import { ethers } from 'ethers';
import { sign, transact } from '../chainActions';
import { ETH_BASED_ASSETS } from '../config/assets';
import { account$, assetMap$, userSettings$, yieldProtocol$ } from '../observables';
import { ISeries, ActionCodes, ICallData, LadleActions, RoutedActions } from '../types';
import { getProcessCode, ONE_BN } from '../utils';
import { inputToTokenValue } from '../utils/yieldUtils';
import { removeEth } from './_addRemoveEth';

export const closeLend = async (amount: string | undefined, series: ISeries) => {
  const assetMap = assetMap$.value;
  const { ladle } = yieldProtocol$.value;
  const { slippageTolerance } = userSettings$.value;
  const account = account$.value;

  const txCode = getProcessCode(ActionCodes.CLOSE_POSITION, series.id);
  const base = assetMap.get(series.baseId)!;
  const _amount = inputToTokenValue(amount, base.decimals );

  const { fyTokenAddress, poolAddress } = series;
  const ladleAddress = ladle.address;

  const seriesIsMature = series.isMature();

  /* buy fyToken value ( after maturity  fytoken === base value ) */
  const _fyTokenValueOfInput = seriesIsMature
    ? _amount
    : buyBase(
        series.baseReserves,
        series.fyTokenReserves,
        _amount,
        series.getTimeTillMaturity(),
        series.ts,
        series.g2,
        series.decimals
      );

  /* calculate slippage on the base token expected to recieve ie. input */
  const _inputWithSlippage = calculateSlippage(_amount, slippageTolerance.toString(), true);

  /* if ethBase */
  const isEthBase = ETH_BASED_ASSETS.includes(series.baseId);

  /* if approveMAx, check if signature is required */
  const alreadyApproved = (await series.fyTokenContract.allowance(account!, ladleAddress)).gte(_fyTokenValueOfInput);

  const permitCallData: ICallData[] = await sign(
    [
      {
        target: series,
        spender: 'LADLE',
        amount: _fyTokenValueOfInput,
        ignoreIf: alreadyApproved === true,
      },
    ],
    txCode
  );

  const removeEthCallData = isEthBase ? removeEth(ONE_BN) : [];

  /* Set the transferTo address based on series maturity */
  const transferToAddress = () => {
    if (seriesIsMature) return fyTokenAddress;
    return poolAddress;
  };

  /* receiver based on whether base is ETH (- or wrapped Base) */
  const receiverAddress = () => {
    if (isEthBase) return ladleAddress;
    // if ( unwrapping) return unwrapHandlerAddress;
    return account;
  };

  const calls: ICallData[] = [
    ...permitCallData,
    {
      operation: LadleActions.Fn.TRANSFER,
      args: [
        fyTokenAddress,
        transferToAddress(), // select destination based on maturity
        _fyTokenValueOfInput,
      ] as LadleActions.Args.TRANSFER,
      ignoreIf: false, // never ignore, even after maturity because we go through the ladle.
    },

    /* BEFORE MATURITY */
    {
      operation: LadleActions.Fn.ROUTE,
      args: [receiverAddress(), _inputWithSlippage] as RoutedActions.Args.SELL_FYTOKEN,
      fnName: RoutedActions.Fn.SELL_FYTOKEN,
      targetContract: series.poolContract,
      ignoreIf: seriesIsMature,
    },

    /* AFTER MATURITY */
    {
      operation: LadleActions.Fn.REDEEM,
      args: [series.id, receiverAddress(), _fyTokenValueOfInput] as LadleActions.Args.REDEEM,
      ignoreIf: !seriesIsMature,
    },

    ...removeEthCallData, // (exit_ether sweeps all the eth out the ladle, so exact amount is not importnat -> just greater than zero)
  ];
  await transact(calls, txCode);
  // updateSeries([series]);
  // updateAssets([base]);
  // updateTradeHistory([series]);
};
