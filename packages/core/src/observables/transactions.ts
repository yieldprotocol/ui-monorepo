import { Observable, BehaviorSubject, share } from 'rxjs';
import { IYieldProcess, ProcessStage } from '../types';

/** @internal */
export const transactionMap$: BehaviorSubject<Map<string, IYieldProcess>> = new BehaviorSubject(new Map([]));
export const transactionsø: Observable<Map<string, IYieldProcess>> = transactionMap$.pipe(share());

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
