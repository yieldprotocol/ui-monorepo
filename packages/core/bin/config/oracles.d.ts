interface IOracleAddress {
    CompoundMultiOracle?: string;
    ChainlinkMultiOracle?: string;
    CompositeMultiOracle?: string;
    YearnVaultMultiOracle?: string;
    NotionalMultiOracle?: string;
    ChainlinkUSDOracle?: string;
    AccumulatorOracle?: string;
}
export declare const oracleAddresses: Map<number, IOracleAddress>;
export declare const ORACLES: Map<number, Map<string, Map<string, string>>>;
export {};
