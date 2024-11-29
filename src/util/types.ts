/**
 * 树结构类型
 */
export type NodeType<T, ChildKey extends keyof T> = {
  [key in ChildKey]: T[] | null | undefined
}

/**
 * 防抖函数类型
 */
export interface DebounceReturnFunType<T extends (...args: any) => any> {
  (...arg: Parameters<T>): void,

  /**
   * 取消执行
   */
  cancel(): void
}

/**
 * 任务处理回调类型
 */
export type TaskHandlerType<T> = (task: T, index: number) => void;

/**
 * 任务完成回调类型
 */
export type TaskDoneType = (isBreak: boolean) => void;