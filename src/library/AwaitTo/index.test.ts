import {describe, expect, test} from 'vitest';
import AwaitTo from './index'
import type {Equal, Expect} from "../../toolTypes";
import {APIResponse, DefaultGetInfoType, MasApiType, PassToResultType} from "./ToResult/types";
import axios, {type AxiosResponse} from "axios";

type cases<T> = [
  //默认类型
  Expect<Equal<PassToResultType<0, T>, DefaultGetInfoType<T>>>,
  //梅安森接口类型
  Expect<Equal<PassToResultType<1, AxiosResponse<APIResponse<T>>>, MasApiType<AxiosResponse<APIResponse<T>>>>>,
  //返回值类型
  Expect<Equal<ReturnType<MasApiType<AxiosResponse<APIResponse<T>>>>, T | undefined>>,
]

describe('测试AwaitTo', () => {
  test('不传参数，可以返回Promise内未处理的内容', async () => {
    const waiter = new AwaitTo();
    const info = await waiter.async(Promise.resolve(3));
    expect(info.getInfo()).toBe(3);
  });
  test('发生错误时，预期的返回值是undefined', async () => {
    const waiter = new AwaitTo();
    const info = await waiter.async(Promise.reject('测试错误发生'), true);
    expect(info.getInfo()).toBe(undefined);
  });
  test('传入处理方法，可以返回Promise内处理过的内容', async () => {
    //此时waiter期待的返回值是unknown
    const waiter = new AwaitTo<MasApiType, 1>(x => {
      if (x.data.code === 200)
        return x.data.data;
      else
        waiter.showMessage(x.data.info);
    });
    const axiosInstance = axios.create({
      timeout: 1
    });
    //拦截错误，返回测试值
    axiosInstance.interceptors.response.use(undefined, () => {
      return {
        data: {
          code: 200,
          data: '333'
        }
      };
    });
    //调用async方法后，根据参数推断出info的期待返回值是string
    const info = await waiter.async(axiosInstance.get<APIResponse<string>>('http://localhost'));
    expect(info.getInfo()).toBe('333');
  })
});
