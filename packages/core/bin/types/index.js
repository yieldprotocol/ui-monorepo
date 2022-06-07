"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionCodes = exports.YieldColors = exports.AddLiquidityType = exports.ActionType = exports.TradeType = exports.MenuView = exports.ProcessStage = exports.TxState = exports.MessageType = exports.ApprovalMethod = exports.TokenType = exports.RoutedActions = exports.LadleActions = void 0;
var operations_1 = require("./operations");
Object.defineProperty(exports, "LadleActions", { enumerable: true, get: function () { return operations_1.LadleActions; } });
Object.defineProperty(exports, "RoutedActions", { enumerable: true, get: function () { return operations_1.RoutedActions; } });
var TokenType;
(function (TokenType) {
    TokenType[TokenType["ERC20_"] = 0] = "ERC20_";
    TokenType[TokenType["ERC20_Permit"] = 1] = "ERC20_Permit";
    TokenType[TokenType["ERC20_DaiPermit"] = 2] = "ERC20_DaiPermit";
    TokenType[TokenType["ERC20_MKR"] = 3] = "ERC20_MKR";
    TokenType[TokenType["ERC1155_"] = 4] = "ERC1155_";
    TokenType[TokenType["ERC720_"] = 5] = "ERC720_";
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
    ProcessStage[ProcessStage["PROCESS_INACTIVE"] = 0] = "PROCESS_INACTIVE";
    ProcessStage[ProcessStage["SIGNING_APPROVAL_REQUESTED"] = 1] = "SIGNING_APPROVAL_REQUESTED";
    ProcessStage[ProcessStage["APPROVAL_TRANSACTION_PENDING"] = 2] = "APPROVAL_TRANSACTION_PENDING";
    ProcessStage[ProcessStage["SIGNING_APPROVAL_COMPLETE"] = 3] = "SIGNING_APPROVAL_COMPLETE";
    ProcessStage[ProcessStage["TRANSACTION_REQUESTED"] = 4] = "TRANSACTION_REQUESTED";
    ProcessStage[ProcessStage["TRANSACTION_PENDING"] = 5] = "TRANSACTION_PENDING";
    ProcessStage[ProcessStage["PROCESS_COMPLETE"] = 6] = "PROCESS_COMPLETE";
    ProcessStage[ProcessStage["PROCESS_COMPLETE_TIMEOUT"] = 7] = "PROCESS_COMPLETE_TIMEOUT";
})(ProcessStage = exports.ProcessStage || (exports.ProcessStage = {}));
var MenuView;
(function (MenuView) {
    MenuView["account"] = "ACCOUNT";
    MenuView["settings"] = "SETTINGS";
    MenuView["vaults"] = "VAULTS";
})(MenuView = exports.MenuView || (exports.MenuView = {}));
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
//# sourceMappingURL=index.js.map