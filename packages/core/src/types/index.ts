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
  // forceTransactions: boolean;
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

  /* maps */
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
  /* selectors */
  selectIlk: (asset: string | IAsset) => void;
  selectBase: (asset: string | IAsset) => void;
  selectVault: (vault: string | IVault) => void;
  selectSeries: (series: string | ISeries, futureSeries: boolean) => void;
  selectStrategy:  (strategy: string | IStrategy) => void;
}

export interface ISelected {
  base: IAsset | null;
  ilk: IAsset | null; // collateral
  series: ISeries | null;
  vault: IVault | null;
  strategy: IStrategy | null;

  futureSeries: ISeries | null; // used for 'rolling' position situations
}

export interface ISettingsContext {
  settingsState: ISettingsContextState;
  settingsActions: { updateSetting: (setting: string, value: string | number | boolean) => void };
}

export interface ISettingsContextState {
  /* User Settings ( getting from the cache first ) */
  slippageTolerance: number;
  darkMode: boolean;
  autoTheme: boolean;
  forceTransactions: boolean;
  approvalMethod: ApprovalMethod;
  approveMax: boolean;
  disclaimerChecked: boolean;
  powerUser: boolean;
  diagnostics: boolean;
  /* Token wrapping */
  showWrappedTokens: boolean;
  unwrapTokens: boolean;
  /* DashSettings */
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
  maturity_: string; // display string

  fyTokenAddress: string;
  poolAddress: string;
  poolName: string;
  poolVersion: string; // for signing
  poolSymbol: string; // for signing


  ts: BigNumber;
  g1: BigNumber;
  g2: BigNumber;

  baseId: string;
  baseTokenAddress: string;

  // creation info
  createdBlock: number;
  createdTxHash: string;
}


export enum TokenType {
  ERC20_,
  ERC20_Permit,
  ERC20_DaiPermit,
  ERC20_MKR,
  ERC1155_,
  ERC720_,
}

export interface IAssetInfo {
  tokenType: TokenType;
  tokenIdentifier?: number | string; // used for identifying tokens in a multitoken contract

  name: string;
  version: string;
  symbol: string;
  decimals: number;

  isYieldBase?: boolean;
  showToken: boolean; // Display/hide the token on the UI

  digitFormat: number; // this is the 'reasonable' number of digits to show. accuracy equivalent to +- 1 us cent.
  displaySymbol?: string; // override for symbol display

  limitToSeries?: string[];

  wrapHandlerAddresses?: Map<number, string>; // mapping a chain id to the corresponding wrap handler address
  unwrapHandlerAddresses?: Map<number, string>; // mapping a chain id to the correpsonding unwrap handler address
  proxyId?: string;
}

export interface IAssetRoot extends IAssetInfo, ISignable {
  // fixed/static:
  id: string;
  image: any;
  displayName: string;
  displayNameMobile: string;
  joinAddress: string;

  // creation info
  createdBlock: number;
  createdTxHash: string;

  isWrappedToken: boolean; // Note: this is if is a token used in wrapped form by the yield protocol (except ETH - which is handled differently)
  wrappingRequired: boolean;
  proxyId: string; // id to use throughout app when referencing an asset id; uses the unwrapped asset id when the asset is wrapped (i.e: wstETH is the proxy id for stETH)
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

  // creation info
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

  /* live Contracts */
  fyTokenContract: FYToken;
  poolContract: Pool;

  /*  Baked in token fns */
  getTimeTillMaturity: () => string;
  isMature: () => boolean; // note :  -> use this now instead of seriesIsMature
  getFyTokenAllowance: (acc: string, spender: string) => Promise<BigNumber>;
  getPoolAllowance: (acc: string, spender: string) => Promise<BigNumber>;

  /*  User speccific  */
  poolTokens?: BigNumber | undefined;
  poolTokens_?: string | undefined;
  fyTokenBalance?: BigNumber | undefined;
  fyTokenBalance_?: string | undefined;
  poolPercent?: string | undefined;

  /* Extra visual stuff */
  color?: string;
  textColor?: string;
  startColor?: string;
  endColor?: string;
  oppositeColor?: string;
  oppStartColor?: string;
  oppEndColor?: string;
  seriesMark?: any; // image
}

export interface IAsset extends IAssetRoot {
  /*  'Charged' items */
  assetContract: Contract;
  isYieldBase: boolean; // needs to be checked because new series can be added

  /*  Baked in token fns */
  getBalance: (account: string) => Promise<BigNumber>;
  getAllowance: (account: string, spender: string) => Promise<BigNumber>;
  setAllowance?: (spender: string) => Promise<BigNumber | void>;

  /* User specific */
  balance: BigNumber;
  balance_: string;
}

export interface IDummyVault extends IVaultRoot {}
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
  // liquidationPrice_: string;
}

export interface IStrategy extends IStrategyRoot {
  /* live contract */
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

  /* Baked in functions  */
  getAllowance: (acc: string, spender: string) => Promise<BigNumber>;
}

export interface ICallData {
  args: (string | BigNumberish | boolean)[];
  operation: string | [number, string[]];

  /* optionals */
  targetContract?: ethers.Contract; // target contract for routed/modules calls
  fnName?: string; // function to call on the routed/module contract

  overrides?: ethers.CallOverrides;
  ignoreIf?: boolean; // conditional for ignoring signing
}

export interface ISignData {
  target: ISignable; // signing target contract
  spender: string; // the intended spender

  /* Optional Extention/advanced use-case options */
  amount?: BigNumberish; // Defaults to MAX_256
  domain?: IDomain; // optional Domain if required
  ignoreIf?: boolean; // conditional for ignoring signing
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

export enum ApprovalMethod {
  TX = 'TX',
  SIG = 'SIG',
}

export enum MessageType {
  INFO,
  WARNING,
  ERROR,
  INTERNAL
}

export interface IMessage {
  message: string;
  type? : MessageType;
  origin?: any; // defaults to app 
  persistent?: boolean;
  timeoutOverride?: number;
  id?: string|number; // for multi?
}

export enum TxState {
  PENDING = 'PENDING',
  SUCCESSFUL = 'SUCCESSFUL',
  FAILED = 'FAILED',
  REJECTED = 'REJECTED',
}

export interface IYieldSig {
  // signId: string; // targetAddress spenderAddress
  signData: ISignData;
  status: TxState;
}

export interface IYieldTx extends ContractTransaction {
  receipt: any | null;
  status: TxState;
}

export enum ProcessStage {
  PROCESS_INACTIVE,
  SIGNING_APPROVAL_REQUESTED,
  APPROVAL_TRANSACTION_PENDING,
  SIGNING_APPROVAL_COMPLETE,
  TRANSACTION_REQUESTED,
  TRANSACTION_PENDING,
  PROCESS_COMPLETE,
  PROCESS_COMPLETE_TIMEOUT,
}

export interface IYieldProcess {
  processCode: string;
  stage?: ProcessStage;
  signMap?: Map<string, IYieldSig>;
  tx?: IYieldTx;
  txHash?: string;
  timeout?: boolean;
  processActive?: boolean;
  error?: { error: Error; message: string };
  // positionPath?: string | undefined;
}

export enum MenuView {
  account = 'ACCOUNT',
  settings = 'SETTINGS',
  vaults = 'VAULTS',
}

export enum TradeType {
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum ActionType {
  BORROW = 'BORROW',
  LEND = 'LEND',
  POOL = 'POOL',
}

export enum AddLiquidityType {
  BUY = 'BUY',
  BORROW = 'BORROW',
}

export enum YieldColors {
  SUCCESS = 'success',
  FAILED = 'error',
  WARNING = 'warning',
  GRADIENT = '',
  GRADIENT_TRANSPARENT = '',
  PRIMARY = '',
  SECONDARY = '',
}

export enum ActionCodes {
  // COLLATERAL
  ADD_COLLATERAL = 'Add Collateral',
  REMOVE_COLLATERAL = 'Remove Collateral',
  // BORROW
  BORROW = 'Borrow',
  REPAY = 'Repay',
  ROLL_DEBT = 'Roll Debt',
  // LEND
  LEND = 'Lend',
  CLOSE_POSITION = 'Redeem Position',
  ROLL_POSITION = 'Roll Position',
  REDEEM = 'Redeem',
  // POOL
  ADD_LIQUIDITY = 'Add Liquidity',
  REMOVE_LIQUIDITY = 'Remove Liquidity',
  ROLL_LIQUIDITY = 'Roll Liquidity',
  // VAULT
  DELETE_VAULT = 'Delete Vault',
  TRANSFER_VAULT = 'Transfer Vault',
  MERGE_VAULT = 'Merge Vault',
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