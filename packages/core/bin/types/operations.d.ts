/// <reference types="node" />
import { BigNumberish } from 'ethers';
export declare namespace LadleActions {
    enum Fn {
        BUILD = "build",
        TWEAK = "tweak",
        GIVE = "give",
        DESTROY = "destroy",
        STIR = "stir",
        POUR = "pour",
        SERVE = "serve",
        ROLL = "roll",
        CLOSE = "close",
        REPAY = "repay",
        REPAY_VAULT = "repayVault",
        REPAY_LADLE = "repayLadle",
        REPAY_FROM_LADLE = "repayFromLadle",
        CLOSE_FROM_LADLE = "closeFromLadle",
        RETRIEVE = "retrieve",
        FORWARD_PERMIT = "forwardPermit",
        FORWARD_DAI_PERMIT = "forwardDaiPermit",
        JOIN_ETHER = "joinEther",
        EXIT_ETHER = "exitEther",
        TRANSFER = "transfer",
        ROUTE = "route",
        REDEEM = "redeem",
        MODULE = "moduleCall"
    }
    namespace Args {
        type BUILD = [seriesId_bytes6: string, ilkId_bytes6: string, salt_bytes8: string];
        type ROLL = [vaultId: string, newSeriesId: string, loan: BigNumberish, max: BigNumberish];
        type TWEAK = [vaultId: string, seriesId: string, ilkId: string];
        type GIVE = [vaultId: string, to: string];
        type DESTROY = [vaultId: string];
        type STIR = [from: string, to: string, ink: BigNumberish, art: BigNumberish];
        type POUR = [vaultId: string, to: string, ink: BigNumberish, art: BigNumberish];
        type SERVE = [vaultId: string, to: string, ink: BigNumberish, base: BigNumberish, max: BigNumberish];
        type CLOSE = [vaultId: string, to: string, ink: BigNumberish, art: BigNumberish];
        type REPAY = [vaultId: string, to: string, ink: BigNumberish, min: BigNumberish];
        type REPAY_VAULT = [vaultId: string, to: string, ink: BigNumberish, max: BigNumberish];
        type REPAY_LADLE = [vaultId: string];
        type RETRIEVE = [assetId: string, isAsset: boolean, to: string];
        type REPAY_FROM_LADLE = [vaultId: string, to: string];
        type CLOSE_FROM_LADLE = [vaultId: string, to: string];
        type JOIN_ETHER = [etherId: string, overrides?: any];
        type EXIT_ETHER = [to: string];
        type TRANSFER = [token: string, receiver: string, wad: BigNumberish];
        type REDEEM = [seriesId: string, to: string, wad: BigNumberish];
        type FORWARD_PERMIT = [
            token: string,
            spender: string,
            amount: BigNumberish,
            deadline: BigNumberish,
            v: BigNumberish,
            r: Buffer,
            s: Buffer
        ];
        type FORWARD_DAI_PERMIT = [
            token: string,
            spender: string,
            nonce: BigNumberish,
            deadline: BigNumberish,
            approved: boolean,
            v: BigNumberish,
            r: Buffer,
            s: Buffer
        ];
        type ROUTE = [targetAddress: string, encodedCall: string];
        type MODULE = [targetAddress: string, encodedCall: string];
    }
}
export declare namespace RoutedActions {
    enum Fn {
        SELL_BASE = "sellBase",
        SELL_FYTOKEN = "sellFYToken",
        MINT_POOL_TOKENS = "mint",
        BURN_POOL_TOKENS = "burn",
        MINT_WITH_BASE = "mintWithBase",
        BURN_FOR_BASE = "burnForBase",
        MINT_STRATEGY_TOKENS = "mint",
        BURN_STRATEGY_TOKENS = "burn",
        WRAP = "wrap",
        UNWRAP = "unwrap",
        CHECKPOINT = "checkpoint"
    }
    namespace Args {
        type SELL_BASE = [receiver: string, min: BigNumberish];
        type SELL_FYTOKEN = [receiver: string, min: BigNumberish];
        type MINT_POOL_TOKENS = [to: string, remainderTo: string, minRatio: BigNumberish, maxRatio: BigNumberish];
        type BURN_POOL_TOKENS = [baseTo: string, fyTokenTo: string, minRatio: BigNumberish, maxRatio: BigNumberish];
        type MINT_WITH_BASE = [
            to: string,
            remainderTo: string,
            fyTokenToBuy: BigNumberish,
            minRatio: BigNumberish,
            maxRatio: BigNumberish
        ];
        type BURN_FOR_BASE = [receiver: string, minRatio: BigNumberish, maxRatio: BigNumberish];
        type MINT_STRATEGY_TOKENS = [receiver: string];
        type BURN_STRATEGY_TOKENS = [receiver: string];
        type WRAP = [receiver: string];
        type UNWRAP = [receiver: string];
        type CHECKPOINT = [vaultOwner: string];
    }
}
export declare namespace ModuleActions {
    enum Fn {
        WRAP_ETHER = "wrap",
        ADD_CONVEX_VAULT = "addVault"
    }
    namespace Args {
        type WRAP_ETHER = [receiver: string, amount: BigNumberish];
        type ADD_CONVEX_VAULT = [convexJoin: string, vaultId: string];
    }
}
