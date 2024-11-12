export type ParameterSimpleType =
  'required'
  | 'number'
  | 'string'
  | 'boolean'
  | 'function'
  | 'array'
  | 'date'
  | 'dom'
  | 'map'
  | 'regExp'
  | 'symbol'
  | 'asyncFunction';

export type VerifyNameType = ParameterSimpleType | 'instanceof' | 'custom';

export type ParameterVerifyType =
  ParameterSimpleType
  | ['instanceof', Function]
  | ['custom', VerifyCustomType]
  | ['custom', VerifyCustomType, string];

export type VerifyFunType = (paramIndexList: ParameterCacheType[], target: Object, propertyKey: MethodKeyType, argumentList: IArguments) => void

export type ParameterVerifyMapType = Map<VerifyNameType, ParameterCacheType[]>;

export type MethodKeyType = string | symbol;

export type VerifyCustomType = (value: any) => boolean;

export type VerifyFactorType = (value: any, paramIndex: ParameterCacheType) => boolean;

export interface ParameterCacheType {
  //参数名称
  name: string;
  //参数序号
  index: number;
  //对象
  instance?: Function;
  //自定义验证方法
  custom?: VerifyCustomType;
  //自定义校验方法失败提示
  customText?: string;
}
