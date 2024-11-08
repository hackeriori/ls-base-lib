import ToResult from "./ToResult";
import {
  MasAxiosResponseType, type TransMasFunType, TransFunType, IsSuccessType, type AwaitToEventMap
} from "./ToResult/types";
import type {AxiosResponse} from "axios";
import {EventDispatcher} from "../EventDispatcher";

/**
 * 获取等待axios后返回值的方法，在构建To实例时，传入getInfoFun处理函数（To设计为类的原因就是方便不同的类实例有自定义的处理函数，这样在请求不同系统接口时很方便处理）
 * @example
 * function isSuccess(x: MasAxiosResponseType) {
 *   return x.data.code === 200;
 * }
 *
 * const to = new AxiosTo(x => {
 *   if (isSuccess(x)) return x.data.data
 *   else if (x.data.info) ElMessage.error(x.data.info);
 * }, isSuccess);
 * @example
 * // 如果有其他的返回类型，可以参考以下方法进行扩展，方便对接多个系统
 * type OtherType<T> = {
 *   status: number,
 *   response: T,
 *   message: string,
 * };
 * type OtherAxiosResponse<T = unknown> = AxiosResponse<OtherType<T>>;
 * type TransOtherFunType<T extends AxiosResponse> = T extends OtherAxiosResponse<infer R> ? R : never
 * declare class OtherTo<T extends AxiosResponse = OtherAxiosResponse> {
 *   showMessage: (message: string) => void;
 *   constructor(getInfoFun: TransFunType<T>, isSuccessFun: IsSuccessType<T>);
 *   async<R extends T>(promise: Promise<R>, silence?: boolean): Promise<ToResult<R, TransOtherFunType<R>>>;
 * }
 *
 * function isSuccess(x: OtherAxiosResponse) {
 *   return x.data.status === 200;
 * }
 *
 * const to = new AxiosTo<OtherAxiosResponse>(x => {
 *   if (isSuccess(x)) {
 *     return x.data.response
 *   }
 * },isSuccess) as OtherTo;
 * @param getInfoFun 解析返回值方法
 * @param showMessageFun 消息展示方法，如果缺省，使用console.error，它的调用时机为async等待的Promise被拒绝时执行
 */
export default class AxiosTo<T extends AxiosResponse = MasAxiosResponseType> extends EventDispatcher<AwaitToEventMap> {
  // 解析Promise返回值方法
  readonly #getInfoFun: TransFunType<T>;
  // 判断返回值是否成功的方法（业务层面）
  readonly #isSuccessFun: IsSuccessType<T>;

  constructor(getInfoFun: TransFunType<T>, isSuccessFun: IsSuccessType<T>) {
    super();
    this.#getInfoFun = getInfoFun;
    this.#isSuccessFun = isSuccessFun;
  }

  /**
   * 等待一个Promise，返回一个ToResult类的实例，通过调用实例方法的getInfo方法获取解析值
   * @param promise
   * @param silence 是否静默，如果为真，当请求失败时不会调用showMessage方法
   */
  async async<R extends T>(promise: Promise<R>, silence = false) {
    // 由于T类型中含有未知项，如果直接使用T类型来算，那么TransFunReturnType必定返回unknown，由于每次调用async时等待的类型不一样，所以该方法需要定义一个泛型继承自T来表示promise的类型
    return promise.then(data => new ToResult<R, TransMasFunType<R>>(data, undefined, this.#getInfoFun, this.#isSuccessFun(data)))
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
        this.dispatchEvent({type: 'error', error: e});
        return new ToResult<R, TransMasFunType<R>>(undefined, e, this.#getInfoFun, false);
      });
  }

  showMessage(message: string) {
    console.error(message)
  }
}