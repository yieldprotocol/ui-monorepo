"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const rxjs_1 = require("rxjs");
const buildProtocol_1 = require("../initProtocol/buildProtocol");
const observables_1 = require("../observables");
const yObservables = tslib_1.__importStar(require("../observables"));
const yActions = tslib_1.__importStar(require("../actions"));
const assets_1 = require("../config/assets");
const config = {
    defaultChainId: 1,
    ignoreSeries: ['0x303230340000', '0x303130340000'],
    browserCaching: false,
    useFork: true,
    // defaultForkMap: new Map([
    //   [
    //     1,
    //     () => new ethers.providers.JsonRpcProvider('https://rpc.tenderly.co/fork/f8730f17-bd41-41ff-bd59-2f1be4a144f1'),
    //   ],
    // ]),
    suppressEventLogQueries: false, // may be needed for tenderly forks.
};
const { providerø, appConfigø, chainIdø, updateProtocol, assetsø, seriesø, strategiesø } = yObservables;
const { borrow, addLiquidity, repayDebt } = yActions;
beforeAll((done) => {
    /* update the config to testing specs */
    (0, observables_1.updateAppConfig)(config);
    /* Once provider, config and chainId have resolved, build the protocol */
    (0, rxjs_1.combineLatest)([providerø, appConfigø, chainIdø]).subscribe(([provider, config, chainId]) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const protocol = yield (0, buildProtocol_1.buildProtocol)(provider, chainId, config);
        updateProtocol(protocol);
    }));
    /* Watch internal messages until 'protocolReady msg' is received */
    observables_1.internalMessagesø
        .pipe((0, rxjs_1.finalize)(() => done()), (0, rxjs_1.takeWhile)((val) => !val.has('protocolReady'), true))
        .subscribe();
    /* set a max timelimit of 10s for loading, and running tests -> any longer is likely a network issue loading the protocol */
}, 10000);
test('Liquidity can be added to all pools, with Borrow and Pool method', (done) => {
    (0, rxjs_1.combineLatest)([providerø, appConfigø, chainIdø]).subscribe(([provider, config, chainId]) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const protocol = yield (0, buildProtocol_1.buildProtocol)(provider, chainId, config);
        updateProtocol(protocol);
    }));
    seriesø.subscribe({
        next: (seriesMap) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            yield Promise.all([...seriesMap.values()].map((series) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yObservables.selectSeries(series);
                yObservables.selectIlk(assets_1.WETH);
                yield borrow('5000', '10', undefined);
                console.log('done');
            })));
            done();
        }),
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
//# sourceMappingURL=actions.test.js.map