/**
 * 在原字符串的指定位置处插入目标字符（该方法不会改变原字符串）
 * @param source 原字符串
 * @param position 插入位置，最前方为0，第一个字符后为1，以此类推
 * @param target 目标字符串
 */
export function strInsertAt(source: string, position: number, target: string) {
  return source.slice(0, position) + target + source.slice(position);
}

/**
 * 获取字符串的后缀名
 * @param targetString 字符串
 * @param symbol 分割符号，默认为点符号
 */
export function strGetStringExtension(targetString: string, symbol = '.') {
  const index = targetString.lastIndexOf(symbol) + 1;
  return index && targetString.substring(index) || undefined;
}

/**
 * 获取URL参数，如果是路由的参数使用vueGetParamFromQuery
 * @param name 参数名
 * @param url
 */
export function strGetUrlParam(name: string, url?: string) {
  const _url = url || location.search;
  return new URLSearchParams(_url).get(name);
}

/**
 * 替换url中的域名部分
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

//常用日期格式
export const StrDateTime = 'YYYY-MM-DD HH:mm:ss';
export const StrTime = 'HH:mm:ss';
export const StrDate = 'YYYY-MM-DD';
