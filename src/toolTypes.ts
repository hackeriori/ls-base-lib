/**
 * 断言类型T为真。当断言为真时，编辑器不会提示错误，否则会有红色下划线提示类型错误。
 *
 * @template T - 需要断言为真的类型。
 *
 * @example
 * ```
 * interface Person {
 *   name: string,
 *   age: number
 * }
 *
 * type Case = [
 *   Expect<Equal<keyof Person, 'name' | 'age'>>,
 *   ...更多的类型断言
 * ]
 * ```
 */
export type Expect<T extends true> = T
/**
 * 判断两种类型是否相等。
 *
 * @template X - 第一种类型。
 * @template Y - 第二种类型。
 *
 * @example
 * ```
 * interface Person {
 *   name: string,
 *   age: number
 * }
 *
 * type Case = [
 *   Expect<Equal<keyof Person, 'name' | 'age'>>,
 *   ...更多的类型断言
 * ]
 * ```
 */
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false
/**
 * 调试一种类型，通常用于将某种推断类型具体化。
 *
 * @template T - 需要调试的类型。
 */
export type Debug<T> = {[K in keyof T]: T[K]}

/*
参考https://www.npmjs.com/package/@type-challenges/utils这个库
*/