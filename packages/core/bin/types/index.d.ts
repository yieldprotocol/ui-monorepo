import { ethers, BigNumber, BigNumberish, ContractTransaction, Contract } from 'ethers';
import { Observable } from 'rxjs';
import { Cauldron, FYToken, Ladle, Pool, Strategy, Witch } from '../contracts';
export { LadleActions, RoutedActions } from './operations';
export interface IHistoryList {
    lastBlock: number;
    items: any[];
}
export interface IHistoryContextState {
    historyLoading: boolean;
    tradeHistory: IHistoryList;
    poolHistory: IHistoryList;
    vaultHistory: IHistoryList;
}
export interface IPriceContextState {
    pairMap: Map<string, IAssetPair>;
    pairLoading: string[];
}
export interface IPriceContextActions {
    updateAssetPair: (baseId: string, ilkId: string) => Promise<void>;
}
export interface IPriceContext {
    priceState: IPriceContextState;
    priceActions: IPriceContextActions;
}
export interface IUserSettings {
    slippageTolerance: number;
    approvalMethod: ApprovalMethod;
    maxApproval: boolean;
    unwrapTokens: boolean;
}
export interface IYieldConfig {
    defaultProvider: ethers.providers.BaseProvider;
    defaultChainId: number;
    defaultUserSettings: IUserSettings;
    defaultSeriesId: string | undefined;
    defaultBaseId: string | undefined;
    messageTimeout: number;
    mockUser: boolean;
    browserCaching: boolean;
    forceTransactions: boolean;
    diagnostics: boolean;
    ignoreSeries: string[];
    ignoreStrategies: string[];
}
export interface IYieldProtocol {
    protocolVersion: string;
    chainId: number;
    cauldron: Cauldron;
    ladle: Ladle;
    witch: Witch;
    oracleMap: Map<string, Contract>;
    moduleMap: Map<string, Contract>;
    assetRootMap: Map<string, IAssetRoot>;
    seriesRootMap: Map<string, ISeriesRoot>;
    strategyRootMap: Map<string, IStrategyRoot>;
}
export interface IYieldObservables {
    yieldProtocolø: Observable<IYieldProtocol>;
    providerø: Observable<ethers.providers.BaseProvider>;
    accountø: Observable<string | undefined>;
    accountProviderø: Observable<ethers.providers.Web3Provider>;
    seriesMapø: Observable<Map<string, ISeries>>;
    assetMapø: Observable<Map<string, IAsset>>;
    vaultMapø: Observable<Map<string, IVault>>;
    strategyMapø: Observable<Map<string, IStrategy>>;
    assetPairMapø: Observable<Map<string, IAssetPair>>;
    transactionMapø: Observable<Map<string, IYieldProcess>>;
    selectedø: Observable<ISelected>;
    userSettingsø: Observable<IUserSettings>;
    messagesø: Observable<IMessage | undefined>;
}
export interface IYieldFunctions {
    updateProvider: (provider: ethers.providers.BaseProvider) => void;
    updateYieldConfig: (config: IYieldConfig) => void;
    updateAccount: (account: string) => void;
    selectIlk: (asset: string | IAsset) => void;
    selectBase: (asset: string | IAsset) => void;
    selectVault: (vault: string | IVault) => void;
    selectSeries: (series: string | ISeries, futureSeries: boolean) => void;
    selectStrategy: (strategy: string | IStrategy) => void;
}
export interface ISelected {
    base: IAsset | null;
    ilk: IAsset | null;
    series: ISeries | null;
    vault: IVault | null;
    strategy: IStrategy | null;
    futureSeries: ISeries | null;
}
export interface ISettingsContext {
    settingsState: ISettingsContextState;
    settingsActions: {
        updateSetting: (setting: string, value: string | number | boolean) => void;
    };
}
export interface ISettingsContextState {
    slippageTolerance: number;
    darkMode: boolean;
    autoTheme: boolean;
    forceTransactions: boolean;
    approvalMethod: ApprovalMethod;
    approveMax: boolean;
    disclaimerChecked: boolean;
    powerUser: boolean;
    diagnostics: boolean;
    showWrappedTokens: boolean;
    unwrapTokens: boolean;
    dashHideEmptyVaults: boolean;
    dashHideInactiveVaults: boolean;
    dashHideVaults: boolean;
    dashHideLendPositions: boolean;
    dashHidePoolPositions: boolean;
    dashCurrency: string;
}
export interface ISignable {
    name: string;
    version: string;
    address: string;
    symbol: string;
    tokenType: TokenType;
}
export interface ISeriesRoot extends ISignable {
    id: string;
    displayName: string;
    displayNameMobile: string;
    decimals: number;
    maturity: number;
    maturity_: string;
    fyTokenAddress: string;
    poolAddress: string;
    poolName: string;
    poolVersion: string;
    poolSymbol: string;
    ts: BigNumber;
    g1: BigNumber;
    g2: BigNumber;
    baseId: string;
    baseTokenAddress: string;
    createdBlock: number;
    createdTxHash: string;
}
export declare enum TokenType {
    ERC20_ = 0,
    ERC20_Permit = 1,
    ERC20_DaiPermit = 2,
    ERC20_MKR = 3,
    ERC1155_ = 4,
    ERC720_ = 5
}
export interface IAssetInfo {
    tokenType: TokenType;
    tokenIdentifier?: number | string;
    name: string;
    version: string;
    symbol: string;
    decimals: number;
    isYieldBase?: boolean;
    showToken: boolean;
    digitFormat: number;
    displaySymbol?: string;
    limitToSeries?: string[];
    wrapHandlerAddresses?: Map<number, string>;
    unwrapHandlerAddresses?: Map<number, string>;
    proxyId?: string;
}
export interface IAssetRoot extends IAssetInfo, ISignable {
    id: string;
    image: any;
    displayName: string;
    displayNameMobile: string;
    joinAddress: string;
    createdBlock: number;
    createdTxHash: string;
    isWrappedToken: boolean;
    wrappingRequired: boolean;
    proxyId: string;
}
export interface IAssetPair {
    id: string;
    baseId: string;
    ilkId: string;
    oracle: string;
    baseDecimals: number;
    ilkDecimals: number;
    minRatio: number;
    minDebtLimit: BigNumber;
    maxDebtLimit: BigNumber;
    limitDecimals: number;
    pairPrice: BigNumber;
    pairTotalDebt: BigNumber;
    pairUpdating?: boolean;
    lastUpdate?: number;
}
export interface IStrategyRoot extends ISignable {
    id: string;
    baseId: string;
    decimals: number;
}
export interface IVaultRoot {
    id: string;
    ilkId: string;
    baseId: string;
    seriesId: string;
    displayName: string;
    baseDecimals: number;
    ilkDecimals: number;
    createdBlock: number;
    createdTxHash: string;
}
export interface ISeries extends ISeriesRoot {
    apr: string;
    baseReserves: BigNumber;
    baseReserves_: string;
    fyTokenReserves: BigNumber;
    fyTokenRealReserves: BigNumber;
    totalSupply: BigNumber;
    totalSupply_: string;
    fyTokenContract: FYToken;
    poolContract: Pool;
    getTimeTillMaturity: () => string;
    isMature: () => boolean;
    getFyTokenAllowance: (acc: string, spender: string) => Promise<BigNumber>;
    getPoolAllowance: (acc: string, spender: string) => Promise<BigNumber>;
    poolTokens?: BigNumber | undefined;
    poolTokens_?: string | undefined;
    fyTokenBalance?: BigNumber | undefined;
    fyTokenBalance_?: string | undefined;
    poolPercent?: string | undefined;
    color?: string;
    textColor?: string;
    startColor?: string;
    endColor?: string;
    oppositeColor?: string;
    oppStartColor?: string;
    oppEndColor?: string;
    seriesMark?: any;
}
export interface IAsset extends IAssetRoot {
    assetContract: Contract;
    isYieldBase: boolean;
    getBalance: (account: string) => Promise<BigNumber>;
    getAllowance: (account: string, spender: string) => Promise<BigNumber>;
    setAllowance?: (spender: string) => Promise<BigNumber | void>;
    balance: BigNumber;
    balance_: string;
}
export interface IDummyVault extends IVaultRoot {
}
export interface IVault extends IVaultRoot {
    owner: string;
    underLiquidation: boolean;
    hasBeenLiquidated: boolean;
    liquidationDate?: number;
    liquidationDate_?: string;
    isActive: boolean;
    ink: BigNumber;
    art: BigNumber;
    accruedArt: BigNumber;
    ink_: string;
    art_: string;
    rateAtMaturity: BigNumber;
    rate: BigNumber;
    rate_: string;
    accruedArt_: string;
}
export interface IStrategy extends IStrategyRoot {
    strategyContract: Strategy;
    currentSeriesId: string;
    currentPoolAddr: string;
    nextSeriesId: string;
    currentSeries: ISeries | undefined;
    nextSeries: ISeries | undefined;
    active: boolean;
    initInvariant?: BigNumber;
    currentInvariant?: BigNumber;
    returnRate?: BigNumber;
    returnRate_?: string;
    strategyTotalSupply?: BigNumber;
    strategyTotalSupply_?: string;
    poolTotalSupply?: BigNumber;
    poolTotalSupply_?: string;
    strategyPoolBalance?: BigNumber;
    strategyPoolBalance_?: string;
    strategyPoolPercent?: string;
    accountBalance?: BigNumber;
    accountBalance_?: string;
    accountStrategyPercent?: string | undefined;
    accountPoolBalance?: BigNumber;
    accountPoolBalance_?: string;
    accountPoolPercent?: string | undefined;
    getAllowance: (acc: string, spender: string) => Promise<BigNumber>;
}
export interface ICallData {
    args: (string | BigNumberish | boolean)[];
    operation: string | [number, string[]];
    targetContract?: ethers.Contract;
    fnName?: string;
    overrides?: ethers.CallOverrides;
    ignoreIf?: boolean;
}
export interface ISignData {
    target: ISignable;
    spender: string;
    amount?: BigNumberish;
    domain?: IDomain;
    ignoreIf?: boolean;
}
export interface IDaiPermitMessage {
    holder: string;
    spender: string;
    nonce: number;
    expiry: number | string;
    allowed?: boolean;
}
export interface IERC2612PermitMessage {
    owner: string;
    spender: string;
    value: number | string;
    nonce: number | string;
    deadline: number | string;
}
export interface IDomain {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: string;
}
export declare enum ApprovalMethod {
    TX = "TX",
    SIG = "SIG"
}
export declare enum MessageType {
    INFO = 0,
    WARNING = 1,
    ERROR = 2,
    INTERNAL = 3
}
export interface IMessage {
    message: string;
    type?: MessageType;
    origin?: any;
    persistent?: boolean;
    timeoutOverride?: number;
    id?: string | number;
}
export declare enum TxState {
    PENDING = "PENDING",
    SUCCESSFUL = "SUCCESSFUL",
    FAILED = "FAILED",
    REJECTED = "REJECTED"
}
export interface IYieldSig {
    signData: ISignData;
    status: TxState;
}
export interface IYieldTx extends ContractTransaction {
    receipt: any | null;
    status: TxState;
}
export declare enum ProcessStage {
    PROCESS_INACTIVE = 0,
    SIGNING_APPROVAL_REQUESTED = 1,
    APPROVAL_TRANSACTION_PENDING = 2,
    SIGNING_APPROVAL_COMPLETE = 3,
    TRANSACTION_REQUESTED = 4,
    TRANSACTION_PENDING = 5,
    PROCESS_COMPLETE = 6,
    PROCESS_COMPLETE_TIMEOUT = 7
}
export interface IYieldProcess {
    processCode: string;
    stage?: ProcessStage;
    signMap?: Map<string, IYieldSig>;
    tx?: IYieldTx;
    txHash?: string;
    timeout?: boolean;
    processActive?: boolean;
    error?: {
        error: Error;
        message: string;
    };
}
export declare enum MenuView {
    account = "ACCOUNT",
    settings = "SETTINGS",
    vaults = "VAULTS"
}
export declare enum TradeType {
    BUY = "BUY",
    SELL = "SELL"
}
export declare enum ActionType {
    BORROW = "BORROW",
    LEND = "LEND",
    POOL = "POOL"
}
export declare enum AddLiquidityType {
    BUY = "BUY",
    BORROW = "BORROW"
}
export declare enum YieldColors {
    SUCCESS = "success",
    FAILED = "error",
    WARNING = "warning",
    GRADIENT = "",
    GRADIENT_TRANSPARENT = "",
    PRIMARY = "",
    SECONDARY = ""
}
export declare enum ActionCodes {
    ADD_COLLATERAL = "Add Collateral",
    REMOVE_COLLATERAL = "Remove Collateral",
    BORROW = "Borrow",
    REPAY = "Repay",
    ROLL_DEBT = "Roll Debt",
    LEND = "Lend",
    CLOSE_POSITION = "Redeem Position",
    ROLL_POSITION = "Roll Position",
    REDEEM = "Redeem",
    ADD_LIQUIDITY = "Add Liquidity",
    REMOVE_LIQUIDITY = "Remove Liquidity",
    ROLL_LIQUIDITY = "Roll Liquidity",
    DELETE_VAULT = "Delete Vault",
    TRANSFER_VAULT = "Transfer Vault",
    MERGE_VAULT = "Merge Vault"
}
export interface IBaseHistItem {
    blockNumber: number;
    date: number;
    transactionHash: string;
    series: ISeries;
    actionCode: ActionCodes;
    date_: string;
    primaryInfo: string;
    secondaryInfo?: string;
}
export interface IHistItemVault extends IBaseHistItem {
    ilkId: string;
    ink: BigNumber;
    art: BigNumber;
    ink_: String;
    art_: String;
}
export interface IHistItemPosition extends IBaseHistItem {
    bases: BigNumber;
    fyTokens: BigNumber;
    bases_: string;
    fyTokens_: string;
    poolTokens?: BigNumber;
    poolTokens_?: string;
}
export interface IDashSettings {
    hideEmptyVaults: boolean;
    showInactiveVaults: boolean;
    hideInactiveVaults: boolean;
    hideVaultPositions: boolean;
    hideLendPositions: boolean;
    hidePoolPositions: boolean;
    currencySetting: string;
}
