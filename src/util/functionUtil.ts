import type {DebounceReturnFunType, TaskDoneType, TaskHandlerType} from './types';

/**
 * 创建一个防抖函数，限制函数在指定时间内只能被调用一次。
 *
 * @param fn - 要防抖处理的函数。
 * @param delay - 防抖时间间隔，单位为毫秒。
 * @param immediate - 是否立即执行函数，默认为 `false`。如果设置为 `true`，则在延迟前立即执行函数。
 * @param resultCallback - 可选参数，用于处理防抖后函数的返回结果。
 * @returns 返回一个防抖后的函数。
 *
 * @example
 * ```typescript
 * const handleResize = funDebounce(() => {
 *   console.log('Window resized');
 * }, 200);
 * window.addEventListener('resize', handleResize);
 * ```
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
 * 分片执行任务（使用浏览器空闲时间执行，如果页面在任务重的情况下（例如三维渲染），几乎没有空闲时间执行回调）
 * @param tasks 任务数组或任务的执行次数
 * @param taskHandler 执行任务的具体方法，两个参数，task任务，index任务对应的序号。
 * @param finishCallback 执行完成回调，一个参数，isBreak是否被中断
 * @return 任务中断方法
 *
 * @example
 * const tasks = [1, 2, 3, 4, 5];
 * const taskHandler = (task: number) => {
 *   console.log(`Processing task ${task}`);
 * };
 * const finishCallback = (isBreak: boolean) => {
 *   if (isBreak) {
 *     console.log('Execution interrupted');
 *   } else {
 *     console.log('All tasks completed');
 *   }
 * };
 *
 * const breakExec = funIdleRun(tasks, taskHandler, finishCallback);
 * // 执行任务...
 * // 如果需要中断执行，可以调用 breakExec() 函数
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
 * 分片执行任务（使用宏任务执行）<br/>
 * 这里之所以不使用每次任务后判断执行时间是否超过17ms来自动中断任务，是因为performance.now()是个重方法，它的执行时间大概比计算慢1000倍，这样导致整个任务周期内，80%的时间用于时间比较。
 * @param tasks 任务数组或任务的执行次数
 * @param numberPerTime 每个时间片执行的任务数量，需要自行评估该数量（可以使用performance.now()计算大致时间，尽量控制在17ms）
 * @param taskHandler 执行任务的具体方法，两个参数，task任务，index任务对应的序号。
 * @param finishCallback 执行完成回调，一个参数，isBreak是否被中断
 * @return 任务中断方法
 *
 * @example
 * const tasks = [1, 2, 3, 4, 5];
 * const taskHandler = (task: number) => {
 *   console.log(`Processing task ${task}`);
 * };
 * const finishCallback = (isBreak: boolean) => {
 *   if (isBreak) {
 *     console.log('Execution interrupted');
 *   } else {
 *     console.log('All tasks completed');
 *   }
 * };
 *
 * const breakExec = funTaskRun(tasks, 2, taskHandler, finishCallback);
 * // 执行任务...
 * // 如果需要中断执行，可以调用 breakExec() 函数
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