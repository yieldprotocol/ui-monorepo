import { filter, map, Observable, reduce, scan, share, Subject, tap } from 'rxjs';
import { IMessage, MessageType } from '../types';

// TODO: implement this better, handle multiple messages here . also custom timer esetting?
const _handleTimeout = (message: IMessage) => {
  const waitMs = message.timeoutOverride || 2000;
  /* If inifinty is passed in assume the message is persistent in the log, ie. don't bother cancelling */
  if (waitMs !== Infinity) setTimeout(() => messages$.next({ ...message, expired: true }), waitMs);
};

/** @internal */
const messages$: Subject<IMessage> = new Subject();

export const messagesø: Observable<Map<string,IMessage>> = messages$.pipe(
  filter((msg) => !!msg && msg.type !== MessageType.INTERNAL),
  /* add in a timeout, that would fire after a period of time */
  tap((msg) => !msg.expired && _handleTimeout(msg)),
  /* update and return new map */
  scan((acc: any, curr) => new Map(acc.set(curr.id, curr)), new Map([])),
  share()
);

export const sendMsg = (message: IMessage) => {
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
 **/
export const internalMessagesø: Observable<any> = messages$.pipe(
  filter((msg) => !!msg && msg.type === MessageType.INTERNAL),
  scan((acc, curr) => acc.set(curr.id, curr), new Map([]))
);

/* export types for convenience */
export { MessageType };
