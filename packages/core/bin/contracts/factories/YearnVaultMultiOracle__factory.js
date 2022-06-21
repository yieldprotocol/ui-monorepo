"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.YearnVaultMultiOracle__factory = void 0;
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
                internalType: "bytes6",
                name: "baseId",
                type: "bytes6",
            },
            {
                indexed: true,
                internalType: "bytes6",
                name: "quoteId",
                type: "bytes6",
            },
            {
                indexed: true,
                internalType: "address",
                name: "source",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint8",
                name: "decimals",
                type: "uint8",
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
                name: "baseId",
                type: "bytes32",
            },
            {
                internalType: "bytes32",
                name: "quoteId",
                type: "bytes32",
            },
            {
                internalType: "uint256",
                name: "amountBase",
                type: "uint256",
            },
        ],
        name: "get",
        outputs: [
            {
                internalType: "uint256",
                name: "amountQuote",
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
                name: "baseId",
                type: "bytes32",
            },
            {
                internalType: "bytes32",
                name: "quoteId",
                type: "bytes32",
            },
            {
                internalType: "uint256",
                name: "amountBase",
                type: "uint256",
            },
        ],
        name: "peek",
        outputs: [
            {
                internalType: "uint256",
                name: "amountQuote",
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
                internalType: "bytes6",
                name: "vaultTokenId",
                type: "bytes6",
            },
            {
                internalType: "bytes6",
                name: "underlyingId",
                type: "bytes6",
            },
            {
                internalType: "contract IYvToken",
                name: "vaultToken",
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
                internalType: "uint8",
                name: "decimals",
                type: "uint8",
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
];
class YearnVaultMultiOracle__factory {
    static createInterface() {
        return new ethers_1.utils.Interface(_abi);
    }
    static connect(address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    }
}
exports.YearnVaultMultiOracle__factory = YearnVaultMultiOracle__factory;
YearnVaultMultiOracle__factory.abi = _abi;
//# sourceMappingURL=YearnVaultMultiOracle__factory.js.map