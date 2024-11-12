import type {AxiosResponse} from "axios";
import type {AxiosTo} from '../index';

/** {@link AxiosTo}的事件类型 */
export interface AwaitToEventMap {
  error: {
    error: any
  }
}
/** 梅安森响应体类型 */
export interface MasResponseType<T> {
  /** 状态码（200表示成功） */
  code: number,
  /** 信息 */
  info: string,
  /** 数据 */
  data: T,
}
/** 判断返回值是否成功（业务层面）的方法的类型 */
export type IsSuccessType<T extends AxiosResponse> = (data: T) => boolean;
/** 解析AxiosResponse的方法的类型 */
export type TransFunType<T extends AxiosResponse> = (data: T) => any
/** 梅安森axios响应类型 */
export type MasAxiosResponseType<T = unknown> = AxiosResponse<MasResponseType<T>>;
/** 解析{@link MasAxiosResponseType}的方法的类型 */
export type TransMasFunType<T extends AxiosResponse> = T extends MasAxiosResponseType<infer R> ? R : never
