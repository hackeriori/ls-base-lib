import type {AxiosResponse} from "axios";

export interface MasResponseType<T> {
  // 状态码
  code: number,
  // 信息
  info: string,
  // 数据
  data: T,
}

export type ShowMessageType = (message: string) => void;
// 总基类泛型
export type GetInfoType = (data: any) => any;
// 梅安森axios响应类型
export type MasAxiosResponseType<T = unknown> = AxiosResponse<MasResponseType<T>>;
// 梅安森接口泛型
export type MasApiType<P extends MasAxiosResponseType = MasAxiosResponseType> = (x: P) =>
  P extends AxiosResponse<MasResponseType<infer R>> ? (R | undefined) : any;
// 获取async方法的具体T类型
export type PassToResultType<T extends number, R> = T extends 0 ?
  R extends MasAxiosResponseType ?
    MasApiType<R> : never : never
