import { transact } from "../chainActions";
import { assetMap$ } from "../observables";
import { IVault, ISeries, ActionCodes, ICallData, LadleActions } from "../types";
import { getProcessCode, ZERO_BN, MAX_128 } from "../utils";

export const rollDebt = async (vault: IVault, toSeries: ISeries) => {

    const txCode = getProcessCode(ActionCodes.ROLL_DEBT, vault.id);
    const assetMap = assetMap$.value;

    const base = assetMap.get(vault.baseId);
    const hasDebt = vault.accruedArt.gt(ZERO_BN);

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
    await transact(calls, txCode);
    
  };