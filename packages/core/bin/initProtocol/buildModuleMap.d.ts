import { Contract, ethers } from 'ethers';
export declare const buildModuleMap: (provider: ethers.providers.BaseProvider, chainId: number) => Map<string, Contract>;
