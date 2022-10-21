"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionCodes = exports.YieldColors = exports.AddLiquidityType = exports.ActionType = exports.TradeType = exports.ProcessStage = exports.TxState = exports.MessageType = exports.ApprovalMethod = exports.TokenType = exports.RoutedActions = exports.LadleActions = void 0;
var operations_1 = require("./operations");
Object.defineProperty(exports, "LadleActions", { enumerable: true, get: function () { return operations_1.LadleActions; } });
Object.defineProperty(exports, "RoutedActions", { enumerable: true, get: function () { return operations_1.RoutedActions; } });
var TokenType;
(function (TokenType) {
    TokenType[TokenType["Native_Token"] = 0] = "Native_Token";
    TokenType[TokenType["ERC20"] = 1] = "ERC20";
    TokenType[TokenType["ERC20_Permit"] = 2] = "ERC20_Permit";
    TokenType[TokenType["ERC20_DaiPermit"] = 3] = "ERC20_DaiPermit";
    TokenType[TokenType["ERC20_MKR"] = 4] = "ERC20_MKR";
    TokenType[TokenType["ERC1155"] = 5] = "ERC1155";
    TokenType[TokenType["ERC720"] = 6] = "ERC720";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
var ApprovalMethod;
(function (ApprovalMethod) {
    ApprovalMethod["TX"] = "TX";
    ApprovalMethod["SIG"] = "SIG";
})(ApprovalMethod = exports.ApprovalMethod || (exports.ApprovalMethod = {}));
var MessageType;
(function (MessageType) {
    MessageType[MessageType["INFO"] = 0] = "INFO";
    MessageType[MessageType["WARNING"] = 1] = "WARNING";
    MessageType[MessageType["ERROR"] = 2] = "ERROR";
    MessageType[MessageType["INTERNAL"] = 3] = "INTERNAL";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
var TxState;
(function (TxState) {
    TxState["PENDING"] = "PENDING";
    TxState["SUCCESSFUL"] = "SUCCESSFUL";
    TxState["FAILED"] = "FAILED";
    TxState["REJECTED"] = "REJECTED";
})(TxState = exports.TxState || (exports.TxState = {}));
var ProcessStage;
(function (ProcessStage) {
    ProcessStage["PROCESS_INACTIVE"] = "Process inactive";
    ProcessStage["SIGNING_APPROVAL_REQUESTED"] = "Signing requested";
    ProcessStage["APPROVAL_TRANSACTION_PENDING"] = "Approval transaction pending";
    ProcessStage["SIGNING_APPROVAL_COMPLETE"] = "Signing/Approval complete";
    ProcessStage["TRANSACTION_REQUESTED"] = "Transaction requested ";
    ProcessStage["TRANSACTION_PENDING"] = "Transaction pending";
    ProcessStage["PROCESS_COMPLETE"] = "Process complete";
    ProcessStage["PROCESS_COMPLETE_TIMEOUT"] = "Process complete: timeout";
})(ProcessStage = exports.ProcessStage || (exports.ProcessStage = {}));
// export enum MenuView {
//   account = 'ACCOUNT',
//   settings = 'SETTINGS',
//   vaults = 'VAULTS',
// }
var TradeType;
(function (TradeType) {
    TradeType["BUY"] = "BUY";
    TradeType["SELL"] = "SELL";
})(TradeType = exports.TradeType || (exports.TradeType = {}));
var ActionType;
(function (ActionType) {
    ActionType["BORROW"] = "BORROW";
    ActionType["LEND"] = "LEND";
    ActionType["POOL"] = "POOL";
})(ActionType = exports.ActionType || (exports.ActionType = {}));
var AddLiquidityType;
(function (AddLiquidityType) {
    AddLiquidityType["BUY"] = "BUY";
    AddLiquidityType["BORROW"] = "BORROW";
})(AddLiquidityType = exports.AddLiquidityType || (exports.AddLiquidityType = {}));
var YieldColors;
(function (YieldColors) {
    YieldColors["SUCCESS"] = "success";
    YieldColors["FAILED"] = "error";
    YieldColors["WARNING"] = "warning";
    YieldColors["GRADIENT"] = "";
    YieldColors["GRADIENT_TRANSPARENT"] = "";
    YieldColors["PRIMARY"] = "";
    YieldColors["SECONDARY"] = "";
})(YieldColors = exports.YieldColors || (exports.YieldColors = {}));
var ActionCodes;
(function (ActionCodes) {
    // COLLATERAL
    ActionCodes["ADD_COLLATERAL"] = "Add Collateral";
    ActionCodes["REMOVE_COLLATERAL"] = "Remove Collateral";
    // BORROW
    ActionCodes["BORROW"] = "Borrow";
    ActionCodes["REPAY"] = "Repay";
    ActionCodes["ROLL_DEBT"] = "Roll Debt";
    // LEND
    ActionCodes["LEND"] = "Lend";
    ActionCodes["CLOSE_POSITION"] = "Redeem Position";
    ActionCodes["ROLL_POSITION"] = "Roll Position";
    ActionCodes["REDEEM"] = "Redeem";
    // POOL
    ActionCodes["ADD_LIQUIDITY"] = "Add Liquidity";
    ActionCodes["REMOVE_LIQUIDITY"] = "Remove Liquidity";
    ActionCodes["ROLL_LIQUIDITY"] = "Roll Liquidity";
    // VAULT
    ActionCodes["DELETE_VAULT"] = "Delete Vault";
    ActionCodes["TRANSFER_VAULT"] = "Transfer Vault";
    ActionCodes["MERGE_VAULT"] = "Merge Vault";
})(ActionCodes = exports.ActionCodes || (exports.ActionCodes = {}));
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
//# sourceMappingURL=index.js.map