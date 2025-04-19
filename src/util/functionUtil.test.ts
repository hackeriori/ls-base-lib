import {describe, expect, test, it, vi, beforeEach} from 'vitest';
import {funDebounce, funDeepClone, funIdleRun, funTaskRun} from "./functionUtil";

describe('防抖测试', () => {
  const testBounceFun = async (fun: Function, executeTime: number) => {
    return new Promise<void>(resolve => {
      //每100毫秒执行一次
      const handle = setInterval(fun, 100);
      setTimeout(() => {
        clearInterval(handle);
        resolve();
      }, executeTime);
    });
  };
  const delayExecute = async (fun: Function, executeTime: number) => {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        fun();
        resolve();
      }, executeTime);
    });
  };
  test('未防抖', async () => {
    let count = 0;
    await testBounceFun(() => count++, 475);
    expect(count).toBe(4);
  });
  test('防抖执行', async () => {
    let count = 0;
    let deFun = funDebounce(() => count++, 120);
    await testBounceFun(deFun, 475);
    await delayExecute(() => {
    }, 100)
    expect(count).toBe(1);
  });
  test('立即执行，获取返回值', async () => {
    let dataTimes: number[] = [];
    let deFun = funDebounce(() => {
      return Date.now()
    }, 120, true, result => {
      dataTimes.push(result);
    });
    await testBounceFun(deFun, 475);
    await delayExecute(() => {
    }, 100);
    expect(dataTimes.length).toBe(2);
    expect(dataTimes[1] - dataTimes[0]).toBeGreaterThan(400);
  });
  test('防抖取消', async () => {
    let count = 0;
    let deFun = funDebounce(() => count++, 120);
    await testBounceFun(deFun, 475);
    deFun.cancel();
    await delayExecute(() => {
    }, 100)
    expect(count).toBe(0);
  });
  test('绑定上下文，传递参数', async () => {
    class testClass {
      count = 0;
      //run赋值给debounce的返回方法_debounce后，_debounce的this指向就变为了testClass,从而调用
      //fn方法时，由于使用了apply，那么下面的this就指向了testClass，不过这样还是太绕，推荐使用箭头函数显示绑定
      run = funDebounce(function (this: testClass, addNumber: number) {
        this.count += addNumber;
      }, 120)
    }

    let test = new testClass();
    test.run(1)
    await delayExecute(() => {
    }, 50);
    test.run(2)
    await delayExecute(() => {
    }, 200);
    expect(test.count).toBe(2);
  });
});

// 模拟 requestIdleCallback
(global as any).requestIdleCallback = vi.fn((callback) => {
  setTimeout(() => callback({
    timeRemaining: () => 50 // 模拟一个足够的时间片
  }))
});

describe('funIdleRun', () => {
  beforeEach(() => {
    // vitest3.1.0之后，requestIdleCallback被mock，所以这里需要使用虚拟计时器
    vi.useFakeTimers({
      toFake:['setTimeout']
    });
  });
  it('当空闲时间足够时应该执行所有任务', () => {
    const tasks = [1, 2, 3];
    const taskHandler = vi.fn();
    const finishCallback = vi.fn();

    funIdleRun(tasks, taskHandler, finishCallback);
    vi.runAllTimers();

    expect(requestIdleCallback).toHaveBeenCalled();
    expect(taskHandler).toHaveBeenCalledTimes(tasks.length);
    expect(finishCallback).toHaveBeenCalledWith(false); // 完成没有被中断
  });

  it('空数组任务应该不会执行回调', () => {
    const taskHandler = vi.fn();
    const finishCallback = vi.fn();

    funIdleRun([], taskHandler, finishCallback);
    vi.runAllTimers();

    expect(taskHandler).not.toHaveBeenCalled();
    expect(finishCallback).toHaveBeenCalledWith(false); // 直接完成，没有处理任务
  });

  it('当被中断时应该能正常中断', () => {
    const tasks = [1, 2, 3];
    const taskHandler = vi.fn();
    const finishCallback = vi.fn();

    const breakExecution = funIdleRun(tasks, taskHandler, finishCallback);
    breakExecution(); // 中断执行
    vi.runAllTimers();

    expect(requestIdleCallback).toHaveBeenCalled();
    expect(taskHandler).toHaveBeenCalledTimes(0); // 不应执行任何任务
    expect(finishCallback).toHaveBeenCalledWith(true); // 被中断
  });

  it('数字类空任务应该不会执行', () => {
    const taskHandler = vi.fn();
    const finishCallback = vi.fn();

    funIdleRun(0, taskHandler, finishCallback);
    vi.runAllTimers();

    expect(taskHandler).not.toHaveBeenCalled();
    expect(finishCallback).toHaveBeenCalledWith(false); // 直接完成，没有处理任务
  });

  it('数字类任务应该能正常执行', () => {
    const tasks = 5;
    const taskHandler = vi.fn();
    const finishCallback = vi.fn();

    funIdleRun(tasks, taskHandler, finishCallback);
    vi.runAllTimers();

    expect(requestIdleCallback).toHaveBeenCalled();
    expect(taskHandler).toHaveBeenCalledTimes(tasks); // 应该执行对应次任务
    expect(finishCallback).toHaveBeenCalledWith(false); // 完成没有被中断
  });
});

describe('funTaskRun测试', () => {
  beforeEach(() => {
    vi.useFakeTimers(); // 使用 Vitest 的虚拟计时器
  });

  it('应该能使用给定数组正确执行', () => {
    const tasks = [1, 2, 3, 4, 5];
    const taskHandler = vi.fn();
    const finishCallback = vi.fn();

    const numberPerTime = 2;

    funTaskRun(tasks, numberPerTime, taskHandler, finishCallback);

    // 立即推进计时器，让任务开始执行
    vi.runAllTimers();

    // 验证任务处理函数是否按预期被调用
    expect(taskHandler).toHaveBeenCalledTimes(tasks.length);
    expect(taskHandler).toHaveBeenCalledWith(1, 0);
    expect(taskHandler).toHaveBeenCalledWith(2, 1);
    expect(taskHandler).toHaveBeenCalledWith(3, 2);
    expect(taskHandler).toHaveBeenCalledWith(4, 3);
    expect(taskHandler).toHaveBeenCalledWith(5, 4);

    // 验证完成回调是否被正确调用
    expect(finishCallback).toHaveBeenCalledWith(false);
  });

  it('应该能正确中断', () => {
    const tasks = [1, 2, 3, 4, 5];
    const taskHandler = vi.fn();
    const finishCallback = vi.fn();

    const numberPerTime = 2;
    const breakExecution = funTaskRun(tasks, numberPerTime, taskHandler, finishCallback);

    // 立即推进计时器，让任务开始执行
    vi.runOnlyPendingTimers();

    // 中断任务
    breakExecution();

    // 再次推进计时器
    vi.runAllTimers();

    // 验证任务处理函数是否被调用（由于每次执行两次任务，加上执行一次之后中断，实际只运行了两次，后面的没有运行）
    expect(taskHandler).toHaveBeenCalledTimes(2);
    expect(finishCallback).toHaveBeenCalledWith(true);
  });

  it('当没有任务的时候，应该能正确执行完成回调', () => {
    const taskHandler = vi.fn();
    const finishCallback = vi.fn();

    const numberPerTime = 2;
    funTaskRun([], numberPerTime, taskHandler, finishCallback);

    // 验证完成回调是否被正确调用
    expect(finishCallback).toHaveBeenCalledWith(false);
  });

  it('使用数字代替数组的时候，不应该报错', () => {
    const taskHandler = vi.fn();
    const finishCallback = vi.fn();

    expect(() => {
      funTaskRun(5, 2, taskHandler, finishCallback);
      vi.runAllTimers();
    }).not.toThrow();
    // 验证完成回调是否被正确调用
    expect(finishCallback).toHaveBeenCalledWith(false);
  });
});

describe('funDeepClone测试', () => {
  it('克隆基本数据类型', () => {
    expect(funDeepClone(123)).toBe(123);
    expect(funDeepClone('hello')).toBe('hello');
    expect(funDeepClone(true)).toBe(true);
    expect(funDeepClone(null)).toBe(null);
    expect(funDeepClone(undefined)).toBe(undefined);
  });

  it('克隆Date对象', () => {
    const date = new Date();
    const clonedDate = funDeepClone(date);
    expect(clonedDate).not.toBe(date);
    expect(clonedDate.getTime()).toBe(date.getTime());
  });

  it('克隆数组', () => {
    const arr = [1, 2, {a: 3}];
    const clonedArr = funDeepClone(arr);
    expect(clonedArr).not.toBe(arr);
    expect(clonedArr).toEqual(arr);
    expect(clonedArr[2]).not.toBe(arr[2]);
  });

  it('克隆对象', () => {
    const obj = {a: 1, b: {c: 2}};
    const clonedObj = funDeepClone(obj);
    expect(clonedObj).not.toBe(obj);
    expect(clonedObj).toEqual(obj);
    expect(clonedObj.b).not.toBe(obj.b);
  });

  it('克隆嵌套对象', () => {
    const nestedObj = {a: 1, b: {c: 2, d: {e: 3}}};
    const clonedNestedObj = funDeepClone(nestedObj);
    expect(clonedNestedObj).not.toBe(nestedObj);
    expect(clonedNestedObj).toEqual(nestedObj);
    expect(clonedNestedObj.b).not.toBe(nestedObj.b);
    expect(clonedNestedObj.b.d).not.toBe(nestedObj.b.d);
  });

  it('克隆包含数组的对象', () => {
    const objWithArray = {a: 1, b: [2, 3, {c: 4}]};
    const clonedObjWithArray = funDeepClone(objWithArray);
    expect(clonedObjWithArray).not.toBe(objWithArray);
    expect(clonedObjWithArray).toEqual(objWithArray);
    expect(clonedObjWithArray.b).not.toBe(objWithArray.b);
    expect(clonedObjWithArray.b[2]).not.toBe(objWithArray.b[2]);
  });

  it('克隆包含循环引用的对象', () => {
    const obj: any = {a: 1};
    obj.b = obj;
    expect(() => funDeepClone(obj)).not.toThrow('Unable to clone object: unsupported type');
  });
});
