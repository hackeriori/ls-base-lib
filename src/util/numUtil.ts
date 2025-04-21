/**
 * 对数字进行四舍五入，保留指定的小数位数，并处理浮点数精度问题。
 * 
 * @param num - 需要处理的数字。
 * @param decimal - 保留的小数位数，默认为2。
 * @returns 四舍五入后的数字。
 * 
 * @example
 * // 示例1：保留两位小数
 * numFixed(3.14159); // 返回 3.14
 * 
 * // 示例2：保留三位小数
 * numFixed(3.14159, 3); // 返回 3.142
 */
export function numFixed(num: number, decimal: number = 2): number {
  const factor = Math.pow(10, decimal);
  // 根据小数位数动态调整 EPSILON 的倍数
  const epsilon = Number.EPSILON * (num >= 0 ? 1 : -1);
  return Math.round((num + epsilon) * factor) / factor;
}