import { Contract, ethers } from 'ethers';
export declare const buildOracleMap: (provider: ethers.providers.BaseProvider, chainId: number) => Map<string, Contract>;
