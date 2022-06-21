import { Observable } from 'rxjs';
import { IMessage, MessageType } from '../types';
export declare const messagesø: Observable<Map<string, IMessage>>;
export declare const sendMsg: (message: IMessage) => void;
/**
 * Internal messages filters out undefined and doesn't set a timelimit on the messages
 * @internal
 **/
export declare const internalMessagesø: Observable<any>;
export { MessageType };
