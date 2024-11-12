import {TransFunType} from "./types";
import type {AxiosResponse} from "axios";
import type {AxiosTo} from '../index';

/**
 * 不需要单独实例化此类，由{@link AxiosTo#async}返回此类实例
 */
export class ToResult<T extends AxiosResponse, R> {
  readonly #getInfoFun: TransFunType<T>;
  /** 错误信息 */
  readonly err: any;
  /** axios的原始返回值 */
  readonly data: T | undefined;
  /** 业务层面响应是否成功 */
  readonly isSuccess: boolean;

  constructor(_data: T | undefined, _err: any, _getInfoFun: TransFunType<T>, _isSuccess:boolean) {
    this.data = _data;
    this.#getInfoFun = _getInfoFun;
    this.err = _err;
    this.isSuccess = _isSuccess;
  }

  /**
   * 获取{@link ToResult#data}经{@link AxiosTo}.#getInfoFun方法解析后得到的返回值
   */
  getInfo(): R | undefined {
    if (this.data)
      return this.#getInfoFun(this.data);
  }
}