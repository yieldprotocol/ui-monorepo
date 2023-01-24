export declare enum StrategyType {
    V1 = "V1",
    V2 = "V2"
}
export interface StrategyInfo {
    address: string;
    type: StrategyType;
    associatedStrategy?: string;
    symbol?: string;
    name?: string;
    baseId?: string;
    decimals?: number;
    version?: string;
}
declare const STRATEGIES: Map<number, StrategyInfo[]>;
export default STRATEGIES;
