export declare const RPC_URLS: {
    [chainId: number]: string;
};
export declare const SUPPORTED_RPC_URLS: {
    [chainId: number]: string;
};
export declare const SUPPORTED_CHAIN_IDS: number[];
interface INativeCurrency {
    name: string;
    symbol: string;
    decimals: 18;
}
interface IChainInfo {
    name: string;
    color: string;
    colorSecondary?: string;
    bridge?: string;
    explorer?: string;
    rpcUrl?: string;
    nativeCurrency?: INativeCurrency;
}
export declare const CHAIN_INFO: Map<number, IChainInfo>;
export {};
