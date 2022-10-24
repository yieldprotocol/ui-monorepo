import { BehaviorSubject, Observable, withLatestFrom, filter, shareReplay } from 'rxjs';
import { BigNumber, Contract, ethers } from 'ethers';

import { IAssetRoot, TokenType, W3bNumber } from '../types';
import { accountø, providerø } from './connection';
import { protocolø } from './protocol';

import * as contracts from '@yield-protocol/ui-contracts';
import { ASSETS } from '../config/assets';
import { ZERO_BN } from '../utils/constants';
import { MessageType, sendMsg } from './messages';
import { bnToW3bNumber } from '../utils/yieldUtils';


export interface IAsset extends IAssetRoot {
  /*  'Charged' items */
  assetContract: Contract;
  isYieldBase: boolean; // Needs to be checked on 'charging' because new series can be added

  /*  Baked in token fns */
  getBalance: (account: string) => Promise<BigNumber>;
  getAllowance: (account: string, spender: string) => Promise<BigNumber>;
  setAllowance?: (spender: string) => Promise<BigNumber | void>;

  /* User specific */
  balance: W3bNumber;
}

const assetMap$: BehaviorSubject<Map<string, IAsset>> = new BehaviorSubject(new Map([]));

/** Unsubscribed Assetmap observable exposed for distribution */
export const assetsø: Observable<Map<string, IAsset>> = assetMap$.pipe(shareReplay(1));

/**
 * Update Assets function
 * @param assetList  list of assets to update
 * @param account optional: account in use
 */
export const updateAssets = async (assetList?: IAsset[], account?: string) => {
  /* if passed an empty list, update ALL assets in the assetMap$ subject */
  const list = assetList?.length ? assetList : Array.from(assetMap$.value.values());
  await Promise.all(
    list.map(async (asset: IAsset) => {
      /* if there is an account update the asset balance */ 
      if ( account ){
        const balance_ = asset.name !== 'UNKNOWN' ? await asset.getBalance(account) : ZERO_BN;
        const assetWithBalance = {...asset, balance : bnToW3bNumber( balance_, asset.decimals, 2 ) } 
        assetMap$.next(new Map(assetMap$.value.set(asset.id, assetWithBalance))); // note: new Map to enforce ref update
      } else {
        assetMap$.next(new Map(assetMap$.value.set(asset.id, asset))); // note: new Map to enforce ref update
      }
    })
  );
};

/**
 * Observe protocolø changes, and update map accordingly
 * 1. 'charge' asset list
 * 2. update asset list
 * */
protocolø
  .pipe(
    filter((protocol) => protocol.assetRootMap.size > 0),
    withLatestFrom( providerø, accountø,)
  )
  .subscribe(
    async ([_protocol, _provider, _account]) => {
      /* 'Charge' all the assets (using the current provider) */
      const chargedList = Array.from(_protocol.assetRootMap.values()).map((a: IAssetRoot) =>
        _chargeAsset(a, _provider)
      );
      /* Update the assets with dynamic/user data */
      await updateAssets(chargedList, _account);
      console.log('Asset loading complete.');
      sendMsg({ message: 'Assets Loaded.', type: MessageType.INTERNAL, id: 'assetsLoaded' });
    }
  );

/**
 * Observe Accountø changes ('update dynamic/User Data')
 * */
 accountø.pipe(withLatestFrom(assetsø)).subscribe(async ([account, assetMap ]) => {
  if (account && assetMap.size) { 
    await updateAssets( Array.from(assetMap.values()), account);
    console.log('Assets updated with new account balances');
    sendMsg({message:'Asset account balances updated.', type: MessageType.INTERNAL, origin:'assetMap'})
  };
});


/**
 * 
 * Add on extra/calculated ASSET info, live contract instances and methods (nb note: NOTHING ASYNC ) + add listners 
 * 
 * */
const _chargeAsset = (asset: any, provider: ethers.providers.BaseProvider): IAsset => {
  /* add any asset listeners required */

  /* attach either contract, (or contract of the wrappedToken ) */
  let assetContract: Contract;
  let getBalance: (acc: string, asset?: string) => Promise<BigNumber>;
  let getAllowance: (acc: string, spender: string, asset?: string) => Promise<BigNumber>;

  // TODO: possibly refactor this?
  switch (asset.tokenType) {

    case TokenType.Native_Token:
      assetContract = contracts.ERC20__factory.connect(asset.assetAddress, provider); // alhtough it doesn't do anything for a native token
      getBalance = async (acc) => provider?.getBalance(acc);
      getAllowance = async (acc) => provider?.getBalance(acc);
      break;

    case TokenType.ERC20:
      assetContract = contracts.ERC20__factory.connect(asset.assetAddress, provider);
      getBalance = async (acc) => assetContract.balanceOf(acc);
      getAllowance = async (acc: string, spender: string) => assetContract.allowance(acc, spender);
      break;

    case TokenType.ERC1155:
      assetContract = contracts.ERC1155__factory.connect(asset.assetAddress, provider);
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
      assetContract = contracts.ERC20Permit__factory.connect(asset.assetAddress, provider);
      getBalance = async (acc) => assetContract.balanceOf(acc);
      getAllowance = async (acc: string, spender: string) => assetContract.allowance(acc, spender);
      break;
  }

  return {
    ...asset,  

    /* Attach the asset contract */
    assetContract,
    
    /* Attach the various functions required */
    getBalance,
    getAllowance,
  };
};
