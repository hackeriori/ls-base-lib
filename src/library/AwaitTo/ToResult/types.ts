import type {AxiosResponse} from "axios";
// 梅安森响应体类型
export interface MasResponseType<T> {
  // 状态码
  code: number,
  // 信息
  info: string,
  // 数据
  data: T,
}
// 消息展示方法类型
export type ShowMessageType = (message: string) => void;
// 转换类型函数类型
export type TransFunType<T extends AxiosResponse> = (data: T) => any
// 梅安森axios响应类型
export type MasAxiosResponseType<T = unknown> = AxiosResponse<MasResponseType<T>>;
// 转换函数返回类型
export type TransMasFunType<T extends AxiosResponse> = T extends MasAxiosResponseType<infer R> ? R : never
