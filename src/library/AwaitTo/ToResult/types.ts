import type {AxiosResponse} from "axios";

// AwaitTo事件类型
export interface AwaitToEventMap {
  error: {
    error: any
  }
}

/**
 * 梅安森响应体类型
 * @property code 状态码
 * @property info 信息
 * @property data 数据
 */
export interface MasResponseType<T> {
  // 状态码
  code: number,
  // 信息
  info: string,
  // 数据
  data: T,
}

// 判断返回值是否成功（业务层面）的方法类型
export type IsSuccessType<T extends AxiosResponse> = (data: T) => boolean;
// 转换类型函数类型
export type TransFunType<T extends AxiosResponse> = (data: T) => any
// 梅安森axios响应类型
export type MasAxiosResponseType<T = unknown> = AxiosResponse<MasResponseType<T>>;
// 转换函数返回类型
export type TransMasFunType<T extends AxiosResponse> = T extends MasAxiosResponseType<infer R> ? R : never
