import { JsonRpcProvider } from "@ethersproject/providers";
import EthersMulticall from "./ethers";
export declare class MulticallService {
    private readonly provider;
    constructor(provider: JsonRpcProvider);
    getMulticall(chainId: number): EthersMulticall;
}
