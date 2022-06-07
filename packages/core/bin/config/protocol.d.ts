interface YieldBaseAddresses {
    Cauldron: string;
    Ladle: string;
    Witch: string;
}
interface YieldModuleAddresses {
    WrapEtherModule: string;
    transfer1155Module?: string;
    ConvexLadleModule?: string;
}
export declare const supportedChains: Map<string, number[]>;
export declare const baseAddresses: Map<number, YieldBaseAddresses>;
export declare const moduleAddresses: Map<number, YieldModuleAddresses>;
export declare const strategyAddresses: Map<number, string[]>;
export {};
