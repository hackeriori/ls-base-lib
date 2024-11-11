// 断言T类型为真
export type Expect<T extends true> = T
// 判断输入的两种类型是否相等
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false
// 调试一种类型，通常用于将某种推断类型具体化
export type Debug<T> = {[K in keyof T]: T[K]}

/*
参考https://www.npmjs.com/package/@type-challenges/utils这个库
一些工具类型
例如：
interface Person {
  name: string,
  age: number
}

type Case = [
  Expect<Equal<keyof Person, 'name' | 'age'>>,
  ...更多的类型断言
]

当断言为真时，编辑器不会提示错误，否则会有红色下划线提示类型错误。
*/