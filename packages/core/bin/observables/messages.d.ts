import { Observable, Subject } from 'rxjs';
import { IMessage, MessageType } from '../types';
/** @internal */
export declare const messages$: Subject<IMessage>;
export declare const messagesø: Observable<any>;
export declare const sendMsg: (message: IMessage) => void;
/**
 * Internal messages filters out undefined and doesn't set a timelimit on the messages
 * @internal
 * */
export declare const internalMessagesø: Observable<any>;
export { MessageType };
