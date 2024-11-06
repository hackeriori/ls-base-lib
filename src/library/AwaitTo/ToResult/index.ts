import {GetInfoType} from "./types";

/**
 * 等待后返回此类实例
 * 最后通过链式调用或普通调用getInfo来获取最终的结果
 * 如果没有错误发生，getInfo返回处理函数的返回内容
 * 如果有错误发生，getInfo返回undefined
 */
export default class ToResult<T extends GetInfoType> {
  readonly #getInfoFun: GetInfoType;
  readonly err: any;
  readonly data: Parameters<T>[0] | undefined;

  constructor(_data: Parameters<T>[0] | undefined, _err: any, _getInfoFun: GetInfoType) {
    this.data = _data;
    this.#getInfoFun = _getInfoFun;
    this.err = _err;
  }

  // 获取单个异步等待处理结果
  getInfo(): ReturnType<T> | undefined {
    if (this.data)
      return this.#getInfoFun(this.data);
  }
}