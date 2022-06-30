import { ethers, BigNumber, BigNumberish } from 'ethers';
import { Decimal } from 'decimal.js';
export declare const MAX_256 = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
export declare const MAX_128 = "0xffffffffffffffffffffffffffffffff";
export declare const ZERO_DEC: Decimal;
export declare const ONE_DEC: Decimal;
export declare const TWO_DEC: Decimal;
export declare const MAX_DEC: Decimal;
export declare const RAY_DEC: Decimal;
export declare const ZERO_BN: ethers.BigNumber;
export declare const ONE_BN: ethers.BigNumber;
export declare const MINUS_ONE_BN: ethers.BigNumber;
export declare const WAD_RAY_BN: ethers.BigNumber;
export declare const WAD_BN: ethers.BigNumber;
export declare const SECONDS_PER_YEAR: number;
export declare const secondsInOneYear: ethers.BigNumber;
export declare const secondsInTenYears: ethers.BigNumber;
export declare const k: Decimal;
export declare const g1_DEFAULT: Decimal;
export declare const g2_DEFAULT: Decimal;
export declare const c_DEFAULT = "0x10000000000000000";
export declare const mu_DEFAULT = "0x10000000000000000";
/** *************************
 Support functions
 *************************** */
/**
 * Convert a bignumber with any decimal to a bn with decimal of 18
 * @param x bn to convert.
 * @param decimals of the current bignumber
 * @returns BigNumber
 */
export declare const decimalNToDecimal18: (x: BigNumber, decimals: number) => BigNumber;
/**
 * Convert a decimal18 to a bn of any decimal
 * @param x 18 decimal to reduce
 * @param decimals required
 * @returns BigNumber
 */
export declare const decimal18ToDecimalN: (x: BigNumber, decimals: number) => BigNumber;
/**
 * TODO: maybe move this out to gerneral yieldUtils
 * Convert bytesX to bytes32 (BigEndian?)
 * @param x string to convert.
 * @param n current bytes value eg. bytes6 or bytes12
 * @returns string bytes32
 */
export declare function bytesToBytes32(x: string, n: number): string;
/**
 * TODO: Possibily move this out to general yieldUtils?
 * @param { BigNumber | string } to unix time
 * @param { BigNumber | string } from  unix time *optional* default: now
 * @returns { string } as number seconds 'from' -> 'to'
 */
export declare const secondsToFrom: (to: BigNumber | string, from?: BigNumber | string) => string;
/**
 * @param { BigNumber | string } value
 * @returns { string }
 */
export declare const floorDecimal: (value: BigNumber | string) => string;
/**
 * @param { Decimal } value
 * @returns { BigNumber }
 */
export declare const toBn: (value: Decimal) => BigNumber;
/**
 * Calculate the baseId from the series name
 * @param seriesId seriesID.
 * @returns string bytes32
 */
export declare function baseIdFromSeriesId(seriesId: string): string;
/**
 * @param { BigNumber | string } multiplicant
 * @param { BigNumber | string } multiplier
 * @param { string } precisionDifference  // Difference between multiplicant and mulitplier precision (eg. wei vs ray '1e-27' )
 * @returns { string } in decimal precision of the multiplicant
 */
export declare const mulDecimal: (multiplicant: BigNumber | string, multiplier: BigNumber | string, precisionDifference?: string) => string;
/**
 * @param  { BigNumber | string } numerator
 * @param { BigNumber | string } divisor
 * @param { BigNumber | string } precisionDifference // Difference between multiplicant and mulitplier precision (eg. wei vs ray '1e-27' )
 * @returns { string } in decimal precision of the numerator
 */
export declare const divDecimal: (numerator: BigNumber | string, divisor: BigNumber | string, precisionDifference?: string) => string;
/**
 * Converts c from 64 bit to a decimal like 1.1
 * @param c
 * @returns
 */
export declare const _getC: (c: BigNumber | string) => Decimal;
/** ************************
 YieldSpace functions
 *************************** */
/**
 * @param { BigNumber | string } sharesReserves
 * @param { BigNumber | string } fyTokenReserves
 * @param { BigNumber | string } totalSupply
 * @param { BigNumber | string } shares
 * @returns {[BigNumber, BigNumber]}
 *
 * https://www.desmos.com/calculator/mllhtohxfx
 */
export declare function mint(sharesReserves: BigNumber | string, fyTokenReserves: BigNumber | string, totalSupply: BigNumber | string, shares: BigNumber | string, fromBase?: boolean): [BigNumber, BigNumber];
/**
 * @param { BigNumber | string } sharesReserves
 * @param { BigNumber | string } fyTokenRealReserves
 * @param { BigNumber | string } totalSupply
 * @param { BigNumber | string } lpTokens
 * @returns {[BigNumber, BigNumber]}
 *
 * https://www.desmos.com/calculator/ubsalzunpo
 */
export declare function burn(sharesReserves: BigNumber | string, fyTokenRealReserves: BigNumber | string, totalSupply: BigNumber | string, lpTokens: BigNumber | string): [BigNumber, BigNumber];
/**
 *
 * @param { BigNumber | string } poolTotalSupply
 * @param { BigNumber | string } strategyTotalsupply
 * @param { BigNumber | string } strategyTokensToBurn
 *
 * @returns {BigNumber}
 *
 */
export declare function burnFromStrategy(poolTotalSupply: BigNumber | string, strategyTotalsupply: BigNumber | string, strategyTokensToBurn: BigNumber | string): BigNumber;
/**
 * @param { BigNumber } sharesReserves
 * @param { BigNumber } fyTokenReservesVirtual
 * @param { BigNumber } fyTokenReservesReal
 * @param { BigNumber | string } fyToken
 * @param { BigNumber | string } timeTillMaturity
 * @param { BigNumber | string } ts
 * @param { BigNumber | string } g1
 * @param { number } decimals
 * @param { BigNumber | string } c
 * @param { BigNumber | string } mu
 *
 * @returns {[BigNumber, BigNumber]}
 */
export declare function mintWithBase(sharesReserves: BigNumber, fyTokenReservesVirtual: BigNumber, fyTokenReservesReal: BigNumber, fyToken: BigNumber | string, timeTillMaturity: BigNumber | string, ts: BigNumber | string, g1: BigNumber | string, decimals: number, c?: BigNumber | string, mu?: BigNumber | string): [BigNumber, BigNumber];
/**
 * @param { BigNumber | string } sharesReserves
 * @param { BigNumber | string } fyTokenReservesVirtual
 * @param { BigNumber | string } fyTokenReservesReal
 * @param { BigNumber | string } lpTokens
 * @param { BigNumber | string } timeTillMaturity
 * @param { BigNumber | string } ts
 * @param { BigNumber | string } g2
 * @param { number } decimals
 * @param { BigNumber | string } c
 * @param { BigNumber | string } mu
 *
 * @returns { BigNumber }
 */
export declare function burnForBase(sharesReserves: BigNumber, fyTokenReservesVirtual: BigNumber, fyTokenReservesReal: BigNumber, lpTokens: BigNumber, timeTillMaturity: BigNumber | string, ts: BigNumber | string, g2: BigNumber | string, decimals: number, c?: BigNumber | string, mu?: BigNumber | string): BigNumber;
/**
 * Calculates the amount of fyToken a user would get for given amount of shares.
 * fyTokenOutForSharesIn
 * https://www.desmos.com/calculator/bdplcpol2y
 * @param { BigNumber | string } sharesReserves yield bearing vault shares reserve amount
 * @param { BigNumber | string } fyTokenReserves fyToken reserves amount
 * @param { BigNumber | string } sharesIn shares amount to be traded
 * @param { BigNumber | string } timeTillMaturity time till maturity in seconds
 * @param { BigNumber | string } ts time stretch
 * @param { BigNumber | string } g1 fee coefficient
 * @param { number } decimals pool decimals
 * @param { BigNumber | string } c price of shares in terms of their base in 64 bit
 * @param { BigNumber | string } mu (μ) Normalization factor -- starts as c at initialization in 64 bit
 *
 * @returns { BigNumber } fyTokenOut: the amount of fyToken a user would get for given amount of shares
 *
 * y = fyToken reserves
 * z = base reserves
 * x = Δz (sharesIn)
 *
 *      y - (                         sum                          )^(   invA   )
 *      y - ( (    Za        ) + (  Ya  ) - (       Zxa          ) )^(   invA   )
 * Δy = y - ( c/μ * (μz)^(1-t) +  y^(1-t) -  c/μ * (μz + μx)^(1-t) )^(1 / (1 - t)
 */
export declare function sellBase(sharesReserves: BigNumber | string, fyTokenReserves: BigNumber | string, sharesIn: BigNumber | string, timeTillMaturity: BigNumber | string, ts: BigNumber | string, g1: BigNumber | string, decimals: number, c?: BigNumber | string, mu?: BigNumber | string): BigNumber;
/**
 * Calculates the amount of shares a user would get for certain amount of fyToken.
 * sharesOutForFYTokenIn
 * https://www.desmos.com/calculator/mjzqajjsq6
 * @param { BigNumber | string } sharesReserves sharesReserves shares reserves amount
 * @param { BigNumber | string } fyTokenReserves fyTokenReserves fyToken reserves amount
 * @param { BigNumber | string } fyTokenIn fyToken amount to be traded
 * @param { BigNumber | string } timeTillMaturity time till maturity in seconds
 * @param { BigNumber | string } ts time stretch
 * @param { BigNumber | string } g2 fee coefficient
 * @param { number } decimals pool decimals
 * @param { BigNumber | string } c price of shares in terms of their base in 64 bit
 * @param { BigNumber | string } mu (μ) Normalization factor -- starts as c at initialization in 64 bit
 *
 * @returns { BigNumber } sharesOut: amount of shares a user would get for given amount of fyToken
 *
 * y = fyToken
 * z = vyToken
 * x = Δy
 *
 *      z - 1/μ * (                      sum                                      )^(   invA    )
 *      z - 1/μ * ( (       Za           ) + ( Ya  ) - (    Yxa    )  ) / (c / μ) )^(   invA    )
 * Δz = z - 1/μ * ( ( (c / μ) * (μz)^(1-t) + y^(1-t) - (y + x)^(1-t)  ) / (c / μ) )^(1 / (1 - t))
 */
export declare function sellFYToken(sharesReserves: BigNumber | string, fyTokenReserves: BigNumber | string, fyTokenIn: BigNumber | string, timeTillMaturity: BigNumber | string, ts: BigNumber | string, g2: BigNumber | string, decimals: number, c?: BigNumber | string, mu?: BigNumber | string): BigNumber;
/**
 * Calculates the amount of fyToken a user could sell for given amount of shares.
 * fyTokenInForSharesOut
 * https://www.desmos.com/calculator/8dgux6slgq
 * @param { BigNumber | string } sharesReserves shares reserves amount
 * @param { BigNumber | string } fyTokenReserves fyToken reserves amount
 * @param { BigNumber | string } sharesOut shares amount to be traded
 * @param { BigNumber | string } timeTillMaturity time till maturity in seconds
 * @param { BigNumber | string } ts time stretch
 * @param { BigNumber | string } g2 fee coefficient
 * @param { number } decimals pool decimals
 * @param { BigNumber | string } c price of shares in terms of their base in 64 bit
 * @param { BigNumber | string } mu (μ) Normalization factor -- starts as c at initialization in 64 bit
 *
 * @returns { BigNumber } fyTokenIn: the amount of fyToken a user could sell for given amount of shares
 *
 * y = fyToken reserves
 * z = shares reserves
 * x = Δz (sharesOut)
 *
 *      (                  sum                               )^(   invA   )  - y
 *      ( (    Za        ) + ( Ya  ) - (      Zxa            )^(   invA   )  - y
 * Δy = ( c/μ * (μz)^(1-t) + y^(1-t) - c/μ * (μz - μx)^(1-t) )^(1 / (1 - t)) - y
 */
export declare function buyBase(sharesReserves: BigNumber | string, fyTokenReserves: BigNumber | string, sharesOut: BigNumber | string, timeTillMaturity: BigNumber | string, ts: BigNumber | string, g2: BigNumber | string, decimals: number, c?: BigNumber | string, mu?: BigNumber | string): BigNumber;
/**
 * Calculates the amount of fyToken a user could buy for given amount of shares.
 * sharesInForFYTokenOut
 * https://www.desmos.com/calculator/oyj2qzevzs
 * @param { BigNumber | string } sharesReserves yield bearing vault shares reserve amount
 * @param { BigNumber | string } fyTokenReserves fyToken reserves amount
 * @param { BigNumber | string } fyTokenOut fyToken amount to be traded
 * @param { BigNumber | string } timeTillMaturity time till maturity in seconds
 * @param { BigNumber | string } ts time stretch
 * @param { BigNumber | string } g1 fee coefficient
 * @param { number } decimals pool decimals
 * @param { BigNumber | string } c price of shares in terms of their base in 64 bit
 * @param { BigNumber | string } mu (μ) Normalization factor -- starts as c at initialization in 64 bit
 *
 * @returns { BigNumber } sharesIn: result the amount of shares a user would have to pay for given amount of fyToken
 *
 * y = fyToken
 * z = vyToken
 * x = Δy
 *
 *      ( 1/μ * (                         sum                           ) )^(   invA    ) - z
 *      ( 1/μ * ( (     Za       ) + ( Ya   ) - (    Yxa    ) ) / (c/μ) ) )^(   invA    ) - z
 * Δz = ( 1/μ * ( ( c/μ * μz^(1-t) + y^(1-t)  - (y - x)^(1-t) ) / (c/μ) ) )^(1 / (1 - t)) - z
 */
export declare function buyFYToken(sharesReserves: BigNumber | string, // z
fyTokenReserves: BigNumber | string, // y
fyTokenOut: BigNumber | string, timeTillMaturity: BigNumber | string, ts: BigNumber | string, g1: BigNumber | string, decimals: number, c?: BigNumber | string, mu?: BigNumber | string): BigNumber;
/**
 * Calculate the max amount of shares that can be sold to into the pool without making the interest rate negative.
 *
 * @param { BigNumber | string } sharesReserves yield bearing vault shares reserve amount
 * @param { BigNumber | string } fyTokenReserves fyToken reserves amount
 * @param { BigNumber | string } timeTillMaturity time till maturity in seconds
 * @param { BigNumber | string } ts time stretch
 * @param { BigNumber | string } g1 fee coefficient
 * @param { number } decimals pool decimals
 * @param { BigNumber | string } c price of shares in terms of their base in 64 bit
 * @param { BigNumber | string } mu (μ) Normalization factor -- starts as c at initialization in 64 bit
 *
 * @returns { BigNumber } max amount of shares that can be bought from the pool
 *
 * y = fyToken
 * z = vyToken
 * x = Δy
 *
 *      1/μ * ( (               sum                 )^(   invA    ) - z
 *      1/μ * ( ( (  cua   ) * Za  + Ya ) / c/μ + 1 )^(   invA    ) - z
 * Δz = 1/μ * ( ( ( cμ^(a-1) * z^a + y^a) / c/μ + 1 )^(1 / (1 - t)) - z
 *
 */
export declare function maxBaseIn(sharesReserves: BigNumber, fyTokenReserves: BigNumber, timeTillMaturity: BigNumber | string, ts: BigNumber | string, g1: BigNumber | string, decimals: number, c?: BigNumber | string, mu?: BigNumber | string): BigNumber;
/**
 * Calculate the max amount of shares that can be bought from the pool.
 * Since the amount of shares that can be purchased is not bounded, maxSharesOut is equivalent to the toal amount of shares in the pool.
 *
 * @param { BigNumber | string } sharesReserves
 * @param { BigNumber | string } fyTokenReserves
 * @param { BigNumber | string } timeTillMaturity
 * @param { BigNumber | string } ts
 * @param { BigNumber | string } g2
 * @param { number } decimals
 * @param { BigNumber | string } c
 * @param { BigNumber | string } mu
 *
 * @returns { BigNumber } max amount of shares that can be bought from the pool
 *
 */
export declare function maxBaseOut(sharesReserves: BigNumber): BigNumber;
/**
 * Calculate the max amount of fyTokens that can be sold to into the pool.
 *
 * y = maxFyTokenOut
 * Y = fyTokenReserves (virtual)
 * Z = sharesReserves
 *
 *     (       sum           )^(invA) - y
 *     ( (    Za      ) + Ya )^(invA) - y
 * y = ( (c/μ) * (μZ)^a + Y^a)^(1/a)  - y
 *
 * @param { BigNumber | string } sharesReserves
 * @param { BigNumber | string } fyTokenReserves
 * @param { BigNumber | string } timeTillMaturity
 * @param { BigNumber | string } ts
 * @param { BigNumber | string } g2
 * @param { number } decimals
 * @param { BigNumber | string } c
 * @param { BigNumber | string } mu
 *
 * @returns { BigNumber }
 */
export declare function maxFyTokenIn(sharesReserves: BigNumber, fyTokenReserves: BigNumber, timeTillMaturity: BigNumber | string, ts: BigNumber | string, g2: BigNumber | string, decimals: number, c?: BigNumber | string, mu?: BigNumber | string): BigNumber;
/**
 * Calculate the max amount of fyTokens that can be bought from the pool without making the interest rate negative.
 * https://docs.google.com/spreadsheets/d/14K_McZhlgSXQfi6nFGwDvDh4BmOu6_Hczi_sFreFfOE/edit#gid=0 (maxFyTokenOut)
 *
 * y = maxFyTokenOut
 * Y = fyTokenReserves (virtual)
 * Z = sharesReserves
 * cmu = cμ^a
 *
 *         ( (       sum                 ) / (  denominator  ) )^invA
 *         ( ( (    Za      ) + (  Ya  ) ) / (  denominator  ) )^invA
 * y = Y - ( ( ( cμ^a * Z^a ) + ( μY^a ) ) / (    c/μ + 1    ) )^(1/a)
 *
 * @param { BigNumber | string } sharesReserves
 * @param { BigNumber | string } fyTokenReserves
 * @param { BigNumber | string } timeTillMaturity
 * @param { BigNumber | string } ts
 * @param { BigNumber | string } g1
 * @param { number } decimals
 * @param { BigNumber | string } c
 * @param { BigNumber | string } mu
 *
 * @returns { BigNumber }
 */
export declare function maxFyTokenOut(sharesReserves: BigNumber, fyTokenReserves: BigNumber, timeTillMaturity: BigNumber | string, ts: BigNumber | string, g1: BigNumber | string, decimals: number, c?: BigNumber | string, mu?: BigNumber | string): BigNumber;
/**
 * Calculate the amount of fyToken that should be bought when providing liquidity with only underlying.
 * The amount bought leaves a bit of unused underlying, to allow for the pool reserves to change between
 * the calculation and the mint. The pool returns any unused underlying.
 *
 * @param sharesReserves
 * @param fyTokenRealReserves
 * @param fyTokenVirtualReserves
 * @param shares
 * @param timeTillMaturity
 * @param ts
 * @param g1
 * @param decimals
 * @param slippage How far from the optimum we want to be
 * @param precision How wide the range in which we will accept a value
 * @param c
 * @param mu
 *
 * @returns fyTokenToBuy, surplus
 */
export declare function fyTokenForMint(sharesReserves: BigNumber, fyTokenRealReserves: BigNumber, fyTokenVirtualReserves: BigNumber, shares: BigNumber | string, timeTillMaturity: BigNumber | string, ts: BigNumber | string, g1: BigNumber | string, decimals: number, slippage?: number, // 1% default
c?: BigNumber | string, mu?: BigNumber | string, precision?: number): [BigNumber, BigNumber];
/**
 * Split a certain amount of X liquidity into its two components (eg. shares and fyToken)
 * @param { BigNumber } xReserves // eg. shares reserves
 * @param { BigNumber } yReserves // eg. fyToken reservers
 * @param {BigNumber} xAmount // amount to split in wei
 * @param {BigNumber} asBn
 * @returns  [ BigNumber, BigNumber ] returns an array of [shares, fyToken]
 */
export declare const splitLiquidity: (xReserves: BigNumber | string, yReserves: BigNumber | string, xAmount: BigNumber | string, asBn?: boolean) => [BigNumberish, BigNumberish];
/**
 * Calculate Slippage
 * @param { BigNumber } value
 * @param { BigNumber } slippage optional: defaults to 0.005 (0.5%)
 * @param { boolean } minimise optional: whether the result should be a minimum or maximum (default max)
 * @returns { string } human readable string
 */
export declare const calculateSlippage: (value: BigNumber | string, slippage?: BigNumber | string, minimise?: boolean) => string;
/**
 * Calculate Annualised Yield Rate
 * @param { BigNumber | string } tradeValue // current [base]
 * @param { BigNumber | string } amount // y[base] amount at maturity
 * @param { number } maturity  // date of maturity
 * @param { number } fromDate // ***optional*** start date - defaults to now()
 * @returns { string | undefined } human readable string
 */
export declare const calculateAPR: (tradeValue: BigNumber | string, amount: BigNumber | string, maturity: number, fromDate?: number) => string | undefined;
/**
 * Calculates the collateralization ratio
 * based on the collat amount and value and debt value.
 * @param { BigNumber | string } collateralAmount  amount of collateral (in wei)
 * @param { BigNumber | string } basePrice bases per unit of collateral (in wei)
 * @param { BigNumber | string } baseAmount amount base debt (in wei)
 * @param {boolean} asPercent OPTIONAL: flag to return ratio as a percentage
 * @returns { number | undefined } // can be undefined because of 0 baseAmount as a denominator.
 */
export declare const calculateCollateralizationRatio: (collateralAmount: BigNumber | string, basePrice: BigNumber | string, baseAmount: BigNumber | string, asPercent?: boolean) => number | undefined;
/**
 * Calculates the min collateralization ratio
 * based on the collat amount and value and debt value.
 * @param { BigNumber | string } basePrice bases per unit collateral (in wei)
 * @param { BigNumber | string } baseAmount amount of bases / debt (in wei)
 * @param {BigNumber | string} liquidationRatio  OPTIONAL: 1.5 (150%) as default
 * @param {BigNumber | string} existingCollateral  0 as default (as wei)
 * @param {Boolean} asBigNumber return as big number? in wei
 *
 * @returns BigNumber
 */
export declare const calculateMinCollateral: (basePrice: BigNumber | string, baseAmount: BigNumber | string, liquidationRatio: string, existingCollateral?: BigNumber | string) => BigNumber;
/**
 * Calcualtes the amount (base, or other variant) that can be borrowed based on
 * an amount of collateral (ETH, or other), and collateral price.
 *
 * @param {BigNumber | string} collateralAmount amount of collateral
 * @param {BigNumber | string} collateralPrice price of unit collateral (in currency x)
 * @param {BigNumber | string} debtValue value of debt (in currency x)
 * @param {BigNumber | string} liquidationRatio  OPTIONAL: 1.5 (150%) as default
 *
 * @returns {string}
 */
export declare const calculateBorrowingPower: (collateralAmount: BigNumber | string, collateralPrice: BigNumber | string, debtValue: BigNumber | string, liquidationRatio?: string) => string;
/**
 * Calcualtes the amount (base, or other variant) that can be borrowed based on
 * an amount of collateral (ETH, or other), and collateral price.
 *
 * @param {string} collateralAmount amount of collateral in human readable decimals
 * @param {string} debtAmount amount of debt in human readable decimals
 * @param {number} liquidationRatio  OPTIONAL: 1.5 (150%) as default
 *
 * @returns {string}
 */
export declare const calcLiquidationPrice: (collateralAmount: string, debtAmount: string, liquidationRatio: number) => string;
/**
 *  @param {BigNumber} sharesChange change in shares
 * @param {BigNumber} fyTokenChange change in fyToken
 * @param {BigNumber} poolSharesReserves pool shares reserves
 * @param {BigNumber} poolFyTokenReserves pool fyToken reserves
 * @param {BigNumber} poolTotalSupply pool total supply
 *
 * @returns {BigNumber[]} [newSharesReserves, newFyTokenRealReserves, newTotalSupply, newFyTokenVirtualReserves]
 */
export declare const newPoolState: (sharesChange: BigNumber, fyTokenChange: BigNumber, poolSharesReserves: BigNumber, poolFyTokenReserves: BigNumber, poolTotalSupply: BigNumber) => {
    sharesReserves: BigNumber;
    fyTokenRealReserves: BigNumber;
    totalSupply: BigNumber;
    fyTokenVirtualReserves: BigNumber;
};
/**
 *  @param {BigNumber | string} strategyTokenAmount
 * @param {BigNumber} strategyTotalSupply
 * @param {BigNumber} strategyPoolBalance
 * @param {BigNumber} poolSharesReserves
 * @param {BigNumber} poolFyTokenRealReserves
 * @param {BigNumber} poolTotalSupply
 * @param {BigNumber | string} poolTimeToMaturity
 * @param {BigNumber | string} ts
 * @param {BigNumber | string} g2
 * @param { number } decimals
 * @param {BigNumber | string} c
 * @param {BigNumber | string} mu
 *
 * @returns {BigNumber} [fyToken sold to shares, shares received]
 */
export declare const strategyTokenValue: (strategyTokenAmount: BigNumber | string, strategyTotalSupply: BigNumber, strategyPoolBalance: BigNumber, poolSharesReserves: BigNumber, poolFyTokenReserves: BigNumber, poolTotalSupply: BigNumber, poolTimeToMaturity: string | BigNumber, ts: BigNumber | string, g2: BigNumber | string, decimals: number, c?: BigNumber | string, mu?: BigNumber | string) => [BigNumber, BigNumber];
/**
 * Calculates the estimated percentage of the pool given an inputted base amount.
 *
 * @param {BigNumber} input amount of base
 * @param {BigNumber} strategyTotalSupply strategy's total supply
 *
 * @returns {BigNumber}
 */
export declare const getPoolPercent: (input: BigNumber, strategyTotalSupply: BigNumber) => string;
/**
 * Calcualtes the MIN and MAX reserve ratios of a pool for a given slippage value
 *
 * @param {BigNumber} sharesReserves
 * @param {BigNumber} fyTokenReserves // real reserves
 * @param {number} slippage
 *
 * @returns {[BigNumber, BigNumber] }
 */
export declare const calcPoolRatios: (sharesReserves: BigNumber, fyTokenReserves: BigNumber, slippage?: number) => [BigNumber, BigNumber];
/**
 * Calculate accrued debt value after maturity
 *
 * @param {BigNumber} rate
 * @param {BigNumber} rateAtMaturity
 * @param {BigNumberr} debt
 *
 * @returns {[BigNumber, BigNumber]} accruedDebt, debt less accrued value
 */
export declare const calcAccruedDebt: (rate: BigNumber, rateAtMaturity: BigNumber, debt: BigNumber) => BigNumber[];
