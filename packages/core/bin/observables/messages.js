"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageType = exports.sendMsg = exports.messagesø = exports.messages$ = void 0;
const rxjs_1 = require("rxjs");
const types_1 = require("../types");
Object.defineProperty(exports, "MessageType", { enumerable: true, get: function () { return types_1.MessageType; } });
// TODO: implement this better, handle multiple messages here . also cusotm timer esetting?
const _handleTimeout = (msg) => {
    let _tOut;
    clearTimeout(_tOut);
    _tOut = setTimeout(() => (msg === null || msg === void 0 ? void 0 : msg.message) && exports.messages$.next(undefined), 2000);
};
/** @internal */
exports.messages$ = new rxjs_1.Subject();
exports.messagesø = exports.messages$.pipe((0, rxjs_1.tap)((msg) => _handleTimeout(msg)), (0, rxjs_1.share)());
const sendMsg = (message) => {
    /* push next message with default origin and type */
    exports.messages$.next(Object.assign({ origin: 'app', type: types_1.MessageType.INFO }, message));
};
exports.sendMsg = sendMsg;
//# sourceMappingURL=messages.js.map