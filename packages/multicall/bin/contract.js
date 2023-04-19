"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MulticallContract = void 0;
const abi_1 = require("@ethersproject/abi");
class MulticallContract {
    constructor(address, abi) {
        this._address = address;
        this._abi = abi.map((item) => abi_1.Fragment.from(item));
        this._functions = this._abi
            .filter((x) => x.type === "function")
            .map((x) => abi_1.FunctionFragment.from(x));
        const fragments = this._functions.filter((x) => x.stateMutability === "pure" || x.stateMutability === "view");
        for (const frag of fragments) {
            const fn = (...params) => ({
                fragment: frag,
                address,
                params,
            });
            if (!this[frag.name])
                Object.defineProperty(this, frag.name, {
                    enumerable: true,
                    writable: false,
                    value: fn,
                });
        }
    }
    get address() {
        return this._address;
    }
    get abi() {
        return this._abi;
    }
    get functions() {
        return this._functions;
    }
}
exports.MulticallContract = MulticallContract;
//# sourceMappingURL=contract.js.map