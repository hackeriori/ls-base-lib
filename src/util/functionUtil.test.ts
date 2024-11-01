import {funDebounce, funTaskRun} from "./functionUtil";

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
})

describe('funTimeoutRun测试', () => {
  it('应按指定的任务执行任务，并在完成后调用doneCallback', async () => {
    // Arrange
    const tasks = [1, 2, 3, 4, 5];
    const numberPerTime = 2;
    const taskHandler = jest.fn();
    const doneCallback = jest.fn();

    // Act
    await new Promise<boolean>(resolve => {
      funTaskRun(tasks, numberPerTime, taskHandler, () => {
        doneCallback(); // call doneCallback after finished executing all tasks
        resolve(true); // resolve the promise after doneCallback is called
      });
    })

    // Assert
    expect(taskHandler).toHaveBeenCalledTimes(5); // 5 tasks in total
    expect(doneCallback).toHaveBeenCalled(); // doneCallback should be called when finished
  });

  it('应正确处理任务数', async () => {
    // Arrange
    const tasks = 3; // number of tasks
    const numberPerTime = 1;
    const taskHandler = jest.fn();
    const doneCallback = jest.fn();

    // Act
    await new Promise<boolean>(resolve => {
      funTaskRun(tasks, numberPerTime, taskHandler, () => {
        doneCallback(); // call doneCallback after finished executing all tasks
        resolve(true); // resolve the promise after doneCallback is called
      });
    })

    // Assert
    expect(taskHandler).toHaveBeenCalledTimes(3); // 3 tasks in total
    expect(doneCallback).toHaveBeenCalled(); // doneCallback should be called when finished
  });

  it('应该能正确中断', async () => {
    // Arrange
    const tasks = [1, 2, 3, 4, 5];
    const numberPerTime = 2;
    let breaker: Function;
    const taskHandler = jest.fn((task: number) => {
      if (task === 3) breaker(); // interrupt at task 3
    });
    let isBreak = false;
    const doneCallback = jest.fn((_isBreak: boolean) => {
      isBreak = _isBreak;
    })

    // Act
    await new Promise<boolean>(resolve => {
      breaker = funTaskRun(tasks, numberPerTime, taskHandler, isBreak => {
        doneCallback(isBreak); // call doneCallback after finished executing all tasks
        resolve(true); // resolve the promise after doneCallback is called
      });
    })

    // Assert
    expect(taskHandler).toHaveBeenCalledTimes(3);
    expect(doneCallback).toHaveBeenCalled();
    expect(isBreak).toBe(true);
  });

  it('应能正确处理空数组', async () => {
    // Arrange
    const tasks: any[] = [];
    const numberPerTime = 2;
    const taskHandler = jest.fn();
    const doneCallback = jest.fn();

    // Act
    await new Promise<boolean>(resolve => {
      funTaskRun(tasks, numberPerTime, taskHandler, () => {
        doneCallback(); // call doneCallback after finished executing all tasks
        resolve(true); // resolve the promise after doneCallback is called
      });
    })

    // Assert
    expect(taskHandler).not.toHaveBeenCalled(); // 0 tasks in total
    expect(doneCallback).toHaveBeenCalled(); // doneCallback should be called when finished
  })
});
