import ToResult from "./ToResult";
import {GetInfoType, MasApiType, PassToResultType, ShowMessageType} from "./ToResult/types";

/**
 * 获取等待后返回值的方法，在构建To实例时，传入getInfoFun处理函数（To设计为类的原因就是方便不同的类实例有自定义的处理函数，这样在请求不同系统接口时很方便处理）
 * @example
 * const to = new To(x => {
 *   if (x.data.code === 200) return x.data.data
 *   else if (x.data.info) ElMessage.error(x.data.info);
 * });
 * @param getInfoFun 解析返回值方法
 * @param showMessageFun 消息展示方法，如果缺省，使用console.error，它的调用时机为async等待的Promise被拒绝时执行
 */
export default class To<T extends GetInfoType = MasApiType, P extends number = 0> {
  //消息展示方法
  readonly showMessage: ShowMessageType;
  //解析返回值方法
  readonly #getInfoFun: T;

  constructor(getInfoFun: T, showMessageFun?: ShowMessageType) {
    this.#getInfoFun = getInfoFun;
    if (showMessageFun)
      this.showMessage = showMessageFun;
    else {
      this.showMessage = (message: string) => {
        console.error(message)
      };
    }
  }

  async async<R extends Parameters<T>[0]>(promise: Promise<R>, silence = false) {
    return promise.then(data => new ToResult<PassToResultType<P, R>>(data, undefined, this.#getInfoFun))
      .catch(e => {
        if (!silence) {
          let message: string;
          if (typeof e === 'string')
            message = e;
          else if (e.message && typeof e.message === 'string')
            message = e.message;
          else
            message = 'unknown error';
          this.showMessage(message);
        }
        return new ToResult<PassToResultType<P, R>>(undefined, e, this.#getInfoFun);
      });
  }
}