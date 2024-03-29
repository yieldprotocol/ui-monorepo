"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CVX3CRVOracle__factory = void 0;
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
                indexed: false,
                internalType: "bytes32",
                name: "cvx3CrvId_",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "bytes32",
                name: "ethId_",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "contract ICurvePool",
                name: "threecrv_",
                type: "address",
            },
            {
                indexed: false,
                internalType: "contract AggregatorV3Interface",
                name: "DAI_",
                type: "address",
            },
            {
                indexed: false,
                internalType: "contract AggregatorV3Interface",
                name: "USDC_",
                type: "address",
            },
            {
                indexed: false,
                internalType: "contract AggregatorV3Interface",
                name: "USDT_",
                type: "address",
            },
        ],
        name: "SourceSet",
        type: "event",
    },
    {
        inputs: [],
        name: "DAI",
        outputs: [
            {
                internalType: "contract AggregatorV3Interface",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
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
        inputs: [],
        name: "USDC",
        outputs: [
            {
                internalType: "contract AggregatorV3Interface",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "USDT",
        outputs: [
            {
                internalType: "contract AggregatorV3Interface",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "cvx3CrvId",
        outputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "ethId",
        outputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
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
                name: "baseAmount",
                type: "uint256",
            },
        ],
        name: "get",
        outputs: [
            {
                internalType: "uint256",
                name: "quoteAmount",
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
                name: "baseAmount",
                type: "uint256",
            },
        ],
        name: "peek",
        outputs: [
            {
                internalType: "uint256",
                name: "quoteAmount",
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
                internalType: "bytes32",
                name: "cvx3CrvId_",
                type: "bytes32",
            },
            {
                internalType: "bytes32",
                name: "ethId_",
                type: "bytes32",
            },
            {
                internalType: "contract ICurvePool",
                name: "threecrv_",
                type: "address",
            },
            {
                internalType: "contract AggregatorV3Interface",
                name: "DAI_",
                type: "address",
            },
            {
                internalType: "contract AggregatorV3Interface",
                name: "USDC_",
                type: "address",
            },
            {
                internalType: "contract AggregatorV3Interface",
                name: "USDT_",
                type: "address",
            },
        ],
        name: "setSource",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "threecrv",
        outputs: [
            {
                internalType: "contract ICurvePool",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
];
class CVX3CRVOracle__factory {
    static createInterface() {
        return new ethers_1.utils.Interface(_abi);
    }
    static connect(address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    }
}
exports.CVX3CRVOracle__factory = CVX3CRVOracle__factory;
CVX3CRVOracle__factory.abi = _abi;
//# sourceMappingURL=CVX3CRVOracle__factory.js.map