/**
 * 简单参数验证类型<br/>
 * required 参数是必选的<br/>
 * number 参数必须是数字<br/>
 * string 参数必须是字符串<br/>
 * boolean 参数必须是布尔值<br/>
 * function 参数必须是函数<br/>
 * array 参数必须是数组<br/>
 * date 参数必须是日期（js的原生日期类型Date）<br/>
 * dom 参数必须是HTMLElement<br/>
 * map 参数必须是Map类型（WeakMap也不行）<br/>
 * regExp 参数必须是正则表达式<br/>
 * symbol 参数必须是Symbol<br/>
 * asyncFunction 参数必须是异步函数
 * */
export type ParameterSimpleType = 'required' | 'number' | 'string' | 'boolean' | 'function' | 'array' | 'date' | 'dom'
  | 'map' | 'regExp' | 'symbol' | 'asyncFunction';

/** 自定义验证方法 */
export type VerifyCustomType = (value: any) => boolean;

/**
 * 参数验证类型<br/>
 * ParameterSimpleType 简单参数验证类型<br/>
 * ['instanceof', Function] instanceof验证，验证参数继承自某个类<br/>
 * ['custom', VerifyCustomType] 自定义验证，传入自定义验证方法<br/>
 * ['custom', VerifyCustomType, string] 自定义验证，传入自定义验证方法和自定义错误信息
 */
export type ParameterVerifyType =
  ParameterSimpleType
  | ['instanceof', Function]
  | ['custom', VerifyCustomType]
  | ['custom', VerifyCustomType, string];

/** 验证工厂的返回函数类型 */
export type VerifyFunType = (paramIndexList: ParameterCacheType[], target: Object, propertyKey: PropertyKey, argumentList: IArguments) => void

/** 验证工厂验证参数方法类型 */
export type VerifyFactorType = (value: any, paramIndex: ParameterCacheType) => boolean;

/** 参数缓存名称类型 */
export type VerifyNameType = ParameterSimpleType | 'instanceof' | 'custom';

/** 参数缓存值类型 */
export interface ParameterCacheType {
  /** 参数名称 */
  name: string,
  /** 参数序号 */
  index: number,
  /** 对象 */
  instance?: Function,
  /** 自定义验证方法 */
  custom?: VerifyCustomType,
  /** 自定义校验方法失败提示 */
  customText?: string
}

/** 参数缓存类型 */
export type ParameterVerifyMapType = Map<VerifyNameType, ParameterCacheType[]>;
