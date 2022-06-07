import { BehaviorSubject, Observable, share, combineLatest, withLatestFrom, filter, skip } from 'rxjs';
import { BigNumber, Contract, ethers } from 'ethers';

import { IAsset, IAssetRoot, TokenType, IYieldProtocol } from '../types';
import { account$ } from './account';
import { yieldProtocol$ } from './yieldProtocol';
import { provider$ } from './provider';
import * as contracts from '../contracts';
import { ASSETS, ETH_BASED_ASSETS } from '../config/assets';
import { ZERO_BN } from '../utils/constants';
import { truncateValue } from '../utils';
import { MessageType, sendMsg } from './messages';

/** @internal */
export const assetMap$ = new BehaviorSubject<Map<string, IAsset>>(new Map([]));

/**
 * Unsubscribed Assetmap observable
 */
export const assetMapø = assetMap$.pipe<Map<string, IAsset>>(share());

/**
 * Update Assets function
 * @param assetList  list of assets to update
 * @param account optional: account in use
 */
export const updateAssets = async (assetList?: IAsset[], account?: string) => {
  /* if passed an empty list, update ALL assets in the assetMap$ subject */
  const list = assetList?.length ? assetList : Array.from(assetMap$.value.values());
  list.map(async (asset: IAsset) => {
    const assetUpdate = await _updateAsset(asset, account);
    assetMap$.next(new Map(assetMap$.value.set(asset.id, assetUpdate))); // note: new Map to enforce ref update
  });
};

/**
 * Observe YieldProtocol$ changes, and update map accordingly
 * 1. 'charge' asset list
 * 2. update asset list
 * */
yieldProtocol$
  .pipe(
    filter((protocol) => protocol.assetRootMap.size > 0),
    withLatestFrom(provider$)
  )
  .subscribe(async ([_protocol, _provider]: [IYieldProtocol, ethers.providers.BaseProvider]) => {
    /* 'Charge' all the assets (using the current provider) */
    const chargedList = Array.from(_protocol.assetRootMap.values()).map((a: IAssetRoot) => _chargeAsset(a, _provider));
    /* Update the assets with dynamic/user data */
    await updateAssets(chargedList);
    sendMsg({ message: 'Strategies Loaded', type: MessageType.INTERNAL });
  });
// .unsubscribe() ??

/**
 * Observe provider$ changes, and update map accordingly ('charge assets/series' with live contracts & listeners )
 * 1. 'Charge asset' with latest provider info for each
 * 2. Set as new assetMap$
 * */
provider$
  .pipe(
    withLatestFrom(assetMap$),
    /* only proceed if a valid provider and map has elements */
    filter(([prov, aMap]) => ethers.providers.BaseProvider.isProvider(prov) && aMap.size > 0)
  )
  .subscribe(([provider, assetMap]) => {
    assetMap.forEach((v: IAssetRoot, k: string, m: Map<string, IAssetRoot>) => {
      m.set(k, _chargeAsset(v, provider));
    });
    assetMap$.next(assetMap);
  });

/**
 * Observe Account$ changes ('update dynamic/User Data')
 * */
account$
  .pipe(
    withLatestFrom(assetMap$),
    skip(1)
    // filter( (acc) => acc !== undefined )
  )
  .subscribe(([account]) => {
    console.log('account changed:', account);
    updateAssets();
  });

/* Add on extra/calculated ASSET info, contract instances and methods (note: no async ) */
const _chargeAsset = (asset: any, provider: ethers.providers.BaseProvider): IAsset => {
  /* add any asset listeners required */

  /* attach either contract, (or contract of the wrappedToken ) */
  let assetContract: Contract;
  let getBalance: (acc: string, asset?: string) => Promise<BigNumber>;
  let getAllowance: (acc: string, spender: string, asset?: string) => Promise<BigNumber>;

  // TODO: refactor this
  switch (asset.tokenType) {
    case TokenType.ERC20_:
      assetContract = contracts.ERC20__factory.connect(asset.address, provider);
      getBalance = async (acc) =>
        ETH_BASED_ASSETS.includes(asset.proxyId) ? provider?.getBalance(acc) : assetContract.balanceOf(acc);
      getAllowance = async (acc: string, spender: string) => assetContract.allowance(acc, spender);
      break;

    case TokenType.ERC1155_:
      assetContract = contracts.ERC1155__factory.connect(asset.address, provider);
      getBalance = async (acc) => assetContract.balanceOf(acc, asset.tokenIdentifier);
      getAllowance = async (acc: string, spender: string) => assetContract.isApprovedForAll(acc, spender);
      // setAllowance = async (spender: string) => {
      //   console.log(spender);
      //   console.log(asset.address);
      //   assetContract.setApprovalForAll(spender, true);
      // };
      break;

    default:
      // Default is a ERC20Permit;
      assetContract = contracts.ERC20Permit__factory.connect(asset.address, provider);
      getBalance = async (acc) =>
        ETH_BASED_ASSETS.includes(asset.id) ? provider?.getBalance(acc) : assetContract.balanceOf(acc);
      getAllowance = async (acc: string, spender: string) => assetContract.allowance(acc, spender);
      break;
  }

  return {
    ...asset,
    /* Attach the asset contract */
    assetContract,
    /* re-add in the wrap handler addresses when charging, because cache doesn't preserve map */
    wrapHandlerAddresses: ASSETS.get(asset.id)?.wrapHandlerAddresses,
    unwrapHandlerAddresses: ASSETS.get(asset.id)?.unwrapHandlerAddresses,
    /* attach the various functions required */
    getBalance,
    getAllowance,
  };
};

const _updateAsset = async (asset: IAsset, account?: string | undefined): Promise<IAsset> => {
  /* Setup users asset info  */
  const balance = asset.name !== 'UNKNOWN' && account ? await asset.getBalance(account) : ZERO_BN;
  return {
    ...asset,
    balance,
    balance_: truncateValue(ethers.utils.formatUnits(balance, asset.decimals), 2), // for display purposes only
  };
};
