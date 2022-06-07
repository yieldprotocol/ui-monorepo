import { BehaviorSubject, filter, Observable, share, Subject, tap } from 'rxjs';
import { IMessage, MessageType } from '../types';

// TODO: implement this better, handle multiple messages here . also cusotm timer esetting?
const _handleTimeout = (msg: IMessage | undefined) => {
  let _tOut;
  clearTimeout(_tOut);
  _tOut = setTimeout(() => msg?.message && messages$.next(undefined), 2000);
};

/** @internal */
export const messages$: Subject<IMessage | undefined> = new Subject();
export const messagesø: Observable<IMessage | undefined> = messages$.pipe(
  tap((msg) => _handleTimeout(msg)),
  share()
);

export const sendMsg = (message: IMessage) => {
  /* push next message with default origin and type */
  messages$.next({ origin: 'app', type: MessageType.INFO, ...message });
};

/* export types for convenience */
export { MessageType };
