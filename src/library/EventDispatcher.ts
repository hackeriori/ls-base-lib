import {arrRemove} from "../util/arrayUtil";

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
  event: TEventData & Event<TEventType, TTarget>,
) => void;

/**
 * 事件派发类
 * @example
 * ```typescript
 * interface MyEventMap {
 *   start: {
 *     message: string
 *   }
 * }
 * // 将事件添加到自定义对象
 * class Car extends EventDispatcher<MyEventMap> {
 *   start() {
 *     this.dispatchEvent({type: 'start', message: 'vroom vroom!'});
 *   }
 * }
 * // 订阅事件
 * const car = new Car();
 * car.addEventListener('start', (event) => {
 *   console.log(event.message);
 * });
 * car.start();
 * ```
 * @see {@link https://github.com/mrdoob/eventdispatcher.js mrdoob EventDispatcher on GitHub}
 */
class EventDispatcher<TEventMap extends Record<string, unknown> = {}> {
  #listeners: Record<string, EventListener<TEventMap[T], T, this>[]>

  /**
   * 添加一个监听器到某个事件类型
   * @param type 事件类型
   * @param listener 监听器，一个回调函数
   */
  addEventListener<T extends keyof TEventMap>(type: T, listener: EventListener<TEventMap[T], T, this>) {
    if (this.#listeners === undefined) this.#listeners = {};
    if (this.#listeners[type] === undefined) {
      this.#listeners[type] = [];
    }
    if (this.#listeners[type].indexOf(listener) === -1) {
      this.#listeners[type].push(listener);
    }
  }

  /**
   * 是否有某个监听器监听某个事件类型
   * @param type 事件类型
   * @param listener 监听器，一个回调函数
   */
  hasEventListener<T extends keyof TEventMap>(type: T, listener: EventListener<TEventMap[T], T, this>) {
    if (this.#listeners === undefined) return false;
    return this.#listeners[type] !== undefined && this.#listeners[type].indexOf(listener) !== -1;
  }

  /**
   * 移除某个事件类型的某个监听器
   * @param type 事件类型
   * @param listener 监听器，一个回调函数
   */
  removeEventListener<T extends keyof TEventMap>(type: T, listener: EventListener<{}, T, this>) {
    if (this.#listeners === undefined) return;
    const listenerArray = this.#listeners[type];
    if (listenerArray !== undefined) {
      const index = listenerArray.indexOf(listener);
      if (index !== -1) {
        arrRemove(listenerArray, index);
      }
    }
  }

  /**
   * 触发一个事件
   * @param event 待触发的事件
   */
  dispatchEvent<T extends keyof TEventMap>(event: BaseEvent<T> & TEventMap[T]) {
    if (this.#listeners === undefined) return;
    const listenerArray = this.#listeners[event.type];
    if (listenerArray !== undefined) {
      event.target = this;
      // 复制一份，以防迭代时被外部移除。.
      const array = listenerArray.slice(0);
      for (let i = 0, l = array.length; i < l; i++) {
        array[i].call(this, event);
      }
    }
  }
}

export {EventDispatcher};
