import { ethers, BigNumber, BigNumberish, ContractTransaction, Contract } from 'ethers';
import { Observable } from 'rxjs';
import { Cauldron, FYToken, Ladle, Pool, Strategy, Witch } from '@yield-protocol/ui-contracts';
import { IAssetRoot } from '../buildProtocol/initAssets';

export { LadleActions, RoutedActions } from './operations';

export interface W3bNumber {
  big: BigNumber; // 'BigNumber' representation in wei (or equivalent) terms( eg. 1000000000000000023 Wei ).
  hStr: string; // 'Human String' understandable value ( eg. 1.000000000000000023 ETH ) - takes into account token specific decimals ( no precision loss )
  dsp: number; // 'Display' number used only for display purposes ( eg. 1.00 DAI ) ( precision loss );
}

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
  defaultProviderMap: Map<number, ()=>ethers.providers.BaseProvider>;
  defaultChainId: number;

  defaultAccountProvider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider; // the default provider used for getting the account information and signing/transacting
  useAccountProviderAsProvider: boolean; // link the default provider to the account provider
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
  defaultForkMap: Map<number, () => ethers.providers.JsonRpcProvider>;
  suppressEventLogQueries: boolean, // don't query historical data 

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
  protocolø: Observable<IYieldProtocol>;
  providerø: Observable<ethers.providers.BaseProvider>;
  accountø: Observable<string | undefined>;

  accountProviderø: Observable<ethers.providers.Web3Provider| ethers.providers.JsonRpcProvider >;

  /* maps */
  seriesø: Observable<Map<string, ISeries>>;
  assetsø: Observable<Map<string, IAsset>>;
  vaultsø: Observable<Map<string, IVault>>;
  strategiesø: Observable<Map<string, IStrategy>>;

  assetPairsø: Observable<Map<string, IAssetPair>>;
  transactionsø: Observable<Map<string, IYieldProcess>>;

  selectedø: Observable<ISelected>;
  userSettingsø: Observable<IUserSettings>;

  messagesø: Observable<Map<string,IMessage>>;
}

export interface IYieldFunctions {


  updateProvider: (provider: ethers.providers.BaseProvider) => void;
  updateConfig: (config: IYieldConfig) => void;
  updateAccount: (account: string) => void;
  /* selectors */
  selectIlk: (asset: string | IAsset) => void;
  selectBase: (asset: string | IAsset) => void;
  selectVault: (vault: string | IVault) => void;
  selectSeries: (series: string | ISeries, futureSeries: boolean) => void;
  selectStrategy: (strategy: string | IStrategy) => void;

  /* actions */
  borrow: () => Promise<void>;
  repayDebt: any;
  addLiquidity: any;

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

export interface ISeriesRoot extends ISignable{
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
  Native_Token,
  ERC20,
  ERC20_Permit,
  ERC20_DaiPermit,
  ERC20_MKR,
  ERC1155,
  ERC720,
}



export interface IAssetPair {
  id: string;
  baseId: string;
  ilkId: string;
  oracle: string;

  baseDecimals: number;
  ilkDecimals: number;

  minRatio: number;

  minDebtLimit: W3bNumber;
  maxDebtLimit: W3bNumber;
  limitDecimals: number;

  pairPrice: W3bNumber;
  pairTotalDebt: W3bNumber;

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
  baseReserves: W3bNumber;

  fyTokenReserves: W3bNumber;
  fyTokenRealReserves: W3bNumber;
  totalSupply: W3bNumber;

  /* live Contracts */
  fyTokenContract: FYToken;
  poolContract: Pool;

  /*  Baked in token fns */
  getTimeTillMaturity: () => string;
  isMature: () => boolean; // note :  -> use this now instead of seriesIsMature
  getFyTokenAllowance: (acc: string, spender: string) => Promise<BigNumber>;
  getPoolAllowance: (acc: string, spender: string) => Promise<BigNumber>;

  /* User speccific  */
  poolTokens?: W3bNumber | undefined;
  fyTokenBalance?: W3bNumber | undefined;
  poolPercent?: string | undefined;

  /* Extra visual stuff */
  // color?: string;
  // textColor?: string;
  // startColor?: string;
  // endColor?: string;
  // oppositeColor?: string;
  // oppStartColor?: string;
  // oppEndColor?: string;
  // seriesMark?: any; // image
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
  balance: W3bNumber;
}

export interface IDummyVault extends IVaultRoot {}
export interface IVault extends IVaultRoot {
  owner: string;

  underLiquidation: boolean;
  hasBeenLiquidated: boolean;
  liquidationDate?: number;
  liquidationDate_?: string;

  isActive: boolean;

  ink: W3bNumber;
  art: W3bNumber;
  accruedArt: W3bNumber;

  rateAtMaturity: W3bNumber;
  rate: W3bNumber;
  // liquidationPrice_: string;
}

export interface IStrategy extends IStrategyRoot {
  /* live contract */
  strategyContract: Strategy;

  currentSeriesId: string;
  currentPoolAddr: string;
  nextSeriesId: string;

  active: boolean;

  initInvariant?: BigNumber;
  currentInvariant?: BigNumber;
  returnRate?: W3bNumber;

  strategyTotalSupply?: W3bNumber;

  accountBalance?: W3bNumber;
  accountStrategyPercent?: string | undefined;

  strategyPoolContract?: Pool;
  poolTotalSupply?: W3bNumber;

  strategyPoolBalance?: W3bNumber;
  strategyPoolPercent?: string;

  accountPoolBalance?: W3bNumber;
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
  id?: string; // gets randomly generated if none provided
  type?: MessageType; // default: MessageType.INFO
  origin?: any; // default: 'app'
  timeoutOverride?: number; // default: config.defaultTimeout  'inf'
  expired?: boolean; // expires at end of timeout period. default: false
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
  PROCESS_INACTIVE = 'Process inactive',
  SIGNING_APPROVAL_REQUESTED = 'Signing requested',
  APPROVAL_TRANSACTION_PENDING = 'Approval transaction pending',
  SIGNING_APPROVAL_COMPLETE= 'Signing/Approval complete',
  TRANSACTION_REQUESTED = 'Transaction requested ',
  TRANSACTION_PENDING= 'Transaction pending',
  PROCESS_COMPLETE = 'Process complete',
  PROCESS_COMPLETE_TIMEOUT = 'Process complete: timeout',
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

// export enum MenuView {
//   account = 'ACCOUNT',
//   settings = 'SETTINGS',
//   vaults = 'VAULTS',
// }

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

// export interface IBaseHistItem {
//   blockNumber: number;
//   date: number;
//   transactionHash: string;
//   series: ISeries;
//   actionCode: ActionCodes;
//   date_: string;
//   primaryInfo: string;
//   secondaryInfo?: string;
// }

// export interface IHistItemVault extends IBaseHistItem {
//   ilkId: string;
//   ink: BigNumber;
//   art: BigNumber;
//   ink_: String;
//   art_: String;
// }

// export interface IHistItemPosition extends IBaseHistItem {
//   bases: BigNumber;
//   fyTokens: BigNumber;
//   bases_: string;
//   fyTokens_: string;
//   poolTokens?: BigNumber;
//   poolTokens_?: string;
// }