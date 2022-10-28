import { combineLatest, take } from 'rxjs';
import { transact } from '../chainActions';
import { assetsø } from '../observables';
import { IVault, ISeries, ActionCodes, ICallData, LadleActions } from '../types';
import { getProcessCode, ZERO_BN, MAX_128 } from '../utils';

export const rollDebt = async (vault: IVault, toSeries: ISeries) => {
  /* Subscribe to and get the values from the observables:  */
  assetsø
    .pipe(take(1)) // only take one and then finish.
    .subscribe(async (assetMap) => {
      const txCode = getProcessCode(ActionCodes.ROLL_DEBT, vault.id);

      const base = assetMap.get(vault.baseId);
      const hasDebt = vault.accruedArt.big.gt(ZERO_BN);

      const calls: ICallData[] = [
        {
          // ladle.rollAction(vaultId: string, newSeriesId: string, max: BigNumberish)
          operation: LadleActions.Fn.ROLL,
          args: [vault.id, toSeries.id, '2', MAX_128] as LadleActions.Args.ROLL,
          ignoreIf: !hasDebt,
        },
        {
          // case where rolling vault with ZERO debt
          operation: LadleActions.Fn.TWEAK,
          args: [vault.id, toSeries.id, vault.ilkId] as LadleActions.Args.TWEAK,
          ignoreIf: hasDebt,
        },
      ];
      transact(calls, txCode);
    });
};
