import { Observable, BehaviorSubject, share } from 'rxjs';
import { IYieldProcess, ProcessStage } from '../types';

/** @internal */
export const transactionMap$ = new BehaviorSubject<Map<string, IYieldProcess>>(new Map([]));
export const transactionMapø = transactionMap$.pipe<Map<string, IYieldProcess>>(share());

/* Update a process  */
export const updateProcess = (process: IYieldProcess) => {
  const prevProcess = transactionMap$.value.get(process.processCode);
  const updatedProcess = transactionMap$.value.set(process.processCode, { ...prevProcess, ...process });
  transactionMap$.next(new Map(updatedProcess));
};

/* utility function to reset a process */
export const resetProcess = (processCode: string) => {
  transactionMap$.next(
    new Map(
      transactionMap$.value.set(processCode, {
        processCode,
        tx: undefined,
        signMap: new Map([]),
        stage: ProcessStage.PROCESS_INACTIVE,
        txHash: undefined,
        timeout: false,
        processActive: false,
      })
    )
  );
};
