import { combineLatest, finalize, takeWhile } from 'rxjs';
import { ethers } from 'ethers';

import { buildProtocol } from '../init/buildProtocol';
import { internalMessagesø, updateAppConfig } from '../observables';

import * as yObservables from '../observables';
import * as yActions from '../actions';
import { WETH } from '../config/assets';


const config = {
  defaultChainId: 1,
  ignoreSeries: ['0x303230340000', '0x303130340000'],
  browserCaching: false,
  useFork: true,
  // defaultForkMap: new Map([
  //   [
  //     1,
  //     () => new ethers.providers.JsonRpcProvider('https://rpc.tenderly.co/fork/62a98f8a-3297-409f-a5f2-bda4012d84cf'),
  //   ],
  // ]),
  suppressEventLogQueries: false, // may be needed for tenderly forks.
};

const { providerø, appConfigø, chainIdø, updateProtocol, assetsø, seriesø, strategiesø  } = yObservables;
const { borrow, addLiquidity, repayDebt } = yActions;

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


test('Liquidity can be added to all pools, with Borrow and Pool method', (done) => {

  seriesø.subscribe({
    next: async ( seriesMap ) => {
      await Promise.all(
        [...seriesMap.values()].map(async ( series ) => {
          yObservables.selectSeries(series);
          yObservables.selectIlk(WETH);
          await borrow('5000', '10', undefined ); 
          console.log( 'done')
        })
      );
      done();
    },
  });
});

test('Liquidity can be added to all pools, with Buy and Pool method', (done) => {
  done();
 });

 test('Minimum debt can be borrowed from all series - new vault', (done) => {
  done();
 });

 test('Debt can be borrowed from all series - exisiting vault', (done) => {
  done();
 });

 test('Max debt can be borrowed from all series', (done) => {
  done();
 });

 test('Debt can be repay from any vault', (done) => {
  done();
 });

// afterAll( async () => {
//   const provider = await lastValueFrom(providerø.pipe(first()))
//   (provide
// })
