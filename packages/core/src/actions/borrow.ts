import { ethers } from 'ethers';
import { buyBase, calculateSlippage, ONE_BN, ZERO_BN } from '@yield-protocol/ui-math';

import { ETH_BASED_ASSETS, CONVEX_BASED_ASSETS } from '../config/assets';
import { ConvexLadleModule } from '../contracts';

import { account$, assetMap$, seriesMap$, userSettings$, yieldProtocol$, selected$, vaultMap$ } from '../observables';
import { sign, transact } from '../chainActions';

import { IVault, ActionCodes, ISeries, IAsset, ICallData, LadleActions } from '../types';
import { ModuleActions } from '../types/operations';

import { addEth, removeEth } from './_addRemoveEth';
import { wrapAsset } from './_wrapUnwrapAsset';

import { getProcessCode, BLANK_VAULT } from '../utils';
import { MessageType, sendMsg } from '../observables/messages';
import { inputToTokenValue } from '../utils/yieldUtils';

export const borrow = async (
  amount?: string,
  collateralAmount?: string,
  vault?: IVault | string,
  getValuesFromNetwork: boolean = true // Get market values by network call or offline calc (default: NETWORK)
) => {
  /* Get the values from the observables/subjects */
  const ladleAddress = yieldProtocol$.value.ladle.address;
  const { moduleMap } = yieldProtocol$.value;

  /* import the maps */
  const assetMap = assetMap$.value;
  const seriesMap = seriesMap$.value;
  const vaultMap = vaultMap$.value;

  const selected = selected$.value;
  const account = account$.value;
  const { slippageTolerance } = userSettings$.value;

  /** Use the vault/vaultId provided else use blank vault TODO: Add a check for existing vault */
  const getValidatedVault = (v: IVault | string | undefined): IVault | undefined => {
    if (v) {
      if ((v as IVault).id) return v as IVault;
      if (vaultMap.has(v as string)) return vaultMap.get(v as string);
      sendMsg({ message: 'Vault ID provided, but not recognised.', type: MessageType.WARNING, origin: 'Borrow()' });
      throw new Error('Vault ID provided, but was not recognised.');
      // return undefined //TODO: should pass this instead of throwing error?
    }
    sendMsg({ message: 'No Vault ID provided. Creating a new Vault...', type: MessageType.INFO, origin: 'Borrow()' });
    return undefined;
  };

  const _vault = getValidatedVault(vault);
  const vaultId: string = _vault ? _vault.id : BLANK_VAULT;

  /* Set the series and ilk based on the vault that has been selected or if it's a new vault, get from the globally selected SeriesId */
  const series: ISeries = _vault ? seriesMap.get(_vault.seriesId)! : selected.series!;
  const base: IAsset = assetMap$.value.get(series.baseId)!;
  const ilk: IAsset = _vault ? assetMap.get(_vault.ilkId)! : assetMap.get(selected.ilk!.proxyId)!; // NOTE: Here we use the 'wrapped version' of the selected Ilk, if required.

  /* bring in the Convex Mmdule where reqd. */
  const ConvexLadleModuleContract = moduleMap.get('ConvexLadleModule') as ConvexLadleModule;

  /* generate the reproducible processCode for tx tracking and tracing */
  const processCode = getProcessCode(ActionCodes.BORROW, series.id);

  /* parse inputs  (clean 'down' to base/ilk decimals so that there is never an underlow)  */
  const _amount = inputToTokenValue(amount, base.decimals);
  const _collAmount = inputToTokenValue(collateralAmount, ilk.decimals);

  /* FLAG : is ETH  used as collateral */
  const isEthCollateral = ETH_BASED_ASSETS.includes(selected.ilk!.proxyId);
  /* FLAG: is ETH being Borrowed */
  const isEthBase = ETH_BASED_ASSETS.includes(series.baseId);
  /* FLAG: is convex-type collateral */
  const isConvexCollateral = CONVEX_BASED_ASSETS.includes(selected.ilk!.proxyId);

  /* Calculate expected debt (fytokens) from EITHER network or calculated : default = Network */
  const _expectedFyToken = getValuesFromNetwork
    ? await series.poolContract.buyBasePreview(_amount)
    : buyBase(
        series.baseReserves,
        series.fyTokenReserves,
        _amount,
        series.getTimeTillMaturity(),
        series.ts,
        series.g2,
        series.decimals
      );
  const _expectedFyTokenWithSlippage = calculateSlippage(_expectedFyToken, slippageTolerance.toString()); // TODO check this tolereance typing

  /* if approveMAx, check if signature is required : note: getAllowance may return FALSE if ERC1155 */
  const _allowance = await ilk.getAllowance(account!, ilk.joinAddress);

  const alreadyApproved = ethers.BigNumber.isBigNumber(_allowance) ? _allowance.gte(_collAmount) : _allowance;
  console.log('Already approved', alreadyApproved);

  /* if ETH is being borrowed, send the borrowed tokens (WETH) to ladle for unwrapping */
  const serveToAddress = () => {
    if (isEthBase) return ladleAddress;
    // if ( wrapping  ) return wrapHandler
    return account;
  };

  /* handle ETH deposit as Collateral, if required (only if collateral used is ETH-based ), else send ZERO_BN */
  const addEthCallData: ICallData[] = addEth(isEthCollateral ? _collAmount : ZERO_BN);
  /* handle remove/unwrap WETH > if ETH is what is being borrowed */
  const removeEthCallData: ICallData[] = removeEth(isEthBase ? ONE_BN : ZERO_BN); // (exit_ether sweeps all the eth out the ladle, so exact amount is not importnat -> just greater than zero)
  /* handle wrapping of collateral if required */
  const wrapAssetCallData: ICallData[] = await wrapAsset(_collAmount, selected.ilk!, processCode); // note: selected ilk used here, not wrapped version

  /**
   * Gather all the required signatures - sign() processes them and returns them as ICallData types
   * NOTE: this is an async function
   * */
  const permitCallData: ICallData[] = await sign(
    [
      {
        target: ilk,
        spender: ilk.joinAddress,
        amount: _collAmount,
        ignoreIf:
          alreadyApproved === true || // Ignore if already approved
          ETH_BASED_ASSETS.includes(ilk.id) || // Ignore if dealing with an eTH based collateral
          _collAmount.eq(ethers.constants.Zero), // || // ignore if zero collateral value
        // wrapAssetCallData.length > 0, // Ignore if dealing with a wrapped collateral!
      },
    ],
    processCode
  );

  /**
   *
   * Collate all the calls required for the process
   * (including depositing ETH, signing permits, and building vault if needed)
   *
   * */
  const calls: ICallData[] = [
    /* handle wrapped token deposit, if required */
    ...wrapAssetCallData,

    /* Include all the signatures gathered, if required */
    ...permitCallData,

    /* add in the ETH deposit if required */
    ...addEthCallData,

    /* If vault is null, build a new vault, else ignore */
    {
      operation: LadleActions.Fn.BUILD,
      args: [selected$.value.series?.id, ilk.id, '0'] as LadleActions.Args.BUILD,
      ignoreIf: vaultId !== BLANK_VAULT,
    },

    /* If convex-type collateral, add vault using convex ladle module */
    {
      operation: LadleActions.Fn.MODULE,
      fnName: ModuleActions.Fn.ADD_CONVEX_VAULT,
      args: [ilk.joinAddress, vaultId] as ModuleActions.Args.ADD_CONVEX_VAULT,
      targetContract: ConvexLadleModuleContract,
      ignoreIf: vaultId !== BLANK_VAULT || !isConvexCollateral,
    },

    {
      operation: LadleActions.Fn.SERVE,
      args: [vaultId, serveToAddress(), _collAmount, _amount, _expectedFyTokenWithSlippage] as LadleActions.Args.SERVE,
      ignoreIf: false,
    },
    ...removeEthCallData,
  ];

  /* finally, handle the transaction */
  await transact(calls, processCode);

  /* 
    When complete, update vaults.
      If a vault was provided, update it only,
      else update ALL vaults (by passing an empty array)
  */
  // updateVaults([]);
  // updateAssets([base, ilkToUse, selectedIlk!]);
  // updateSeries([series]);
};
