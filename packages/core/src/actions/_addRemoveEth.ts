import { BigNumber } from 'ethers';
import { combineLatest, take } from 'rxjs';
import { account$, yieldProtocol$, yieldProtocolø  } from '../observables';
import { ICallData, LadleActions } from '../types';
import { ModuleActions } from '../types/operations';
import { ZERO_BN } from '../utils/constants';

/**
 * @internal
 * */
export const addEth = (
  value: BigNumber,
  to: string | undefined = undefined,
  alternateEthAssetId: string | undefined = undefined
): ICallData[] => {
          
  const { moduleMap } = yieldProtocol$.value; // TODO: consider removing this value -> by means of a subscription.
  const WrapEtherModuleContract = moduleMap.get('WrapEtherModule');
  const account = account$.value;

  /* if there is a destination 'to' then use the ladle module (wrapEtherModule) */
  if (to)
    return [
      {
        operation: LadleActions.Fn.MODULE,
        fnName: ModuleActions.Fn.WRAP_ETHER,
        args: [to || account, value] as ModuleActions.Args.WRAP_ETHER,
        targetContract: WrapEtherModuleContract,
        ignoreIf: value.lte(ZERO_BN), // ignores if value is 0 or negative
        overrides: { value },
      },
    ];
  /* else use simple JOIN_ETHER  with optional */
  return [
    {
      operation: LadleActions.Fn.JOIN_ETHER,
      args: [alternateEthAssetId || '0x303000000000'] as LadleActions.Args.JOIN_ETHER, // use alt eth ID if reqd. defaults to WETH
      ignoreIf: value.lte(ZERO_BN), // ignores if value is zero OR NEGATIVE
      overrides: { value },
    },
  ];
};

// 

/**
 * @internal
 * @comment EXIT_ETHER sweeps all out of the ladle, so *value* is not important > it must just be bigger than zero to not be ignored
 * */
export const removeEth = (value: BigNumber, to: string | undefined = undefined): ICallData[] => [
  {
    operation: LadleActions.Fn.EXIT_ETHER,
    args: [to || account$.value] as LadleActions.Args.EXIT_ETHER,
    ignoreIf: value.eq(ZERO_BN), // ignores if value is ZERO. NB NOTE: sign (+-) is irrelevant here
  },
];
