import {describe, expect, test} from 'vitest';
import {strGenerateGuid, strGetStringExtension, strGetUrlParam, strInsertAt, strReplaceHost} from "./stringUtil";

describe("测试字符串插入方法", () => {
  const testString = 'abcdef';
  test('在最前方插入', () => {
    expect(strInsertAt(testString, 0, 'g')).toBe('gabcdef');
  });
  //在最后方插入实际是没有意义的，可以直接用 testString + 'g'
  test('在最后方插入', () => {
    expect(strInsertAt(testString, testString.length, 'g')).toBe('abcdefg');
  });
  test('在最后一个字符前插入', () => {
    expect(strInsertAt(testString, -1, 'g')).toBe('abcdegf');
  });
  test('在第一个字符后插入', () => {
    expect(strInsertAt(testString, 1, 'g')).toBe('agbcdef');
  });
  test('原字符串不会改变', () => {
    expect(testString).toBe('abcdef');
  });
});

describe("测试获取文件名后缀", () => {
  test('获取标准文件后缀', () => {
    expect(strGetStringExtension("c:\\test\\mm.png")).toBe('png');
  });
  test('获取无后缀字符串', () => {
    expect(strGetStringExtension("example")).toBe(undefined);
  });
  const testString = "c:\\test\\mm.big.png";
  test('获取包含多个点的文件后缀', () => {
    expect(strGetStringExtension(testString)).toBe('png');
  });
  test('原字符串不会改变', () => {
    expect(testString).toBe('c:\\test\\mm.big.png');
  });
  test('自定义分割字符串', () => {
    expect(strGetStringExtension('123|321', '|')).toBe('321');
  });
});

describe('测试获取url参数', () => {
  test('获取标准url参数', () => {
    const url = '?a=11&b=22';
    expect(strGetUrlParam('a', url)).toBe("11");
    expect(strGetUrlParam('b', url)).toBe("22");
    expect(strGetUrlParam('c', url)).toBeNull();
  });
  test('获取不带?url参数', () => {
    const url = 'a=11&b=22';
    expect(strGetUrlParam('a', url)).toBe("11");
  });
})

describe('替换url中的域名部分', () => {
  const url1 = 'https://a.com/';
  const url2 = 'http://b.com:8080/';
  const url3 = 'pages/1.html';
  test('完整域名，不会被替换', () => {
    expect(new URL(url1, url2).toString()).toBe(url1);
  });
  test('完整域名，手动替换', () => {
    expect((() => {
      const urlObj1 = new URL(url1 + url3, url2);
      const urlObj2 = new URL(url2);
      urlObj1.host = urlObj2.host;
      urlObj1.protocol = urlObj2.protocol;
      return urlObj1.toString();
    })()).toBe(url2 + url3);
  });
  test('缺失域名，可以被补全', () => {
    expect(new URL(url3, url2).toString()).toBe(url2 + url3);
  });
  test('缺失域名，new会报错', () => {
    expect(() => new URL(url3)).toThrowError();
    // @ts-ignore
    expect(() => new URL(undefined)).toThrowError();
  });
  test('域名替换方法，完整URL', () => {
    expect(strReplaceHost(url1 + url3, url2)).toBe(url2 + url3);
  });
  test('域名替换方法，非完整URL', () => {
    expect(strReplaceHost(url3, url2)).toBe(url2 + url3);
  });
  test('域名替换方法，替换域名错误', () => {
    expect(strReplaceHost(url3, 'aaa')).toBe(url3);
  });
})

describe('测试生成GUID方法', () => {
  test('生成的GUID格式正确', () => {
    const guid = strGenerateGuid();
    expect(guid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  test('生成的GUID不重复', () => {
    const guid1 = strGenerateGuid();
    const guid2 = strGenerateGuid();
    expect(guid1).not.toBe(guid2);
  });
});
