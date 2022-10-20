import { ethers } from 'ethers';
export declare const MAX_256 = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
export declare const MAX_128 = "0xffffffffffffffffffffffffffffffff";
export declare const ZERO_BN: ethers.BigNumber;
export declare const ZERO_W3B: {
    big: ethers.BigNumber;
    hStr: string;
    dsp: number;
};
export declare const ONE_BN: ethers.BigNumber;
export declare const MINUS_ONE_BN: ethers.BigNumber;
export declare const WAD_RAY_BN: ethers.BigNumber;
export declare const WAD_BN: ethers.BigNumber;
export declare const SECONDS_PER_YEAR: number;
export declare const ETH_BYTES: string;
export declare const CHAI_BYTES: string;
export declare const CHI: string;
export declare const RATE: string;
export declare const BLANK_ADDRESS = "0x0000000000000000000000000000000000000000";
export declare const BLANK_VAULT = "0x000000000000000000000000";
export declare const BLANK_SERIES = "0x000000000000";
export declare const IGNORED_CALLDATA: {
    operation: string;
    args: any[];
    ignoreIf: boolean;
};
export declare const ETHEREUM = "ETHEREUM";
export declare const ARBITRUM = "ARBITRUM";
export declare const OPTIMISM = "OPTIMISM";
