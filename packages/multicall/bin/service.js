"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MulticallService = void 0;
const tslib_1 = require("tslib");
// eslint-disable-next-line import/no-named-as-default
const ethers_1 = tslib_1.__importDefault(require("./ethers"));
const addresses_1 = require("./addresses");
const contracts_1 = require("./contracts");
class MulticallService {
    constructor(provider) {
        this.provider = provider;
    }
    getMulticall(chainId) {
        const multicallAddress = addresses_1.MULTICALL_ADDRESSES[chainId || 1];
        if (!multicallAddress)
            throw new Error(`Multicall not supported on network id "${chainId}"`);
        const contract = contracts_1.Multicall__factory.connect(multicallAddress, this.provider);
        return new ethers_1.default(contract);
    }
}
exports.MulticallService = MulticallService;
//# sourceMappingURL=service.js.map