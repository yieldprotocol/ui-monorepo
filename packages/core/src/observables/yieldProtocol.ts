import { BehaviorSubject, Observable, share } from "rxjs";
import { Contract } from "ethers";
import { IAssetRoot, ISeriesRoot, IStrategyRoot, IYieldProtocol } from "../types";
import * as contracts from '../contracts';
import { appConfig$ } from "./appConfig";

// TODO: try to get rid of this init? 
const _blankProtocol = {
  protocolVersion: '0.0.0',

  cauldron: contracts.Cauldron__factory.connect('', appConfig$.value.defaultProvider) as contracts.Cauldron,
  ladle: contracts.Ladle__factory.connect('', appConfig$.value.defaultProvider) as contracts.Ladle,
  witch: contracts.Witch__factory.connect('', appConfig$.value.defaultProvider) as contracts.Witch,

  oracleMap: new Map([]) as Map<string, Contract>,
  moduleMap: new Map([]) as Map<string, Contract>,

  assetRootMap: new Map([])as Map<string, IAssetRoot>,
  seriesRootMap: new Map([])as Map<string, ISeriesRoot>,
  strategyRootMap: new Map([])as Map<string, IStrategyRoot>,

}

/** @internal */
export const yieldProtocol$: BehaviorSubject<IYieldProtocol> = new BehaviorSubject( _blankProtocol );
export const yieldProtocolø: Observable<IYieldProtocol> = yieldProtocol$.pipe(share());
export const updateYieldProtocol = (newProtocol: IYieldProtocol) => {
  yieldProtocol$.next(newProtocol); // update to whole new protocol
};
