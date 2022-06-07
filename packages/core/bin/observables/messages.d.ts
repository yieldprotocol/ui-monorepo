import { Observable, Subject } from 'rxjs';
import { IMessage, MessageType } from '../types';
/** @internal */
export declare const messages$: Subject<IMessage | undefined>;
export declare const messagesø: Observable<IMessage | undefined>;
export declare const sendMsg: (message: IMessage) => void;
export { MessageType };
