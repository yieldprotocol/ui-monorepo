import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { ConvexLadleModule, ConvexLadleModuleInterface } from "../ConvexLadleModule";
export declare class ConvexLadleModule__factory {
    static readonly abi: ({
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
        anonymous?: undefined;
        name?: undefined;
        outputs?: undefined;
    } | {
        anonymous: boolean;
        inputs: {
            indexed: boolean;
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        type: string;
        stateMutability?: undefined;
        outputs?: undefined;
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
    static createInterface(): ConvexLadleModuleInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): ConvexLadleModule;
}
