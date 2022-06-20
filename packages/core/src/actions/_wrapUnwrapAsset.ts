import { BigNumber, Contract } from 'ethers';
import { first, lastValueFrom } from 'rxjs';
import {accountProviderø, accountø, chainIdø, userSettingsø } from '../observables';
import { IAsset, ICallData, LadleActions, RoutedActions } from '../types';
import { ZERO_BN } from '../utils/constants';

const wrapHandlerAbi = ['function wrap(address to)', 'function unwrap(address to)'];

/**
 * @internal
 * */
export const wrapAsset = async (
  value: BigNumber,
  asset: IAsset,
  to?: string | undefined // optional send destination : DEFAULT is assetJoin address
): Promise<ICallData[]> => {

  const account = await lastValueFrom(accountø.pipe(first()));
  const chainId = await lastValueFrom(chainIdø.pipe(first()));
  const accountProvider = await lastValueFrom(accountProviderø.pipe(first())); //  await lastValueFrom(accountProviderø);

  // /* Get the signer from the accountProvider */
  const signer = accountProvider.getSigner(account);

  /* SET the destination address DEFAULTs to the assetJoin Address */
  const toAddress = to || asset.joinAddress;
  const wrapHandlerAddress = asset.wrapHandlerAddresses?.has(chainId)
    ? asset.wrapHandlerAddresses.get(chainId)
    : undefined;

  /* NB! IF a wraphandler exists, we assume that it is Yield uses the wrapped version of the token */
  if (wrapHandlerAddress && value.gt(ZERO_BN)) {
    const wrapHandlerContract: Contract = new Contract(wrapHandlerAddress, wrapHandlerAbi, signer ); 
    const { assetContract } = asset; // NOTE: -> this is NOT the proxyID

    console.log('Asset Contract to be signed for wrapping: ', assetContract.id);

    /* Gather all the required signatures - sign() processes them and returns them as ICallData types */
      // const permitCallData: ICallData[] = await sign(
      //   [
      //     {
      //       target: asset, // full target contract
      //       spender: ladleAddress,
      //       amount: value,
      //       ignoreIf: false,
      //     },
      //   ],
      //   processCode
      // );

    return [
      // ...permitCallData,
      {
        operation: LadleActions.Fn.TRANSFER,
        args: [asset.address, wrapHandlerAddress, value] as LadleActions.Args.TRANSFER,
        ignoreIf: false,
      },
      {
        operation: LadleActions.Fn.ROUTE,
        args: [toAddress] as RoutedActions.Args.WRAP,
        fnName: RoutedActions.Fn.WRAP,
        targetContract: wrapHandlerContract,
        ignoreIf: false,
      },
    ];
  }
  /* else if not a wrapped asset, (or value is 0) simply return empty array */
  return [];
};

/**
 * @internal
 * */
export const unwrapAsset = async (asset: IAsset, receiver: string ): Promise<ICallData[]> => {

  const userSettings = await lastValueFrom(userSettingsø.pipe(first()));
  const chainId = await lastValueFrom(chainIdø.pipe(first()));
  const { unwrapTokens } = userSettings;

  const unwrapHandlerAddress = asset.unwrapHandlerAddresses?.has(chainId)
    ? asset.unwrapHandlerAddresses.get(chainId)
    : undefined;

  /* if there is an unwrap handler we assume the token needs to be unwrapped  ( unless the 'unwrapTokens' setting is false) */
  if (unwrapTokens && unwrapHandlerAddress) {
    console.log('Unwrapping tokens before return');
    const unwraphandlerContract: Contract = new Contract(unwrapHandlerAddress, wrapHandlerAbi, ); // TODO: signer
    return [
      {
        operation: LadleActions.Fn.ROUTE,
        args: [receiver] as RoutedActions.Args.UNWRAP,
        fnName: RoutedActions.Fn.UNWRAP,
        targetContract: unwraphandlerContract,
        ignoreIf: false,
      },
    ];
  }

  /* Else return empty array */
  console.log('NOT unwrapping tokens before return');
  return [];
};
