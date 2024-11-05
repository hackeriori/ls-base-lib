/**
 * 在原字符串的指定位置处插入目标字符（该方法不会改变原字符串）
 * @example
 * // returns '123abc456'
 * strInsertAt('123456', 3, 'abc')
 * @example
 * // returns '12abc3'
 * strInsertAt('123', -1, 'abc')
 * @param source 原字符串（原字符串不会改变）
 * @param position 插入位置，最前方为0，第一个字符后为1，以此类推（可以使用负数序号，例如-1表示最后一个字符的前面）
 * @param target 目标字符串
 */
export function strInsertAt(source: string, position: number, target: string) {
  return source.slice(0, position) + target + source.slice(position);
}

/**
 * 获取字符串的后缀名（获取最右边的后缀名）
 * @example
 * // returns 'txt'
 * strGetStringExtension('123.txt')
 * @example
 * // returns 'abc'
 * strGetStringExtension('123|abc', '|')
 * @param targetString 字符串
 * @param symbol 分割符号，默认为点符号
 */
export function strGetStringExtension(targetString: string, symbol = '.') {
  const index = targetString.lastIndexOf(symbol) + 1;
  return index && targetString.substring(index) || undefined;
}

/**
 * 获取URL参数，如果是路由的参数（哈希上的参数）使用vueGetParamFromQuery
 * @example
 * // returns 'abc'
 * strGetUrlParam('name', '?name=abc')
 * @param name 参数名
 * @param url 可选参数，如果该参数缺失，则默认查询location.search
 */
export function strGetUrlParam(name: string, url?: string) {
  const _url = url || location.search;
  return new URLSearchParams(_url).get(name);
}

/**
 * 替换url中的域名部分
 * @example
 * // returns 'http://b.com:8080/pages/1.html'
 * strReplaceHost('https://a.com/pages/1.html', 'http://b.com:8080/')
 * @example
 * // returns 'https://a.com/pages/1.html'
 * strReplaceHost('pages/1.html', 'https://a.com/')
 * @param url 原网址
 * @param replaceString 替换域名
 */
export function strReplaceHost(url: string, replaceString: string) {
  let urlReplace: URL;
  try {
    urlReplace = new URL(replaceString);
  } catch {
    console.warn(`被替换的域名是错误的：${replaceString}`);
    return url;
  }
  let urlObj = new URL(url, replaceString);
  urlObj.host = urlReplace.host;
  urlObj.protocol = urlReplace.protocol;
  return urlObj.toString();
}

// 日期时间格式
export const StrDateTime = 'YYYY-MM-DD HH:mm:ss';
// 时间格式
export const StrTime = 'HH:mm:ss';
// 日期格式
export const StrDate = 'YYYY-MM-DD';
