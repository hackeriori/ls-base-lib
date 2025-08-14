/**
 * 在原字符串的指定位置处插入目标字符（该方法不会改变原字符串）
 *
 * @param source 原字符串（原字符串不会改变）
 * @param position 插入位置，最前方为0，第一个字符后为1，以此类推（可以使用负数序号，例如-1表示最后一个字符的前面）
 * @param target 目标字符串
 *
 * @example
 * // returns '123abc456'
 * strInsertAt('123456', 3, 'abc')
 * @example
 * // returns '12abc3'
 * strInsertAt('123', -1, 'abc')
 */
export function strInsertAt(source: string, position: number, target: string) {
  return source.slice(0, position) + target + source.slice(position);
}

/**
 * 获取字符串的后缀名（获取最右边的后缀名）
 *
 * @param targetString 字符串
 * @param symbol 分割符号，默认为点符号
 *
 * @example
 * // returns 'txt'
 * strGetStringExtension('123.txt')
 * @example
 * // returns 'abc'
 * strGetStringExtension('123|abc', '|')
 */
export function strGetStringExtension(targetString: string, symbol = '.') {
  const index = targetString.lastIndexOf(symbol) + 1;
  return index && targetString.substring(index) || undefined;
}

/**
 * 获取URL参数，如果是路由的参数（哈希上的参数）使用`vueGetParamFromQuery`
 *
 * @param name 参数名
 * @param url 可选参数，如果该参数缺失，则默认查询location.search
 *
 * @example
 * // returns 'abc'
 * strGetUrlParam('name', '?name=abc')
 */
export function strGetUrlParam(name: string, url?: string) {
  const _url = url || location.search;
  return new URLSearchParams(_url).get(name);
}

/**
 * 替换url中的域名部分
 *
 * @param url 原网址
 * @param replaceString 替换域名
 *
 * @example
 * // returns 'http://b.com:8080/pages/1.html'
 * strReplaceHost('https://a.com/pages/1.html', 'http://b.com:8080/')
 * @example
 * // returns 'https://a.com/pages/1.html'
 * strReplaceHost('pages/1.html', 'https://a.com/')
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

/**
 * 生成一个全局唯一标识符（GUID）
 *
 * @example
 * // returns 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
 * strGenerateGuid()
 */
export function strGenerateGuid() {
  // 1) 优先使用原生 randomUUID (Node 19+/浏览器)
  const globalAny: any = globalThis as any;
  if (typeof globalAny?.crypto?.randomUUID === 'function') {
    return globalAny.crypto.randomUUID();
  }

  // 2) 使用 crypto.getRandomValues 生成随机字节（浏览器/Node）
  const cryptoObj: any = globalAny?.crypto;
  if (cryptoObj && typeof cryptoObj.getRandomValues === 'function') {
    const randoms = new Uint8Array(16);
    cryptoObj.getRandomValues(randoms);

    // 设置版本号为 4 -> xxxx-4xxx-...
    randoms[6] = (randoms[6] & 0x0f) | 0x40;
    // 设置变体为 10xxxxxx
    randoms[8] = (randoms[8] & 0x3f) | 0x80;

    const hex = Array.from(randoms, (b) => b.toString(16).padStart(2, '0')).join('');
    return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20)}`;
  }

  // 3) 回退到伪随机（非加密强度，请谨慎使用）
  const randomsFallback: number[] = [];
  for (let i = 0; i < 16; i++) {
    randomsFallback[i] = Math.floor(Math.random() * 256);
  }
  // 设置版本号和变体
  randomsFallback[6] = (randomsFallback[6] & 0x0f) | 0x40;
  randomsFallback[8] = (randomsFallback[8] & 0x3f) | 0x80;

  const hexFallback = randomsFallback.map((n) => n.toString(16).padStart(2, '0')).join('');
  return `${hexFallback.substring(0, 8)}-${hexFallback.substring(8, 12)}-${hexFallback.substring(12, 16)}-${hexFallback.substring(16, 20)}-${hexFallback.substring(20)}`;
}

/** 日期时间格式，用于`dayjs().format` */
export const StrDateTime = 'YYYY-MM-DD HH:mm:ss';
/** 时间格式，用于`dayjs().format` */
export const StrTime = 'HH:mm:ss';
/** 日期格式，用于`dayjs().format` */
export const StrDate = 'YYYY-MM-DD';
