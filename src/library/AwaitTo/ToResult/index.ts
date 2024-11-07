import {TransFunType} from "./types";
import type {AxiosResponse} from "axios";

/**
 * 等待后返回此类实例
 * 最后通过链式调用或普通调用getInfo来获取最终的结果
 * 如果没有错误发生，getInfo返回处理函数的返回内容
 * 如果有错误发生，getInfo返回undefined
 */
export default class ToResult<T extends AxiosResponse, R> {
  readonly #getInfoFun: TransFunType<T>;
  readonly err: any;
  readonly data: T | undefined;

  constructor(_data: T | undefined, _err: any, _getInfoFun: TransFunType<T>) {
    this.data = _data;
    this.#getInfoFun = _getInfoFun;
    this.err = _err;
  }

  // 获取单个异步等待处理结果
  getInfo(): R | undefined {
    if (this.data)
      return this.#getInfoFun(this.data);
  }
}