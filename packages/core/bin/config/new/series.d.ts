export interface ISeriesStatic {
    id: string;
    address: string;
    poolAddress: string;
    baseId: string;
    maturity: number;
    name: string;
    symbol: string;
    decimals: number;
    version: string;
    poolName: string;
    poolSymbol: string;
    poolVersion: string;
    ts: string;
    g1: string;
    g2: string;
}
declare const SERIES: Map<number, Map<string, ISeriesStatic>>;
export default SERIES;
