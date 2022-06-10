import { ethers, Contract, PayableOverrides, BigNumber, ContractTransaction } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { Ladle } from '../contracts';
import { account$, appConfig$, provider$, yieldProtocol$ } from '../observables/';
import { ICallData, IYieldProcess, LadleActions, ProcessStage, TxState } from '../types';
import { ZERO_BN } from '../utils/constants';
import { resetProcess, transactionMap$, updateProcess } from '../observables/transactionMap';
import { combineLatest } from 'rxjs';

/* Encode the calls: */ // TODO: this could probably be refactored to look better
const _encodeCalls = (calls: ICallData[], ladle: Ladle) =>
  calls.map((call: ICallData) => {
    /* 'pre-encode' routed/module calls if required */
    if (call.operation === LadleActions.Fn.ROUTE || call.operation === LadleActions.Fn.MODULE) {
      if (call.fnName && call.targetContract) {
        const encodedFn = (call.targetContract as any).interface.encodeFunctionData(call.fnName, call.args);

        if (call.operation === LadleActions.Fn.ROUTE)
          return ladle.interface.encodeFunctionData(LadleActions.Fn.ROUTE, [call.targetContract.address, encodedFn]);

        if (call.operation === LadleActions.Fn.MODULE)
          return ladle.interface.encodeFunctionData(LadleActions.Fn.MODULE, [call.targetContract.address, encodedFn]);
      }
      throw new Error('Function name and contract target required for routing / module interaction');
    }
    /* else */
    return (ladle as Contract).interface.encodeFunctionData(call.operation as string, call.args);
  });

/* Get the sum of the VALUE of all calls */
const _totalBatchValue = (calls: ICallData[]) =>
  calls.reduce((sum: BigNumber, call: ICallData) => {
    return sum.add(call.overrides?.value ? BigNumber.from(call?.overrides?.value) : ZERO_BN);
  }, ZERO_BN);

/* Handle the transaction error */ 
const _handleTxError = () => {

};

/* handle case when user or wallet rejects the tx (before submission) */
const _handleTxRejection = (err: any, processCode: string) => {
  resetProcess(processCode);
  /* If user cancelled/rejected the tx */
  if (err.code === 4001) {
    updateProcess({ processCode, stage: 0, error: { error: err, message: 'Transaction rejected by user.' } });
  } else {
    /* Else, the transaction was likely cancelled by the wallet/provider before getting submitted */
    const _msg = err.data.message.includes()
      ? `${err.data.message.split('VM Exception while processing transaction: revert').pop()}`
      : `Something went wrong.`;
    updateProcess({ processCode, stage: 0, error: { error: err, message: _msg } });
    /* Always log error to the console */
    console.log(err);
  }
};

export const transact = async (calls: ICallData[], processCode: string) => {

  /* Bring in observables */
  updateProcess({ processCode, stage: ProcessStage.TRANSACTION_REQUESTED });

  const { ladle } = yieldProtocol$.value;
  const account = account$.value;
  const provider = provider$.value as Web3Provider;
  const { forceTransactions } = appConfig$.value;

  /* Get the signer */
  const signer = account ? provider.getSigner(account) : provider.getSigner(0);
  /* Set the connected contract instance, ladle by default */
  const ladleContract = ladle.connect(signer) as Ladle;

  const encodedCalls = _encodeCalls(calls, ladleContract);
  const batchValue = _totalBatchValue(calls);

  let gasEst: BigNumber;
  // let gasEst: boolean = false;
  try {
    gasEst = await ladleContract.estimateGas.batch(encodedCalls, { value: batchValue } as PayableOverrides);
    console.log('Auto Gas estimate: ', gasEst.mul(120).div(100).toString());
  } catch (e: any) {
    /* handle if the tx if going to fail and transactions aren't forced */
    gasEst = BigNumber.from(1000000);

    if (!forceTransactions) console.log('transaction will fail'); // handleTxWillFail(e.error, processCode, e.transaction);
  }

  let tx: ContractTransaction;
  let res: any;

  try {

    /* first try the transaction with connected wallet and catch any 'pre-chain'/'pre-tx' errors */
    try {
      tx = await ladleContract.batch(encodedCalls, {
        value: batchValue,
        gasLimit: gasEst.mul(120).div(100),
      } as PayableOverrides);
      /* update process list > Tx Pending */
      updateProcess({
        processCode,
        stage: ProcessStage.TRANSACTION_PENDING,
        tx: { ...tx, receipt: null, status: TxState.PENDING },
      });
    } catch (e) {
      /* this case is when user rejects tx OR wallet rejects tx */
      _handleTxRejection(e, processCode);
    }

    /* wait for the tx to complete */ 
    res = await tx!.wait();

    /* check the tx status ( failed/success ) */
    const txSuccess: boolean = res.status === 1 || false;
    /* update process list > Tx Complete + status */
    updateProcess({
      processCode,
      stage: ProcessStage.PROCESS_COMPLETE,
      tx: { ...tx!, receipt: res, status: txSuccess ? TxState.SUCCESSFUL : TxState.FAILED },
    });

  } catch (e: any) {
    /* catch tx errors */
    //  _handleTxError('Transaction failed', e.transaction, processCode);
    console.log(' Error' ,  e.transaction, processCode  )
  }
};

