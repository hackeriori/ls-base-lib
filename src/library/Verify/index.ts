import {
  ParameterSimpleType, ParameterVerifyMapType, ParameterCacheType, ParameterVerifyType, VerifyCustomType
} from "./types";
import {getParamName, getTypeName, verifiers} from "./verifiers";

/**
 * TS装饰器类，用于在运行时验证类中定义的方法的参数的合法性，将验证提前到参数的定义，避免在方法的实现中再写验证参数的相关代码。
 * 由于没有使用反射Reflect，所以需要为每个类创建该装饰器的实例，以确保装饰器记录的属性名称不重复。
 * 更多示例可以参考这个{@link https://hackeriori.github.io/ls-base-lib/demo/#/VerifyDemo Verify Demo}
 * @example
 * ```typescript
 * const v = new Verify();
 * class SomeClass {
 *   @v.fun()
 *   someMethod(@v.param('required', 'number') a: number, @v.param('required', 'number') b: number) {
 *     return a + b;
 *   }
 * }
 * // 以下是该装饰器类作用的类的等效代码
 * class someClass {
 *   someMethod(a: number, b: number) {
 *     // 参数a，b未传或不为数字的情况下，直接抛出错误
 *     if (typeof a !== 'number' || typeof b !== 'number') {
 *       throw new Error('a and b must be number');
 *     }
 *     return a + b;
 *   }
 * }
 * ```
 */
export class Verify {
  #funMap = new Map<PropertyKey, ParameterVerifyMapType>();

  /**
   * 标记一个参数需要验证，参数为验证规则，可以传递多个规则，它们将按参数顺序依次进行验证，一旦某个规则不通过则立即抛出错误，后面的验证规则将不参与验证，且函数体不会执行。
   * 与{@link Verify#fun}配合使用，单独使用没有效果
   * @example
   * ```
   * // 参数必须是数字
   * @v.param('number')
   *
   * // 参数必须继承自Error类
   * @v.param(['instanceof', Error])
   *
   * // 参数必须满足是数字，且数字大于0（由于number规则在前，所以执行自定义规则时，value必然为数字，此时就不需要再在自定义规则中去验证value为数字，直接判断value是否大于0就可以了）
   * @v.param(number, ['custom', (value: number) => value > 0])
   *
   * // 如果custom验证传递了第三个参数，则验证不通过时，提示信息将使用该参数
   * @v.param(number, ['custom', (value: number) => value > 0, '必须大于0'])
   * ```
   * @example
   * ```
   * const v = new Verify();
   * class SomeClass {
   *   @v.fun()
   *   someMethod(@v.param('required', 'number') a: number, @v.param('required', 'number') b: number) {
   *     return a + b;
   *   }
   * }
   *
   * const c = new SomeClass;
   * // 方法会报错，根据required规则，参数a和b是必须的，由于按顺序验证a参数时不通过，b参数的验证规则不会执行，同时someMethod方法体 return a + b 也不会执行
   * c.someMethod();
   *
   * // 方法会报错，根据number规则，参数a和b是数字。
   * c.someMethod('1', '2;);
   *
   * // 方法不会报错，所有规则验证通过。
   * c.someMethod(1, 2);
   * ```
   *
   * @param rules 验证规则
   */
  param(...rules: ParameterVerifyType[]) {
    return (target: Object, propertyKey: PropertyKey, parameterIndex: number): void => {
      const paramVerifyMap = this.#funMap.get(propertyKey) || new Map<ParameterSimpleType, ParameterCacheType[]>();
      for (let i = 0; i < rules.length; i++) {
        let typeName = getTypeName(rules[i]);
        const paramIndexList = paramVerifyMap.get(typeName) || [];
        paramIndexList.unshift({
          name: getParamName(target, propertyKey, parameterIndex),
          index: parameterIndex,
          instance: typeName === 'instanceof' ? rules[i][1] as Function : undefined,
          custom: typeName === 'custom' ? rules[i][1] as VerifyCustomType : undefined,
          customText: typeName === 'custom' && rules[i].length > 2 ? rules[i][2] : undefined
        });
        paramVerifyMap.set(typeName, paramIndexList);
      }
      this.#funMap.set(propertyKey, paramVerifyMap);
    }
  }

  /**
   * 标记一个方法为需要验证的方法，可作用于类的实例方法和静态方法，但不适用于构造函数。
   * 与{@link Verify#param}配合使用，单独使用没有效果
   * @example
   * ```
   * @v.fun()
   * someMethod(@v.param('number') a: number) {
   *    ...
   * }
   * ```
   */
  fun() {
    // 这里返回一个箭头函数以绑定this
    return (target: Object, propertyKey: PropertyKey, descriptor: PropertyDescriptor) => {
      // 原方法备份
      const method = descriptor.value;
      // 先缓存规则，由于param验证先执行，这里必定能拿到定义的规则。
      const paramVerifyMap = this.#funMap.get(propertyKey);
      // 修改方法，如果该方法存在验证参数，则先验证参数是否符合规则。
      descriptor.value = function () {
        if (paramVerifyMap) {
          for (const [paramVerifyType, paramIndexList] of paramVerifyMap) {
            verifiers.get(paramVerifyType)!(paramIndexList, target, propertyKey, arguments);
          }
        }
        return method.apply(this, arguments);
      }
    }
  }
}
