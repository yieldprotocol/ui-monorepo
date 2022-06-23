import { combineLatest, finalize, takeWhile, take, subscribeOn, first, lastValueFrom } from 'rxjs';
import { buildProtocol } from '../initProtocol/buildProtocol';
import { internalMessagesø, updateAppConfig } from '../observables';
import { ethers } from 'ethers';

import * as yieldObservables from '../observables';
import { IAsset, TokenType } from '../types';

const config = {
  defaultChainId: 1,
  ignoreSeries: ['0x303230340000', '0x303130340000'],
  browserCaching: false,
  useFork: false,
  defaultForkMap: new Map([
    [
      1, () => new ethers.providers.JsonRpcProvider('https://rpc.tenderly.co/fork/f8730f17-bd41-41ff-bd59-2f1be4a144f1'),
    ],
  ]),
  suppressEventLogQueries: false, // may be needed for tenderly forks. 
};

const {providerø, appConfigø, chainIdø  } = yieldObservables

beforeAll((done) => {
  /* update the config to testing specs */
  updateAppConfig(config);
  /* Once provider, config and chainId have resolved, build the protocol */
  combineLatest([providerø, appConfigø,chainIdø]).subscribe(
    async ([provider, config, chainId]) => {
      const protocol = await buildProtocol(provider, chainId, config);
      yieldObservables.updateProtocol(protocol);
    }
  );
  /* Watch internal messages until 'protocolReady msg' is received */ 
  internalMessagesø
    .pipe(
      finalize(() => done()),
      takeWhile((val) => !val.has('protocolReady'), true)
    )
    .subscribe();
/* set a max timelimit of 10s for loading */ 
}, 10000);



test('The protocol should have loaded successfully.', (done) => {
  internalMessagesø.pipe(take(1)).subscribe({
    next: (msgMap) => {
      expect(msgMap.has(internalMessagesø)).toBeTruthy;
    },
    complete: () => done(),
  });
});

test('Each Asset has the correct connected token contract', (done) => {
  yieldObservables.assetsø.pipe(take(1)).subscribe({
    next: async (msgMap) => {
      await Promise.all(
        [...msgMap.values()].map(async (asset: IAsset) => {
          /* check if contract is connected correctly for non-ERC1155 tokens */
          if (asset.tokenType === TokenType.ERC1155_) {
            /* TODO: better check for other token types */
            return expect(1).toBe(1);
          } else {
            const symbolAsync = await asset.assetContract.symbol();
            return expect(symbolAsync).toBe(asset.symbol);
          }
        })
      );
      done();
    },
  });
});

// afterAll( async () => {
//   const provider = await lastValueFrom(providerø.pipe(first()))
//   (provide
// })
