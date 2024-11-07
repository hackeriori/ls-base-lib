import ToResult from "./ToResult";
import {MasAxiosResponseType, ShowMessageType, type TransFunReturnType, TransFunType} from "./ToResult/types";
import type {AxiosResponse} from "axios";

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
export default class To<T extends AxiosResponse = MasAxiosResponseType> {
  // 消息展示方法
  readonly showMessage: ShowMessageType;
  // 解析返回值方法
  readonly #getInfoFun: TransFunType<T>;

  constructor(getInfoFun: TransFunType<T>, showMessageFun?: ShowMessageType) {
    this.#getInfoFun = getInfoFun;
    if (showMessageFun)
      this.showMessage = showMessageFun;
    else {
      this.showMessage = (message: string) => {
        console.error(message)
      };
    }
  }

  /**
   * 等待一个Promise，返回一个ToResult类的实例，通过调用实例方法的getInfo方法获取解析值
   * @param promise
   * @param silence 是否静默，如果为真，当请求失败时不会调用showMessage方法
   */
  async async<R extends T>(promise: Promise<R>, silence = false) {

    // 由于T类型中含有未知项，如果直接使用T类型来算，那么TransFunReturnType必定返回unknown，由于每次调用async时等待的类型不一样，所以该方法需要定义一个泛型继承自T来表示promise的类型
    return promise.then(data => new ToResult<R, TransFunReturnType<R>>(data, undefined, this.#getInfoFun))
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
        return new ToResult<R, TransFunReturnType<R>>(undefined, e, this.#getInfoFun);
      });
  }
}