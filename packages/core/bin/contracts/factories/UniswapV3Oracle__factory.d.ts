import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { UniswapV3Oracle, UniswapV3OracleInterface } from "../UniswapV3Oracle";
export declare class UniswapV3Oracle__factory {
    static readonly abi: ({
        anonymous: boolean;
        inputs: {
            indexed: boolean;
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        type: string;
        outputs?: undefined;
        stateMutability?: undefined;
    } | {
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        outputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
        anonymous?: undefined;
    })[];
    static createInterface(): UniswapV3OracleInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): UniswapV3Oracle;
}
