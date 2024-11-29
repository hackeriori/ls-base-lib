/**
 * 从route.query中获取指定名称的参数信息，
 *
 * @param query vue路由，route.query
 * @param param 参数名
 *
 * @example
 * const query = useRoute().query;
 * const modelName = vueGetParamFromQuery(query, 'model');
 * if (modelName) {
 *   // do something
 * }
 */
export function vueGetParamFromQuery(query: Record<string, (string | null) | (string | null)[]>, param: string) {
  let modelName = query[param];
  if (modelName) {
    if (Array.isArray(modelName)) {
      modelName = modelName.filter(x => x);
      if (modelName.length === 0)
        return null
    }
    return Array.isArray(modelName) ? modelName[0] : modelName;
  }
  return null
}


/* region 废弃代码，用于vue2
export class VueInjectHelper<Provide, Tuple extends any[] = []> {
  injects: string[] = [];

  push<T extends keyof Provide>(injectName: T): VueInjectHelper<Provide, [...Tuple, T]> {
    this.injects.push(injectName as string);
    return this as any;
  }

  getArray(): Tuple {
    return this.injects as any;
  }
}


export type VueMixinMethods<Provide, InjectHelper extends readonly any[]> = Partial<Pick<Provide, InjectHelper[number]>>
*/