import { BehaviorSubject, filter, Observable, share, Subject, tap } from 'rxjs';
import { IMessage, MessageType } from '../types';

// TODO: implement this better, handle multiple messages here . also cusotm timer esetting?
const _handleTimeout = (msg: IMessage | undefined) => {
  let _tOut;
  clearTimeout(_tOut);
  _tOut = setTimeout(() => msg?.message && messages$.next(undefined), 2000);
};

/** @internal */
export const messages$ = new Subject<IMessage | undefined>();
export const messagesø = messages$.pipe<IMessage | undefined, IMessage | undefined>(
  tap((msg) => _handleTimeout(msg)),
  share()
);

export const sendMsg = (message: IMessage) => {
  /* push next message with default origin and type */
  messages$.next({ origin: 'app', type: MessageType.INFO, ...message });
};

/* export types for convenience */
export { MessageType };
