import { BigNumber } from "ethers";
import { Observable } from "rxjs";
export declare const maximumAddLiquidityø: Observable<BigNumber>;
export declare const maximumRemoveLiquidityø: Observable<BigNumber>;
export declare const hasMatchingVaultø: Observable<boolean>;
export declare const isBuyAndPoolPossibleø: Observable<boolean>;
export declare const isPartialRemoveRequiredø: Observable<boolean>;
/**
 *
 * Indicates the amount of [0] Base and [1] fyTokens that will be returned when partially removing liquidity tokens
 *
 * */
export declare const partialRemoveReturnø: Observable<BigNumber[]>;
