import type {AxiosResponse} from "axios";

export interface APIResponse<T> {
  //状态码
  code: number,
  //信息
  info: string,
  //数据
  data: T,
}

export type ShowMessageType = (message: string) => void;
//总基类泛型
export type GetInfoType = (data: any) => any;
//默认泛型
export type DefaultGetInfoType<P = unknown> = (data: P) => P;
//梅安森接口泛型
export type MasApiType<P extends AxiosResponse<APIResponse<unknown>> = AxiosResponse<APIResponse<unknown>>> = (x: P) =>
  P extends AxiosResponse<APIResponse<infer R>> ? (R | undefined) : any;
//获取async方法的具体T类型
export type PassToResultType<T extends number, R> = T extends 0 ?
  DefaultGetInfoType<R> :
  R extends AxiosResponse<APIResponse<unknown>> ?
    MasApiType<R> : GetInfoType
