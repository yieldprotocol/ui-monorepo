import { BehaviorSubject, finalize, Observable, share, shareReplay, takeWhile, tap } from 'rxjs';
import { Contract, ethers } from 'ethers';
import { IAssetRoot, ISeriesRoot, IStrategyRoot, IYieldConfig, IYieldProtocol, MessageType } from '../types';
import * as contracts from '../contracts';
import { internalMessagesø, sendMsg } from './messages';

// TODO: try to get rid of this init?
const _blankProtocol = {
  protocolVersion: '0.0.0',

  cauldron: contracts.Cauldron__factory.connect('', new ethers.providers.JsonRpcProvider()) as contracts.Cauldron,
  ladle: contracts.Ladle__factory.connect('', new ethers.providers.JsonRpcProvider()) as contracts.Ladle,
  witch: contracts.Witch__factory.connect('', new ethers.providers.JsonRpcProvider()) as contracts.Witch,

  oracleMap: new Map([]) as Map<string, Contract>,
  moduleMap: new Map([]) as Map<string, Contract>,

  assetRootMap: new Map([]) as Map<string, IAssetRoot>,
  seriesRootMap: new Map([]) as Map<string, ISeriesRoot>,
  strategyRootMap: new Map([]) as Map<string, IStrategyRoot>,
};

/** @internal */
export const yieldProtocol$: BehaviorSubject<IYieldProtocol> = new BehaviorSubject(_blankProtocol);
export const yieldProtocolø: Observable<IYieldProtocol> = yieldProtocol$.pipe(shareReplay(1));
export const updateYieldProtocol = (newProtocol: IYieldProtocol) => {
  yieldProtocol$.next(newProtocol); // update to whole new protocol
};

/**
 *
 * Send a message when the protocol is 'ready'
 * Check the currnet network situation and timeout
 *
 * */
internalMessagesø
  .pipe(
    takeWhile(
      (msg) =>
        !(msg.has('assetsLoaded') && msg.has('seriesLoaded') && msg.has('strategiesLoaded')),
      true
    ),
    finalize(() => {
      sendMsg({ message: 'Protocol Ready', id: 'protocolReady', type: MessageType.INTERNAL });
      sendMsg({ message: 'Protocol Ready (custom wait 5000ms)', timeoutOverride: 5000 });
    })
  )
  .subscribe();
