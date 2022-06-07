import { BehaviorSubject, Observable, share } from 'rxjs';
import { Contract } from 'ethers';
import { IAssetRoot, ISeriesRoot, IStrategyRoot, IYieldProtocol } from '../types';
import * as contracts from '../contracts';
import { appConfig$ } from './appConfig';

// TODO: try to get rid of this init?
const _blankProtocol = {
  protocolVersion: '0.0.0',
  chainId: 1,

  cauldron: contracts.Cauldron__factory.connect('', appConfig$.value.defaultProvider),
  ladle: contracts.Ladle__factory.connect('', appConfig$.value.defaultProvider),
  witch: contracts.Witch__factory.connect('', appConfig$.value.defaultProvider),

  oracleMap: new Map([]) as Map<string, Contract>,
  moduleMap: new Map([]) as Map<string, Contract>,

  assetRootMap: new Map([]) as Map<string, IAssetRoot>,
  seriesRootMap: new Map([]) as Map<string, ISeriesRoot>,
  strategyRootMap: new Map([]) as Map<string, IStrategyRoot>,
};

/** @internal */
export const yieldProtocol$ = new BehaviorSubject<IYieldProtocol>(_blankProtocol);
export const yieldProtocolø = yieldProtocol$.pipe(share());
export const updateYieldProtocol = (newProtocol: IYieldProtocol) => {
  yieldProtocol$.next(newProtocol); // update to whole new protocol
};
