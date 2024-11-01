import {GetInfoType} from "./types";

// 此类用于封装和处理等待结果
// 在构建To实例时，传入getInfoFun处理函数（To设计为类的原因就是方便不同的类实例有自定义的处理函数，这样在请求不同系统接口时很方便处理）
// 等待后返回此类实例
// 最后通过链式调用或普通调用getInfo来获取最终的结果
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