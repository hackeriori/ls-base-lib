import {
  MethodKeyType,
  ParameterCacheType,
  ParameterVerifyType,
  VerifyFactorType,
  VerifyFunType,
  VerifyNameType
} from "./types";

function getMethodName(target: any, propertyKey: MethodKeyType) {
  //当直接使用类本身时，类本身是Function
  const className = typeof target === 'object' ? target.constructor.name : target.name;
  return `${className}类中的${propertyKey.toString()}方法中：`;
}

export function getParamName(target: any, propertyKey: MethodKeyType, paramIndex: number) {
  return (target[propertyKey].toString() as string).match(/\(.*\)/)![0].slice(1, -1).replace(/\/\*.*\*\//, "").split(',')[paramIndex].trim();
}

export function getTypeName(type: ParameterVerifyType): VerifyNameType {
  return Array.isArray(type) ? type[0] : type;
}

function verifyParamFactory(testFun: VerifyFactorType, verifyText: string | ((i: ParameterCacheType) => string) = '校验失败！', isRequired = false): VerifyFunType {
  return function (paramIndexList, target, propertyKey, argumentList) {
    let isVerified = true;
    let errorList: string[] = [];
    for (let i = 0; i < paramIndexList.length; i++) {
      const paramIndex = paramIndexList[i];
      if (paramIndex.index < argumentList.length || isRequired)
        if (!testFun(paramIndex.index < argumentList.length ? argumentList[paramIndex.index] : undefined, paramIndex)) {
          isVerified = false;
          errorList.push(`第${paramIndex.index + 1}个参数${paramIndex.name}，${typeof verifyText === 'string' ? verifyText : verifyText(paramIndex)}`)
        }
    }
    if (!isVerified)
      throw `${getMethodName(target, propertyKey)}${errorList.join('；')}！`
  }
}

export const verifiers = new Map<VerifyNameType, VerifyFunType>();

//必要性验证
verifiers.set('required', verifyParamFactory(x => x !== undefined, '是必须的', true))

//数字类型验证
verifiers.set('number', verifyParamFactory(x => Number.isFinite(x), '必须是数字'));

//字符串验证
verifiers.set('string', verifyParamFactory(x => typeof x === 'string', '必须是字符串'));

//布尔类型验证
verifiers.set('boolean', verifyParamFactory(x => x === true || x === false, '必须是布尔值'));

//函数验证
verifiers.set('function', verifyParamFactory(x => typeof x === 'function', '必须是函数'));

//数组验证
verifiers.set('array', verifyParamFactory(x => Array.isArray(x), '必须是数组'));

//日期验证
verifiers.set('date', verifyParamFactory(x => x instanceof Date && !isNaN(x.valueOf()), '必须是日期'));

//dom验证
verifiers.set('dom', verifyParamFactory(x => x instanceof HTMLElement, '必须是HTMLElement'));

//map验证
verifiers.set('map', verifyParamFactory(x => x instanceof Map, '必须是Map类型'));

//正则表达式验证
verifiers.set('regExp', verifyParamFactory(x => x instanceof RegExp, '必须是正则表达式'));

//symbol验证
verifiers.set('symbol', verifyParamFactory(x => typeof x === 'symbol', '必须是Symbol'));

//异步函数验证
verifiers.set('asyncFunction', verifyParamFactory(x => typeof x === 'function' && x.constructor.name === 'AsyncFunction', '必须是异步函数'));

//instanceof验证
verifiers.set('instanceof', verifyParamFactory((x, i) => x instanceof i.instance!, i => `必须是[${i.instance!.name}]的实例类型`));

//custom验证
verifiers.set('custom', verifyParamFactory((x, i) => i.custom!(x), i => i.customText || '自定义校验失败'));
