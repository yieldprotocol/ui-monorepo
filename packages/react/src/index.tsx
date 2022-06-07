import React, { useEffect } from "react";
import { Observable } from "rxjs";
import {
  yieldObservables,
  yieldFunctions,
  yieldConstants,
  viewObservables,
  viewFunctions,
} from "@yield-protocol/ui-core";
import {
  IAsset,
  ISeries,
  IStrategy,
  IVault,
  IYieldProtocol,
} from "@yield-protocol/ui-core/bin/types";

/* Build the context */
const YieldContext = React.createContext<any>({});

/* useObservable hook */
export const useObservable = (
  observable: Observable<any>,
  showError: boolean = false
) => {
  const [value, setValue] = React.useState();
  const [error, setError] = React.useState();
  useEffect(() => {
    const subscription = observable.subscribe({
      next: setValue,
      error: (e:Error)=>{ console.log(e), setError },
    });
    return () => subscription.unsubscribe();
  }, [observable]);
  return showError ? [value, error] : value;
};

/* Build up the Provider state */
const YieldProvider = ({ props, children }: any) => {
  const {
    yieldProtocolø,
    assetMapø,
    seriesMapø,
    strategyMapø,
    vaultMapø,
    accountø,
    providerø,
    messagesø,
    transactionMapø,
    selectedø,
  } = yieldObservables;

  const yieldProtocol = useObservable(
    yieldProtocolø
  ) as unknown as IYieldProtocol;

  const assetMap = useObservable(assetMapø) as unknown as Map<string, IAsset>;
  const seriesMap = useObservable(seriesMapø) as unknown as Map<
    string,
    ISeries
  >;
  const strategyMap = useObservable(strategyMapø) as unknown as Map<
    string,
    IStrategy
  >;
  const vaultMap = useObservable(vaultMapø) as unknown as Map<string, IVault>;
  const provider = useObservable(providerø) as unknown as string;
  const account = useObservable(accountø) as unknown as string;
  
  const messages = useObservable(messagesø) as unknown as string;
  const selected = useObservable(selectedø) as unknown as string;
  // const transactionMap = useObservable(transactionMapø) as unknown as string;

  useEffect(() => {
    console.log(props?.provider);
    props?.provider && yieldFunctions.updateProvider(props?.provider);
  }, [props?.provider]);

  return (
    <YieldContext.Provider
      value={{
        messages,
        provider,
        yieldProtocol,
        assetMap,
        seriesMap,
        strategyMap,
        vaultMap,
        account,
        selected,

        yieldFunctions,
        yieldConstants,

        viewObservables,
        viewFunctions,
      }}
    >
      {children}
    </YieldContext.Provider>
  );
};

/* Returns the Context & Provider */
export { YieldContext, YieldProvider };