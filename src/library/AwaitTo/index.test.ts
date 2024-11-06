import {describe, expect, test, vi} from 'vitest';
import To from './index'
import type {Equal, Expect} from "../../toolTypes";
import {MasResponseType, MasApiType, PassToResultType, MasAxiosResponseType} from "./ToResult/types";
import axios from "axios";

type Cases<T> = [
  // 默认梅安森接口类型
  Expect<Equal<PassToResultType<0, MasAxiosResponseType<T>>, MasApiType<MasAxiosResponseType<T>>>>,
  // 返回值类型
  Expect<Equal<ReturnType<MasApiType<MasAxiosResponseType<T>>>, T | undefined>>,
]

describe('测试To', () => {
  const axiosInstance = axios.create({
    timeout: 1
  });
  const showMessageFun = vi.fn();
  const to = new To(x => {
    if (x.data.code === 200) {
      return x.data.data;
    }
  }, showMessageFun);
  test('传入处理方法，getInfo可以按处理方法获得正确的返回值', async () => {
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
    expect(info.getInfo()).toBe('测试成功');
  });
  test('发生错误时，预期的返回值是undefined，并且显示错误方法根据参数调用', async () => {
    const info = await to.async(Promise.reject('发生错误'), false);
    expect(info.getInfo()).toBe(undefined);
    expect(showMessageFun).toBeCalledTimes(1);
    expect(info.err).toBe('发生错误');
    await to.async(Promise.reject('发生错误'), true);
    // 由于使用了silence参数，这里显示错误消息只调用了一次，这次没有调用
    expect(showMessageFun).toBeCalledTimes(1);
  });
});
