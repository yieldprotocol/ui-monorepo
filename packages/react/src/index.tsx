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
  IMessage,
  ISelected,
  ISeries,
  IStrategy,
  IVault,
  IYieldProcess,
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
      error: (e: Error) => {
        console.log(e), setError;
      },
    });
    return () => subscription.unsubscribe();
  }, [observable]);
  return showError ? [value, error] : value;
};

/* Build up the Provider state */
const YieldProvider = ({ props, children }: any) => {
  const {
    protocolø,
    assetsø,
    seriesø,
    strategiesø,
    vaultsø,
    accountø,
    messagesø,
    transactionsø,
    selectedø,
    providerø,
    accountProviderø,
  } = yieldObservables;

  const protocol = useObservable(
    protocolø
  ) as unknown as IYieldProtocol;

  const assetMap = useObservable(assetsø) as unknown as Map<string, IAsset>;
  const seriesMap = useObservable(seriesø) as unknown as Map<
    string,
    ISeries
  >;
  const strategyMap = useObservable(strategiesø) as unknown as Map<
    string,
    IStrategy
  >;
  const vaultMap = useObservable(vaultsø) as unknown as Map<string, IVault>;
  // const provider = useObservable(providerø) as unknown as string;
  // const accountProvider = useObservable(accountProviderø) as unknown as string;
  const account = useObservable(accountø) as unknown as string;

  const messages = useObservable(messagesø) as unknown as Map<string, IMessage>;
  const selected = useObservable(selectedø) as unknown as ISelected;
  const transactions = useObservable(transactionsø) as unknown as Map<string, IYieldProcess>;

  const provider = useObservable(providerø) as any;

  return (
    <YieldContext.Provider
      value={{
        provider, 

        messages,
        transactions,

        protocol,
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
