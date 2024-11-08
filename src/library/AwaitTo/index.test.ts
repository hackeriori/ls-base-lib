import {describe, expect, test, vi} from 'vitest';
import AxiosTo from './index'
import type {Equal, Expect} from "../../toolTypes";
import {IsSuccessType, type MasAxiosResponseType, type MasResponseType} from "./ToResult/types";
import axios, {type AxiosResponse} from "axios";
import type ToResult from "./ToResult";
import {ShowMessageType, TransFunType} from "../../../dist/src/library/AwaitTo/ToResult/types";

type OtherType<T> = {
  status: number,
  response: T,
  message: string,
};
type OtherAxiosResponse<T = unknown> = AxiosResponse<OtherType<T>>;
type TransOtherFunType<T extends AxiosResponse> = T extends OtherAxiosResponse<infer R> ? R : never

declare class OtherTo<T extends AxiosResponse = OtherAxiosResponse> {
  showMessage: ShowMessageType;

  constructor(getInfoFun: TransFunType<T>, isSuccessFun: IsSuccessType<T>);

  async<R extends T>(promise: Promise<R>, silence?: boolean): Promise<ToResult<R, TransOtherFunType<R>>>;
}

describe('测试To', () => {
  function isSuccess(x: MasAxiosResponseType) {
    return x.data.code === 200;
  }

  const showMessageFun = vi.fn();
  const to = new AxiosTo(x => {
    if (isSuccess(x)) {
      return x.data.data;
    }
  }, isSuccess);
  to.showMessage = showMessageFun;

  test('传入处理方法，getInfo可以按处理方法获得正确的返回值', async () => {
    const axiosInstance = axios.create({
      timeout: 1
    });
    //拦截错误，返回测试值
    axiosInstance.interceptors.response.use(undefined, () => {
      return {
        data: {
          code: 200,
          data: '测试成功'
        }
      };
    });
    const info = await to.async(axiosInstance.get<MasResponseType<string>>('http://localhost'));
    type Cases = [
      Expect<Equal<typeof info, ToResult<AxiosResponse<MasResponseType<string>, any>, string>>>,
      Expect<Equal<ReturnType<typeof info.getInfo>, string>>
    ]
    expect(info.getInfo()).toBe('测试成功');
    expect(info.isSuccess).toBe(true);
  });
  test('发生错误时，预期的返回值是undefined，并且显示错误方法根据参数调用', async () => {
    const errorHandler = vi.fn();
    to.addEventListener('error', errorHandler)
    const info = await to.async(Promise.reject('发生错误'), false);
    expect(info.getInfo()).toBe(undefined);
    expect(info.isSuccess).toBe(false);
    expect(showMessageFun).toBeCalledTimes(1);
    expect(info.err).toBe('发生错误');
    expect(errorHandler).toBeCalledWith({
      "error": "发生错误",
      "target": to,
      "type": "error",
    })
    await to.async(Promise.reject('发生错误'), true);
    // 由于使用了silence参数，这里显示错误消息只调用了一次，这次没有调用
    expect(showMessageFun).toBeCalledTimes(1);
    expect(errorHandler).toBeCalledTimes(2)
  });
  test('定义一个其他类型，可以使用To', async () => {
    const showOtherMessageFun = vi.fn();
    function isOtherSuccess(x: OtherAxiosResponse) {
      return x.data.status === 200;
    }

    const axiosInstance = axios.create({
      timeout: 1
    });
    //拦截错误，返回测试值
    axiosInstance.interceptors.response.use(undefined, () => {
      return {
        data: {
          status: 200,
          response: '测试成功'
        }
      };
    });
    const to = new AxiosTo<OtherAxiosResponse>(x => {
      if (isOtherSuccess(x)) {
        return x.data.response
      }
    }, isOtherSuccess) as OtherTo;
    to.showMessage = showOtherMessageFun;
    const info = await to.async(axiosInstance.get<OtherType<string>>('http://localhost'));
    type Cases = [
      Expect<Equal<typeof info, ToResult<AxiosResponse<OtherType<string>, any>, string>>>,
      Expect<Equal<ReturnType<typeof info.getInfo>, string>>
    ]
    expect(info.getInfo()).toBe('测试成功');
    expect(info.isSuccess).toBe(true);
    expect(showOtherMessageFun).not.toBeCalled();
  })
});
