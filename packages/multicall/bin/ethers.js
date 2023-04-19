"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthersMulticall = void 0;
const tslib_1 = require("tslib");
const dataloader_1 = tslib_1.__importDefault(require("dataloader"));
const ethers_1 = require("ethers");
const utils_1 = require("ethers/lib/utils");
// eslint-disable-next-line import/no-cycle
const contract_1 = require("./contract");
class EthersMulticall {
    constructor(multicall, dataLoaderOptions = {
        cache: false,
        maxBatchSize: 250,
    }) {
        this.multicall = multicall;
        this.dataLoader = new dataloader_1.default(this.doCalls.bind(this), dataLoaderOptions);
    }
    get contract() {
        return this.multicall;
    }
    doCalls(calls) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const callRequests = calls.map((call) => ({
                target: call.address,
                callData: new utils_1.Interface([]).encodeFunctionData(call.fragment, call.params),
            }));
            const response = yield this.multicall.callStatic.aggregate(callRequests, false);
            const result = calls.map((call, i) => {
                const signature = utils_1.FunctionFragment.from(call.fragment).format();
                const callIdentifier = [call.address, signature].join(":");
                const [success, data] = response.returnData[i];
                if (!success) {
                    return new Error(`Multicall call failed for ${callIdentifier}`);
                }
                try {
                    const outputs = call.fragment.outputs;
                    const _result = new utils_1.Interface([]).decodeFunctionResult(call.fragment, data);
                    return outputs.length === 1 ? _result[0] : _result;
                }
                catch (err) {
                    return new Error(`Multicall call failed for ${callIdentifier}`);
                }
            });
            return result;
        });
    }
    wrap(contract) {
        const abi = contract.interface.fragments;
        const multicallContract = new contract_1.MulticallContract(contract.address, abi);
        const funcs = abi.reduce((memo, frag) => {
            if (frag.type !== "function")
                return memo;
            const funcFrag = frag;
            if (!["pure", "view"].includes(funcFrag.stateMutability))
                return memo;
            // Overwrite the function with a dataloader batched call
            const multicallFunc = multicallContract[funcFrag.name].bind(multicallContract);
            const newFunc = (...args) => {
                const contractCall = multicallFunc(...args);
                return this.dataLoader.load(contractCall);
            };
            // eslint-disable-next-line no-param-reassign
            memo[funcFrag.name] = newFunc;
            return memo;
        }, {});
        return Object.setPrototypeOf(Object.assign(Object.assign({}, contract), funcs), ethers_1.Contract.prototype);
    }
}
exports.EthersMulticall = EthersMulticall;
exports.default = EthersMulticall;
//# sourceMappingURL=ethers.js.map