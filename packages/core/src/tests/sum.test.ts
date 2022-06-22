import { combineLatest, finalize, takeWhile, take, subscribeOn, first, lastValueFrom } from 'rxjs';
import { buildProtocol } from '../initProtocol/buildProtocol';
import * as yieldObservables from '../observables';
import { internalMessagesø, providerø, updateAppConfig } from '../observables';
import defaultConfig from '../config/yield.config';
import { ethers } from 'ethers';

jest.setTimeout(20000);

const config = {
  defaultProvider: new ethers.providers.InfuraProvider(1, 'de43fd0c912d4bdc94712ab4b37613ea'),
  defaultChainId: 1,
  ignoreSeries: ['0x303230340000', '0x303130340000'],

  browserCaching: false,

  useFork: false,
  defaultForkMap: new Map([
    [1, new ethers.providers.JsonRpcProvider('https://rpc.tenderly.co/fork/f8730f17-bd41-41ff-bd59-2f1be4a144f1')],
  ]),
  suppressEventLogQueries: false,
};


beforeAll((done) => {
  console.log('Loading Protocol...');

  updateAppConfig(config);
  combineLatest([yieldObservables.providerø, yieldObservables.appConfigø, yieldObservables.chainIdø]).subscribe(
    async ([provider, config, chainId]) => {
      const protocol = await buildProtocol(provider, chainId, config);
      yieldObservables.updateYieldProtocol(protocol);
    }
  )

  internalMessagesø
    .pipe(
      finalize( () => done() ),
      takeWhile((val) => !val.has('protocolReady'), true),
    )
    .subscribe( (val) => 
      console.log( 'message: ' , val)
    );
});

test('The protocol should have loaded successfully.', (done) => {
  internalMessagesø
  .pipe(take(1))
  .subscribe({
      next: msgMap => {
          expect(msgMap.has(internalMessagesø)).toBeTruthy
        },
      complete: () => done(),
  })
});

// afterAll( async () => { 
//   const provider = await lastValueFrom(providerø.pipe(first())) 
//   (provide
// })
