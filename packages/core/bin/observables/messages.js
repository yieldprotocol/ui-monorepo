"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageType = exports.internalMessagesø = exports.sendMsg = exports.messagesø = void 0;
const rxjs_1 = require("rxjs");
const types_1 = require("../types");
Object.defineProperty(exports, "MessageType", { enumerable: true, get: function () { return types_1.MessageType; } });
// TODO: implement this better, handle multiple messages here . also custom timer esetting?
const _handleTimeout = (message) => {
    const waitMs = message.timeoutOverride || 2000;
    /* If inifinty is passed in assume the message is persistent in the log, ie. don't bother cancelling */
    if (waitMs !== Infinity)
        setTimeout(() => messages$.next(Object.assign(Object.assign({}, message), { expired: true })), waitMs);
};
const messages$ = new rxjs_1.Subject();
exports.messagesø = messages$.pipe((0, rxjs_1.filter)((msg) => !!msg && msg.type !== types_1.MessageType.INTERNAL), 
/* add in a timeout, that would fire after a period of time */
(0, rxjs_1.tap)((msg) => !msg.expired && _handleTimeout(msg)), 
/* update and return new map */
(0, rxjs_1.scan)((acc, curr) => new Map(acc.set(curr.id, curr)), new Map([])), (0, rxjs_1.share)());
const sendMsg = (message) => {
    /* Push next message with default origin, type, and randomaise id if required. */
    messages$.next(Object.assign({ origin: 'app', type: types_1.MessageType.INFO, id: Math.random().toString(26).slice(2), expired: false }, message));
};
exports.sendMsg = sendMsg;
/**
 * Internal messages filters out undefined and doesn't set a timelimit on the messages
 **/
exports.internalMessagesø = messages$.pipe((0, rxjs_1.filter)((msg) => !!msg && msg.type === types_1.MessageType.INTERNAL), (0, rxjs_1.scan)((acc, curr) => acc.set(curr.id, curr), new Map([])), (0, rxjs_1.shareReplay)(1));
//# sourceMappingURL=messages.js.map