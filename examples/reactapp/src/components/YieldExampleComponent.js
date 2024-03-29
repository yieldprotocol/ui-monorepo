import React, { useEffect, useRef } from "react";

import { useObservable, YieldContext } from "@yield-protocol/ui-react";

import config from "../yield.config";
import { ethers } from "ethers";

const YieldExampleComponent = () => {
  const {
    protocol,
    assetMap,
    seriesMap,
    strategyMap,
    vaultMap,
    account,
    provider,

    messages,
    transactions,
    selected,

    yieldFunctions,
    yieldConstants,
    chainId,
    viewObservables,
    viewFunctions,
  } = React.useContext(YieldContext);

  const { protocolVersion, moduleMap, oracleMap, cauldron, ladle, witch } = {
    ...protocol,
  }; // tricksy destructuring for error avoidance :)

  const {
    updateProvider,
    updateAccount,
    updateConfig,
    selectIlk,
    selectVault,
    selectBase,
    selectSeries,
    selectStrategy,

    borrow,
    repayDebt,
    addLiquidity,
  } = yieldFunctions;

  const { updateBorrowInput, updateCollateralInput } = viewFunctions;

  // const input = useObservable(viewObservables.borrowInputø);
  const isBorrowPossible = useObservable(viewObservables.isBorrowPossibleø);

  // const maxBorrow = useObservable(viewObservables.maxBorrowø);
  const collateralizationPercent = useObservable(
    viewObservables.collateralizationPercentø
  );
  const collateralizationRatio = useObservable(
    viewObservables.collateralizationRatioø
  );

  const [_selectIlk, setSelectIlk] = React.useState();

  // Example of using a yieldProtocol config file.
  useEffect(() => {
    console.log("Setting Config: ", config);
    updateConfig(config);
  }, []); // empty array to only do this once on load

  return (
    <div
      align="left"
      style={{
        // backgroundImage: `url("https://user-images.githubusercontent.com/5603206/153614570-2a6f817c-fe12-4c14-b9d3-a79c170485ab.gif")`,
        height: "100%",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100%",
        overflow: "auto",
      }}
    >
      {messages?.has("FORKED_ENV") && (
        <div
          style={{
            position: "absolute",
            right: "8px",
            backgroundColor: "pink",
            padding: "8px",
          }}
        >
          Using a forked environment:
          <div>{provider?.connection?.url}</div>
        </div>
      )}

      {transactions?.size > 0 && (
        <div
          style={{
            position: "absolute",
            top: "10%",
            right: "8px",
            backgroundColor: "pink",
            padding: "8px",
          }}
        >
          {Array.from(transactions.values()).map((tx) => {
            return (
              <div key={tx.processCode}>
                {tx.processCode}
                <div>{tx.stage}</div>
              </div>
            );
          })}
        </div>
      )}

      <div>YieldProtocol UI version: {protocolVersion}</div>
      <div>
        <input
          onChange={(e) => updateBorrowInput(e.target.value)}
          placeholder="Amount?"
        />
        <p style={{ color: isBorrowPossible ? undefined : "red" }}>
          {" "}
          can borrow? {isBorrowPossible ? "true" : "false"}{" "}
        </p>
      </div>

      <div>
        <input
          onChange={(e) => updateCollateralInput(e.target.value)}
          placeholder="Collateral?"
        />
        <p>{collateralizationPercent ? `${collateralizationPercent}%` : ""} </p>

        <button
          onClick={() => borrow("5000", "10", selected?.vault || undefined)}
        >
          borrow 5000 {selected?.vault?.id}
        </button>
        <button onClick={() => repayDebt("6000", selected?.vault)}>
          repay 6000 {selected?.vault?.id}
        </button>

        <button onClick={() => addLiquidity("10", selected?.strategy)}>
          add 10000 liquidity
        </button>
      </div>

      <hr />
      <div>
        <h3>ChainId: {chainId}</h3>

        <h3> Account: {account} </h3>
        <button
          // onClick={async () => {
          //   const accs = await window.ethereum.request({
          //     method: "eth_requestAccounts",
          //     params: [],
          //   });
          //   updateAccount(accs[0]);
          // }}
          onClick={async () => {
            updateProvider(new ethers.providers.Web3Provider(window.ethereum));
          }}
        >
          Set account as Metamask
        </button>

        <button onClick={() => updateAccount(undefined)}>
          Set account undefined
        </button>

        <button
          onClick={() =>
            updateAccount("0x1Bd3Abb6ef058408734EA01cA81D325039cd7bcA")
          }
        >
          Set account to
        </button>
      </div>
      <hr />

      <div>
        <button onClick={() => selectIlk(yieldConstants.USDC)}>
          Select ilk : USDC
        </button>
        <button onClick={() => selectIlk()}>selected ilk: undefined</button>
      </div>

      {protocol && (
        <>
          <div>
            <h3>Protocol Contracts:</h3>
            <p> {cauldron && `Cauldron: ${cauldron.address}`} </p>
            <p> {ladle && `Ladle: ${ladle.address}`} </p>
            <p> {witch && `Witch: ${witch.address}`} </p>
          </div>

          <div>
            <h3>Module Contracts:</h3>
            {moduleMap?.size ? (
              [...moduleMap].map(([k, v]) => (
                <p key={k}>{`${k}: ${v.address}`}</p>
              ))
            ) : (
              <p>Loading...</p>
            )}
          </div>

          <div>
            <h3>Oracle Contracts:</h3>
            {oracleMap?.size ? (
              [...oracleMap].map(([k, v]) => (
                <p key={k}>{`${k}: ${v.address}`}</p>
              ))
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </>
      )}

      <div>
        <div>
          <h3>Assets:</h3>
          <input
            type="checkbox"
            id="SelectIlk"
            value={_selectIlk}
            onChange={() => setSelectIlk(!_selectIlk)}
          />
          <label htmlFor="SelectIlk"> Select Ilk </label>
        </div>
        {assetMap?.size ? (
          [...assetMap].map(([k, v]) => (
            <p
              key={k}
              onClick={() => {
                console.table(v, ["value"]);
                _selectIlk ? selectIlk(v.id) : selectBase(v.id);
              }}
            >{`${k}: ${v.symbol}`}</p>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>

      <div>
        <h3>Series:</h3>
        {seriesMap?.size ? (
          [...seriesMap].map(([k, v]) => (
            <p
              key={k}
              onClick={() => {
                console.table(v, ["value"]);
                selectSeries(v.id);
              }}
            >{`${k}: ${v.maturityDate}`}</p>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>

      <div>
        <h3>Strategies:</h3>
        {strategyMap?.size ? (
          [...strategyMap].map(([k, v]) => (
            <p
              onClick={() => {
                console.table(v, ["value"]);
                selectStrategy(k);
              }}
              key={k}
            >{`${v.name} : ${k}`}</p>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>

      <div
        style={{
          backgroundColor: "lightgrey",
          position: "absolute",
          top: "20%",
          right: "10px",
          padding: "10px",
        }}
      >
        <h3>Vaults:</h3>
        {account ? (
          [...vaultMap].map(([k, v]) => (
            <p
              key={k}
              onClick={() => {
                console.table(v, ["value"]);
                selectVault(v.id);
              }}
            >{`${v.displayName} : ${k}`}</p>
          ))
        ) : (
          <p>No account connected</p>
        )}
      </div>

      <div
        style={{
          backgroundColor: "lightgrey",
          position: "absolute",
          top: "50%",
          right: "10px",
          padding: "10px",
        }}
      >
        <h3>Selected Items:</h3>

        <p> Selected Series: {selected?.series?.id}</p>
        <p> Selected Base: {selected?.base?.id}</p>
        <p> Selected Ilk: {selected?.ilk?.id}</p>
        <p> Selected Vault: {selected?.vault?.id} </p>
        <p> Selected Strategy: {selected?.strategy?.id}</p>
      </div>

      {messages &&
        !Array.from(messages.values()).every(
          (x) => x.expired || x.timeoutOverride === Infinity
        ) && (
          <div
            style={{
              backgroundColor: "lightblue",
              position: "absolute",
              bottom: "10%",
              left: "10px",
              padding: "10px",
            }}
          >
            {Array.from(messages.values())
              .filter((msg) => !msg.expired && msg.timeoutOverride !== Infinity)
              .map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    backgroundColor: "lightgreen",
                    padding: "10px",
                  }}
                >
                  {msg.message}
                </div>
              ))}
          </div>
        )}
    </div>
  );
};

export { YieldExampleComponent };
