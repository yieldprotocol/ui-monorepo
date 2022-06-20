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
export interface W3Number {
    bn: BigNumber;
    hStr: string;
    dsp: string;
}
export interface IUserSettings {
    slippageTolerance: number;
    approvalMethod: ApprovalMethod;
    maxApproval: boolean;
    unwrapTokens: boolean;
}
export interface IYieldConfig {
    defaultProviderMap: Map<number, ethers.providers.BaseProvider>;
    defaultChainId: number;
    defaultAccountProvider: ethers.providers.Web3Provider;
    useAccountProviderAsProvider: boolean;
    autoConnectAccountProvider: boolean;
    supressInjectedListeners: boolean;
    defaultUserSettings: IUserSettings;
    defaultSeriesId: string | undefined;
    defaultBaseId: string | undefined;
    ignoreSeries: string[];
    ignoreStrategies: string[];
    messageTimeout: number;
    browserCaching: boolean;
    forceTransactions: boolean;
    useFork: boolean;
    defaultForkMap: Map<number, ethers.providers.BaseProvider>;
    suppressEventLogQueries: boolean;
    diagnostics: boolean;
}
export interface IYieldProtocol {
    protocolVersion: string;
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
    seriesø: Observable<Map<string, ISeries>>;
    assetsø: Observable<Map<string, IAsset>>;
    vaultsø: Observable<Map<string, IVault>>;
    strategiesø: Observable<Map<string, IStrategy>>;
    assetPairsø: Observable<Map<string, IAssetPair>>;
    transactionsø: Observable<Map<string, IYieldProcess>>;
    selectedø: Observable<ISelected>;
    userSettingsø: Observable<IUserSettings>;
    messagesø: Observable<Map<string, IMessage>>;
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
    borrow: () => Promise<void>;
    repayDebt: any;
    addLiquidity: any;
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
    minDebtLimit: W3Number;
    maxDebtLimit: W3Number;
    limitDecimals: number;
    pairPrice: W3Number;
    pairTotalDebt: W3Number;
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
    baseReserves: W3Number;
    fyTokenReserves: W3Number;
    fyTokenRealReserves: W3Number;
    totalSupply: W3Number;
    fyTokenContract: FYToken;
    poolContract: Pool;
    getTimeTillMaturity: () => string;
    isMature: () => boolean;
    getFyTokenAllowance: (acc: string, spender: string) => Promise<BigNumber>;
    getPoolAllowance: (acc: string, spender: string) => Promise<BigNumber>;
    poolTokens?: W3Number | undefined;
    fyTokenBalance?: W3Number | undefined;
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
    balance: W3Number;
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
    ink: W3Number;
    art: W3Number;
    accruedArt: W3Number;
    rateAtMaturity: W3Number;
    rate: W3Number;
}
export interface IStrategy extends IStrategyRoot {
    strategyContract: Strategy;
    currentSeriesId: string;
    currentPoolAddr: string;
    nextSeriesId: string;
    active: boolean;
    initInvariant?: BigNumber;
    currentInvariant?: BigNumber;
    returnRate?: W3Number;
    strategyTotalSupply?: W3Number;
    accountBalance?: W3Number;
    accountStrategyPercent?: string | undefined;
    strategyPoolContract?: Pool;
    poolTotalSupply?: W3Number;
    strategyPoolBalance?: W3Number;
    strategyPoolPercent?: string;
    accountPoolBalance?: W3Number;
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
    id?: string;
    type?: MessageType;
    origin?: any;
    timeoutOverride?: number;
    expired?: boolean;
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
    PROCESS_INACTIVE = "Process inactive",
    SIGNING_APPROVAL_REQUESTED = "Signing requested",
    APPROVAL_TRANSACTION_PENDING = "Approval transaction pending",
    SIGNING_APPROVAL_COMPLETE = "Signing/Approval complete",
    TRANSACTION_REQUESTED = "Transaction requested ",
    TRANSACTION_PENDING = "Transaction pending",
    PROCESS_COMPLETE = "Process complete",
    PROCESS_COMPLETE_TIMEOUT = "Process complete: timeout"
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
