import { IAssetInfo } from '../config';
import { ISignable } from '../types';
export interface IAssetRoot extends IAssetInfo, ISignable {
    id: string;
    tokenIdentifier: string | undefined;
    displayName: string;
    displayNameMobile: string;
    isYieldBase: boolean;
    displaySymbol: string;
    limitToSeries: string[];
    wrapHandlerAddress: string | undefined;
    unwrapHandlerAddress: string | undefined;
    isWrappedToken: boolean;
    wrappingRequired: boolean;
    proxyId: string;
}
export declare const buildAssetMap: (chainId: number) => Promise<Map<string, IAssetRoot>>;
