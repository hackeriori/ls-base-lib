import {describe, it, expect, vi} from 'vitest';
import {EventDispatcher} from './EventDispatcher';
import type {BaseEvent} from './types'; // 假设你的文件名为 EventDispatcher.ts

// 自定义事件接口
interface MyEventMap {
  start: {message: string};
  stop: {reason: string};
}

describe('EventDispatcher测试', () => {
  const event: BaseEvent<'start'> & MyEventMap['start'] = {type: 'start', message: 'vroom vroom!'};

  it('能正确添加事件监听', () => {
    const dispatcher = new EventDispatcher<MyEventMap>();
    const listener = vi.fn();
    dispatcher.addEventListener('start', listener);
    // Check if the listener was added
    expect(dispatcher.hasEventListener('start', listener)).toBe(true);
  });

  it('能正确移除事件监听', () => {
    const dispatcher = new EventDispatcher<MyEventMap>();
    const listener = vi.fn();
    dispatcher.addEventListener('stop', listener);
    dispatcher.removeEventListener('stop', listener);
    // Check if the listener was removed
    expect(dispatcher.hasEventListener('stop', listener)).toBe(false);
  });

  it('能正确派发事件', () => {
    const dispatcher = new EventDispatcher<MyEventMap>();
    const listener = vi.fn();
    dispatcher.addEventListener('start', listener);
    dispatcher.dispatchEvent(event);
    // Check if the listener was called with the correct event
    expect(listener).toHaveBeenCalledWith({type: 'start', message: 'vroom vroom!', target: dispatcher});
  });

  it('如果没有注册事件，应该不会派发', () => {
    const dispatcher = new EventDispatcher<MyEventMap>();
    const listener = vi.fn();
    dispatcher.dispatchEvent(event);
    // Check that listener was not called
    expect(listener).not.toHaveBeenCalled();
  });

  it('事件应该触发多个监听器', () => {
    const dispatcher = new EventDispatcher<MyEventMap>();
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    dispatcher.addEventListener('start', listener1);
    dispatcher.addEventListener('start', listener2);
    dispatcher.dispatchEvent(event);
    // Check that both listeners were called
    expect(listener1).toHaveBeenCalledWith({type: 'start', message: 'vroom vroom!', target: dispatcher});
    expect(listener2).toHaveBeenCalledWith({type: 'start', message: 'vroom vroom!', target: dispatcher});
  });
});