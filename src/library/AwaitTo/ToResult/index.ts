import {TransFunType} from "./types";
import type {AxiosResponse} from "axios";

/**
 * 等待Promise后返回此类实例
 * 最后通过链式调用或普通调用getInfo来获取最终的结果
 * 如果没有错误发生，getInfo返回处理函数的返回内容
 * 如果有错误发生，getInfo返回undefined
 * 通过isSuccess属性判断业务响应是否成功（例如业务返回code200但data为空的情况，无法通过getInfo的返回值判断）
 */
export default class ToResult<T extends AxiosResponse, R> {
  readonly #getInfoFun: TransFunType<T>;
  readonly err: any;
  readonly data: T | undefined;
  // 业务响应是否成功
  readonly isSuccess: boolean;

  constructor(_data: T | undefined, _err: any, _getInfoFun: TransFunType<T>, _isSuccess:boolean) {
    this.data = _data;
    this.#getInfoFun = _getInfoFun;
    this.err = _err;
    this.isSuccess = _isSuccess;
  }

  // 获取单个异步等待处理结果
  getInfo(): R | undefined {
    if (this.data)
      return this.#getInfoFun(this.data);
  }
}