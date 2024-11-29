import type {EventDispatcher} from './EventDispatcher'

/**
 * {@link EventDispatcher} 派发的最小基本事件 .
 */
export interface BaseEvent<TEventType extends string = string> {
  readonly type: TEventType;
}

/**
 * {@link EventDispatcher} 派发的已触发事件的最小预期事件.
 */
export interface Event<TEventType extends string = string, TTarget = unknown> {
  readonly type: TEventType;
  readonly target: TTarget;
}

/**
 * {@link EventDispatcher} 的监听事件类型
 */
export type EventListener<TEventData, TEventType extends string, TTarget> = (
  event: TEventData & Event<TEventType, TTarget>
) => void;

/**
 * 扩展的消息事件接口，包含解析后的数据。
 *
 * @template T - 解析后数据的类型。
 * @template U - 是否需要解析数据的标志。
 */
export interface MessageEventExt<T, U> extends MessageEvent<T> {
  parseData: U
}

/**
 * 带有解析数据的消息处理函数类型。
 *
 * @template T - 解析后数据的类型。
 * @template U - 解析后的数据。
 */
export type WSMessageTypeExt<T, U> = (ev: MessageEventExt<T, U>) => void;

/**
 * 无解析数据的消息处理函数类型。
 *
 * @template T - 消息数据的类型。
 */
export type WSMessageType<T> = (ev: MessageEvent<T>) => void;