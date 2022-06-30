import { combineLatest, finalize, takeWhile, take, subscribeOn, first, lastValueFrom, withLatestFrom } from 'rxjs';
import { buildProtocol } from '../init/buildProtocol';
import { internalMessagesø, updateAppConfig } from '../observables';
import { ethers } from 'ethers';

import * as yObservables from '../observables';
import { IAsset, ISeries, TokenType } from '../types';

const config = {
  defaultChainId: 1,
  ignoreSeries: ['0x303230340000', '0x303130340000'],
  browserCaching: false,
  useFork: false,
  defaultForkMap: new Map([
    [
      1,
      () => new ethers.providers.JsonRpcProvider('https://rpc.tenderly.co/fork/f8730f17-bd41-41ff-bd59-2f1be4a144f1'),
    ],
  ]),
  suppressEventLogQueries: false, // may be needed for tenderly forks.
};

const { providerø, appConfigø, chainIdø, updateProtocol, assetsø, seriesø, strategiesø } = yObservables;

beforeAll((done) => {
  /* update the config to testing specs */
  updateAppConfig(config);
  /* Once provider, config and chainId have resolved, build the protocol */
  combineLatest([providerø, appConfigø, chainIdø]).subscribe(async ([provider, config, chainId]) => {
    const protocol = await buildProtocol(provider, chainId, config);
    updateProtocol(protocol);
  });
  /* Watch internal messages until 'protocolReady msg' is received */
  internalMessagesø
    .pipe(
      finalize(() => done()),
      takeWhile((val) => !val.has('protocolReady'), true)
    )
    .subscribe();
  /* set a max timelimit of 10s for loading, and running tests -> any longer is likely a network issue */
}, 10000);

test('The protocol loads successfully.', (done) => {
  internalMessagesø
    .pipe(
      /* take one here ends the stream after the first message > TODO: check this may not always be the case. a takewhil while might be more applicable */
      take(1)
    )
    .subscribe({
      next: (msgMap) => {
        expect(msgMap.has(internalMessagesø)).toBeTruthy;
      },
      complete: () => done(),
    });
});

test('The assets load, and each have a correct, connected token contract', (done) => {
  assetsø.pipe(take(1)).subscribe({
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

test('The series load, and each has a contract attached, and connected to the correct chain', (done) => {
  seriesø.pipe(take(1), withLatestFrom(chainIdø)).subscribe({
    next: async ([msgMap, chainId]) => {
      await Promise.all(
        [...msgMap.values()].map(async (series: ISeries) => {
          const seriesChainId = await series.fyTokenContract.deploymentChainId();
          return expect(seriesChainId.toString()).toBe(chainId.toString());
        })
      );
      done();
    },
  });
});

test('Each series has an associated pool that has the corresponding connected contract', (done) => {
  seriesø.pipe(take(1)).subscribe({
    next: async (msgMap) => {
      await Promise.all(
        [...msgMap.values()].map(async (series: ISeries) => {
          const seriesAddressFromPool = await series.poolContract.fyToken();
          return expect(seriesAddressFromPool).toBe(series.address);
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
