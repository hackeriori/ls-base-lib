import ArrayLike = jasmine.ArrayLike;

interface DebounceReturnFunType<T extends (...args: any) => any> {
  (...arg: Parameters<T>): void,

  // 取消执行
  cancel(): void
}

type TaskHandlerType<T> = (task: T, index: number) => void;
type TaskDoneType = (isBreak: boolean) => void;

/**
 * 防抖，目标函数在防抖时间内不会执行，每次执行防抖方法都会造成防抖时间延长，超过防抖时间才会执行
 * @param fn 目标函数
 * @param delay 防抖时间
 * @param immediate 是否立即执行
 * @param resultCallback 用于获取目标函数执行结果的回调方法
 */
export function funDebounce<T extends (...args: any) => any>(fn: T, delay: number, immediate = false, resultCallback?: (result: ReturnType<T>) => void) {
  let timer: NodeJS.Timeout | null = null
  //是否已执行
  let isInvoke = false

  const _debounce: DebounceReturnFunType<T> = function (this: any, ...args) {
    if (timer)
      clearTimeout(timer)
    if (immediate && !isInvoke) {
      const result = fn.apply(this, args)
      if (resultCallback)
        resultCallback(result)
      isInvoke = true
    }
    timer = setTimeout(() => {
      const result = fn.apply(this, args)
      if (resultCallback)
        resultCallback(result)
      timer = null
    }, delay)
  }

  _debounce.cancel = function () {
    if (timer) clearTimeout(timer)
    timer = null
  }

  return _debounce
}

/**
 * 分片执行任务（使用空闲时间执行，缺点是页面在任务重的情况下几乎没有时间执行回调）
 * @param tasks 任务数组或任务的执行次数
 * @param taskHandler 执行任务的具体方法，两个参数，task任务，index任务对应的序号。
 * @param finishCallback 执行完成回调，一个参数，isBreak是否被中断
 * @return breaker 任务中断方法
 */
export function funIdleRun<T>(tasks: T[] | number, taskHandler: TaskHandlerType<T>, finishCallback?: TaskDoneType) {
  let _tasks: ArrayLike<T> = Array.isArray(tasks) ? tasks : {length: tasks};
  //当前执行的任务的序号
  let taskIndex = 0;
  //是否被中断
  let isBreak = false;

  function callback(deadline: IdleDeadline) {
    while (deadline.timeRemaining() > 0 && taskIndex < _tasks.length) {
      if (isBreak)
        break;
      else {
        taskHandler(_tasks[taskIndex], taskIndex);
        taskIndex++;
      }
    }
    if (!isBreak && taskIndex < _tasks.length)
      requestIdleCallback(callback);
    else
      finishCallback && finishCallback(isBreak);
  }

  function breakExecution() {
    isBreak = true;
  }

  if (_tasks.length > 0) {
    requestIdleCallback(callback);
  } else
    finishCallback && finishCallback(isBreak);

  return breakExecution;
}

/**
 * 分片执行任务（使用宏任务执行）
 * 这里之所以不使用每次任务后判断执行时间是否超过17ms来自动中断任务，是因为performance.now()是个重方法，它的执行时间大概比计算慢1000倍，这样导致整个任务周期内，80%的时间用于时间比较。
 * @param tasks 任务数组或任务的执行次数
 * @param numberPerTime 每个时间片执行的任务数量，需要自行评估该数量（可以使用performance.now()计算大致时间，尽量控制在17ms）
 * @param taskHandler 执行任务的具体方法，两个参数，task任务，index任务对应的序号。
 * @param finishCallback 执行完成回调，一个参数，isBreak是否被中断
 * @return breaker 任务中断方法
 */
export function funTaskRun<T>(tasks: T[] | number, numberPerTime: number, taskHandler: TaskHandlerType<T>, finishCallback?: TaskDoneType) {
  let _tasks: ArrayLike<T> = Array.isArray(tasks) ? tasks : {length: tasks};
  // 当前执行的任务的序号
  let taskIndex = 0;
  // 是否被中断
  let isBreak = false;

  function processTasks() {
    const taskUpIndex = Math.min(taskIndex + numberPerTime, _tasks.length);
    for (let i = taskIndex; i < taskUpIndex; i++) {
      if (isBreak)
        break;
      else
        taskHandler(_tasks[i], i)
    }
    taskIndex = taskUpIndex;
    if (!isBreak && taskIndex < _tasks.length)
      setTimeout(processTasks);
    else
      finishCallback && finishCallback(isBreak);
  }

  function breakExecution() {
    isBreak = true;
  }

  if (_tasks.length > 0) {
    setTimeout(processTasks);
  } else
    finishCallback && finishCallback(isBreak);

  return breakExecution
}