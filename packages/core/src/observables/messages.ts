import { filter, map, Observable, reduce, scan, share, Subject, tap } from 'rxjs';
import { IMessage, MessageType } from '../types';

// TODO: implement this better, handle multiple messages here . also cusotm timer esetting?
const _handleTimeout = (message: IMessage) => {
  setTimeout(() => messages$.next({...message, expired: true }), 2000);
};

/** @internal */
export const messages$: Subject<IMessage> = new Subject();
export const messagesø: Observable<any> = messages$.pipe(
  filter((msg) => !!msg && msg.type !== MessageType.INTERNAL),
  /* add in a timeout, that would fire after a period of time */
  tap((msg) => _handleTimeout(msg)),
  scan((acc: any, curr) => acc.set(curr.id, curr), new Map([])), // update the messsageMap
  share()
);

export const sendMsg = (message: IMessage) => {
  console.log( message);
  /* Push next message with default origin, type, and randomaise id if required. */
  messages$.next({
    origin: 'app',
    type: MessageType.INFO,
    id: Math.random().toString(26).slice(2),
    expired: false,
    ...message,
  });
};


/**
 * Internal messages filters out undefined and doesn't set a timelimit on the messages
 * @internal
 * */
export const internalMessagesø: Observable<any> = messages$.pipe(
  filter((msg) => !!msg && msg.type === MessageType.INTERNAL),
  scan((acc, curr) => acc.set(curr.id, curr), new Map([]))
);

/* export types for convenience */
export { MessageType };
