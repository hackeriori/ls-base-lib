import {ToResult} from "./ToResult";
import {
  MasAxiosResponseType, type TransMasFunType, TransFunType, IsSuccessType, type AwaitToEventMap
} from "./ToResult/types";
import type {AxiosResponse} from "axios";
import {EventDispatcher} from "../EventDispatcher";

/**
 * {@link https://www.npmjs.com/package/axios axios}通过get、post等方法获取数据后，返回Promise，此类等待并获取Promise的结果。
 * @example
 * ```typescript
 * function isSuccess(x: MasAxiosResponseType) {
 *   return x.data.code === 200;
 * }
 *
 * const to = new AxiosTo(x => {
 *   if (isSuccess(x)) return x.data.data
 *   else if (x.data.info) ElMessage.error(x.data.info);
 * }, isSuccess);
 * to.showMessage = (message: string) => ElMessage.error(message);
 * ```
 * @example
 * ```typescript
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
 * to.showMessage = (message: string) => ElMessage.error(message);
 * ```
 */
export class AxiosTo<T extends AxiosResponse = MasAxiosResponseType> extends EventDispatcher<AwaitToEventMap> {
  /** 解析Promise返回值的方法 */
  readonly #getInfoFun: TransFunType<T>;
  /** 判断返回值是否成功的方法（业务层面） */
  readonly #isSuccessFun: IsSuccessType<T>;

  /**
   * @param getInfoFun 解析Promise返回值的方法
   * @param isSuccessFun 在业务层面判断返回值是否成功的方法
   */
  constructor(getInfoFun: TransFunType<T>, isSuccessFun: IsSuccessType<T>) {
    super();
    this.#getInfoFun = getInfoFun;
    this.#isSuccessFun = isSuccessFun;
  }

  /**
   * 等待{@link https://www.npmjs.com/package/axios axios}的get、post等方法返回Promise（promise参数），返回{@link ToResult}类，调用返回类的{@link ToResult#getInfo}方法进而获取解析值，
   * 如果Promise被拒绝，错误不会抛出，可通过返回类的{@link ToResult#err}属性获取错误信息，另外根据silence参数，决定错误发生时是否显示错误。
   * @param promise {@link https://www.npmjs.com/package/axios axios}返回的的Promise
   * @param silence 是否静默，默认值为false，如果为true，当请求失败时不会调用{@link AxiosTo#showMessage}方法显示错误信息
   */
  async async<R extends T>(promise: Promise<R>, silence = false) {
    // 由于T类型中含有未知项，如果直接使用T类型来算，那么TransFunReturnType必定返回unknown，由于每次调用async时等待的类型不一样，所以该方法需要定义一个泛型继承自T来表示promise的类型
    return promise.then(data => new ToResult<R, TransMasFunType<R>>(data, undefined, this.#getInfoFun, this.#isSuccessFun(data)))
      .catch(e => {
        if (!silence) {
          let message: string;
          if (typeof e === 'string')
            message = e;
          else if (typeof e.message === 'string')
            message = e.message;
          else
            message = 'unknown error';
          this.showMessage(message);
        }
        this.dispatchEvent({type: 'error', error: e});
        return new ToResult<R, TransMasFunType<R>>(undefined, e, this.#getInfoFun, false);
      });
  }

  /**
   * 当promise被拒绝时，显示错误信息的方法，默认使用console.error打印消息，一般在{@link AxiosTo}实例化后，重写此方法。
   * @param message 错误消息
   */
  showMessage(message: string) {
    console.error(message)
  }
}