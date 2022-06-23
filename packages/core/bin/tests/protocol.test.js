"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const rxjs_1 = require("rxjs");
const buildProtocol_1 = require("../initProtocol/buildProtocol");
const observables_1 = require("../observables");
const ethers_1 = require("ethers");
const yObservables = tslib_1.__importStar(require("../observables"));
const types_1 = require("../types");
const config = {
    defaultChainId: 1,
    ignoreSeries: ['0x303230340000', '0x303130340000'],
    browserCaching: false,
    useFork: false,
    defaultForkMap: new Map([
        [
            1,
            () => new ethers_1.ethers.providers.JsonRpcProvider('https://rpc.tenderly.co/fork/f8730f17-bd41-41ff-bd59-2f1be4a144f1'),
        ],
    ]),
    suppressEventLogQueries: false, // may be needed for tenderly forks.
};
const { providerø, appConfigø, chainIdø, updateProtocol, assetsø, seriesø, strategiesø } = yObservables;
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
    /* set a max timelimit of 10s for loading */
}, 10000);
test('The protocol loads successfully.', (done) => {
    observables_1.internalMessagesø.pipe(
    /* take one here ends the stream after the first message > TODO: check this may not always be the case. a takewhil while might be more applicable */
    (0, rxjs_1.take)(1)).subscribe({
        next: (msgMap) => {
            expect(msgMap.has(observables_1.internalMessagesø)).toBeTruthy;
        },
        complete: () => done(),
    });
});
test('The assets load, and each have a correct, connected token contract', (done) => {
    assetsø.pipe((0, rxjs_1.take)(1)).subscribe({
        next: (msgMap) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            yield Promise.all([...msgMap.values()].map((asset) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                /* check if contract is connected correctly for non-ERC1155 tokens */
                if (asset.tokenType === types_1.TokenType.ERC1155_) {
                    /* TODO: better check for other token types */
                    return expect(1).toBe(1);
                }
                else {
                    const symbolAsync = yield asset.assetContract.symbol();
                    return expect(symbolAsync).toBe(asset.symbol);
                }
            })));
            done();
        }),
    });
});
test('The series load, and ', (done) => {
    assetsø.pipe((0, rxjs_1.take)(1)).subscribe({
        next: (msgMap) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            yield Promise.all([...msgMap.values()].map((asset) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                /* check if contract is connected correctly for non-ERC1155 tokens */
                if (asset.tokenType === types_1.TokenType.ERC1155_) {
                    /* TODO: better check for other token types */
                    return expect(1).toBe(1);
                }
                else {
                    const symbolAsync = yield asset.assetContract.symbol();
                    return expect(symbolAsync).toBe(asset.symbol);
                }
            })));
            done();
        }),
    });
});
// afterAll( async () => {
//   const provider = await lastValueFrom(providerø.pipe(first()))
//   (provide
// })
//# sourceMappingURL=protocol.test.js.map