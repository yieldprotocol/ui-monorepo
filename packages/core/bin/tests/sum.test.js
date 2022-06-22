"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const rxjs_1 = require("rxjs");
const buildProtocol_1 = require("../initProtocol/buildProtocol");
const yieldObservables = tslib_1.__importStar(require("../observables"));
const observables_1 = require("../observables");
const ethers_1 = require("ethers");
jest.setTimeout(20000);
const config = {
    defaultProviderMap: new Map([[1, () => new ethers_1.ethers.providers.InfuraProvider(1, 'de43fd0c912d4bdc94712ab4b37613ea')]]),
    defaultChainId: 1,
    ignoreSeries: ['0x303230340000', '0x303130340000'],
    browserCaching: false,
    useFork: false,
    defaultForkMap: new Map([
        [1, () => new ethers_1.ethers.providers.JsonRpcProvider('https://rpc.tenderly.co/fork/f8730f17-bd41-41ff-bd59-2f1be4a144f1')],
    ]),
    suppressEventLogQueries: false,
};
beforeAll((done) => {
    console.log('Loading Protocol...');
    (0, observables_1.updateAppConfig)(config);
    (0, rxjs_1.combineLatest)([yieldObservables.providerø, yieldObservables.appConfigø, yieldObservables.chainIdø]).subscribe(([provider, config, chainId]) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const protocol = yield (0, buildProtocol_1.buildProtocol)(provider, chainId, config);
        yieldObservables.updateYieldProtocol(protocol);
    }));
    observables_1.internalMessagesø
        .pipe((0, rxjs_1.finalize)(() => done()), (0, rxjs_1.takeWhile)((val) => !val.has('protocolReady'), true))
        .subscribe((val) => console.log('message: ', val));
});
test('The protocol should have loaded successfully.', (done) => {
    observables_1.internalMessagesø
        .pipe((0, rxjs_1.take)(1))
        .subscribe({
        next: msgMap => {
            expect(msgMap.has(observables_1.internalMessagesø)).toBeTruthy;
        },
        complete: () => done(),
    });
});
// afterAll( async () => { 
//   const provider = await lastValueFrom(providerø.pipe(first())) 
//   (provide
// })
//# sourceMappingURL=sum.test.js.map