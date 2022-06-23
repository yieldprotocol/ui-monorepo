"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniswapV3Oracle__factory = void 0;
const ethers_1 = require("ethers");
const _abi = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes4",
                name: "role",
                type: "bytes4",
            },
            {
                indexed: true,
                internalType: "bytes4",
                name: "newAdminRole",
                type: "bytes4",
            },
        ],
        name: "RoleAdminChanged",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes4",
                name: "role",
                type: "bytes4",
            },
            {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
            },
        ],
        name: "RoleGranted",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes4",
                name: "role",
                type: "bytes4",
            },
            {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
            },
        ],
        name: "RoleRevoked",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint32",
                name: "secondsAgo",
                type: "uint32",
            },
        ],
        name: "SecondsAgoSet",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes6",
                name: "base",
                type: "bytes6",
            },
            {
                indexed: true,
                internalType: "bytes6",
                name: "quote",
                type: "bytes6",
            },
            {
                indexed: true,
                internalType: "address",
                name: "source",
                type: "address",
            },
        ],
        name: "SourceSet",
        type: "event",
    },
    {
        inputs: [],
        name: "LOCK",
        outputs: [
            {
                internalType: "bytes4",
                name: "",
                type: "bytes4",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "LOCK8605463013",
        outputs: [
            {
                internalType: "bytes4",
                name: "",
                type: "bytes4",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "ROOT",
        outputs: [
            {
                internalType: "bytes4",
                name: "",
                type: "bytes4",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "ROOT4146650865",
        outputs: [
            {
                internalType: "bytes4",
                name: "",
                type: "bytes4",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "base",
                type: "bytes32",
            },
            {
                internalType: "bytes32",
                name: "quote",
                type: "bytes32",
            },
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "get",
        outputs: [
            {
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "updateTime",
                type: "uint256",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes4",
                name: "role",
                type: "bytes4",
            },
        ],
        name: "getRoleAdmin",
        outputs: [
            {
                internalType: "bytes4",
                name: "",
                type: "bytes4",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes4",
                name: "role",
                type: "bytes4",
            },
            {
                internalType: "address",
                name: "account",
                type: "address",
            },
        ],
        name: "grantRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes4[]",
                name: "roles",
                type: "bytes4[]",
            },
            {
                internalType: "address",
                name: "account",
                type: "address",
            },
        ],
        name: "grantRoles",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes4",
                name: "role",
                type: "bytes4",
            },
            {
                internalType: "address",
                name: "account",
                type: "address",
            },
        ],
        name: "hasRole",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes4",
                name: "role",
                type: "bytes4",
            },
        ],
        name: "lockRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "base",
                type: "bytes32",
            },
            {
                internalType: "bytes32",
                name: "quote",
                type: "bytes32",
            },
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "peek",
        outputs: [
            {
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "updateTime",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes4",
                name: "role",
                type: "bytes4",
            },
            {
                internalType: "address",
                name: "account",
                type: "address",
            },
        ],
        name: "renounceRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes4",
                name: "role",
                type: "bytes4",
            },
            {
                internalType: "address",
                name: "account",
                type: "address",
            },
        ],
        name: "revokeRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes4[]",
                name: "roles",
                type: "bytes4[]",
            },
            {
                internalType: "address",
                name: "account",
                type: "address",
            },
        ],
        name: "revokeRoles",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "secondsAgo",
        outputs: [
            {
                internalType: "uint32",
                name: "",
                type: "uint32",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes4",
                name: "role",
                type: "bytes4",
            },
            {
                internalType: "bytes4",
                name: "adminRole",
                type: "bytes4",
            },
        ],
        name: "setRoleAdmin",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint32",
                name: "secondsAgo_",
                type: "uint32",
            },
        ],
        name: "setSecondsAgo",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes6",
                name: "base",
                type: "bytes6",
            },
            {
                internalType: "bytes6",
                name: "quote",
                type: "bytes6",
            },
            {
                internalType: "address",
                name: "source",
                type: "address",
            },
        ],
        name: "setSource",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes6",
                name: "",
                type: "bytes6",
            },
            {
                internalType: "bytes6",
                name: "",
                type: "bytes6",
            },
        ],
        name: "sources",
        outputs: [
            {
                internalType: "address",
                name: "source",
                type: "address",
            },
            {
                internalType: "bool",
                name: "inverse",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        name: "sourcesData",
        outputs: [
            {
                internalType: "address",
                name: "factory",
                type: "address",
            },
            {
                internalType: "address",
                name: "baseToken",
                type: "address",
            },
            {
                internalType: "address",
                name: "quoteToken",
                type: "address",
            },
            {
                internalType: "uint24",
                name: "fee",
                type: "uint24",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
];
class UniswapV3Oracle__factory {
    static createInterface() {
        return new ethers_1.utils.Interface(_abi);
    }
    static connect(address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    }
}
exports.UniswapV3Oracle__factory = UniswapV3Oracle__factory;
UniswapV3Oracle__factory.abi = _abi;
//# sourceMappingURL=UniswapV3Oracle__factory.js.map