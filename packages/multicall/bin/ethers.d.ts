import DataLoader from "dataloader";
import { Contract } from "ethers";
import { FunctionFragment } from "ethers/lib/utils";
import { Multicall } from "./contracts";
export declare type ContractCall = {
    fragment: FunctionFragment;
    address: string;
    params: any[];
};
declare type TargetContract = Pick<Contract, "functions" | "interface" | "callStatic" | "address">;
export declare class EthersMulticall {
    private multicall;
    private dataLoader;
    constructor(multicall: Multicall, dataLoaderOptions?: DataLoader.Options<ContractCall, any>);
    get contract(): Multicall;
    private doCalls;
    wrap<T extends TargetContract>(contract: T): T;
}
export default EthersMulticall;
