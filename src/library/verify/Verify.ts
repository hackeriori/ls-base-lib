import {
  ParameterSimpleType,
  ParameterVerifyMapType,
  MethodKeyType,
  ParameterCacheType,
  ParameterVerifyType,
  VerifyCustomType
} from "./types";
import {getParamName, getTypeName, verifiers} from "./verifiers";

//注意由于没有使用反射Reflect，所以一个类需要new一个Verify以确保名称不重复。
export class Verify {
  #funMap = new Map<MethodKeyType, ParameterVerifyMapType>();

  //参数验证
  param(...types: ParameterVerifyType[]) {
    return (target: Object, propertyKey: MethodKeyType, parameterIndex: number): void => {
      const paramVerifyMap = this.#funMap.get(propertyKey) || new Map<ParameterSimpleType, ParameterCacheType[]>();
      for (let i = 0; i < types.length; i++) {
        let typeName = getTypeName(types[i]);
        const paramIndexList = paramVerifyMap.get(typeName) || [];
        paramIndexList.unshift({
          name: getParamName(target, propertyKey, parameterIndex),
          index: parameterIndex,
          instance: typeName === 'instanceof' ? types[i][1] as Function : undefined,
          custom: typeName === 'custom' ? types[i][1] as VerifyCustomType : undefined,
          customText: typeName === 'custom' && types[i].length > 2 ? types[i][2] : undefined,
        });
        paramVerifyMap.set(typeName, paramIndexList);
      }
      this.#funMap.set(propertyKey, paramVerifyMap);
    }
  }

  //配合前面的参数验证来验证方法，可作用于普通方法和静态方法，不适用于构造方法。
  fun() {
    return (target: Object, propertyKey: MethodKeyType, descriptor: PropertyDescriptor) => {
      const method = descriptor.value;
      const paramVerifyMap = this.#funMap.get(propertyKey);
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
