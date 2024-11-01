import ToResult from "./ToResult";
import {DefaultGetInfoType, GetInfoType, PassToResultType, ShowMessageType} from "./ToResult/types";

//获取等待后返回值的方法
export default class To<T extends GetInfoType = DefaultGetInfoType, P extends number = 0> {
  //消息展示方法
  readonly showMessage: ShowMessageType;
  //解析返回值方法
  readonly #getInfoFun: T;

  constructor(getInfoFun?: T, showMessageFun?: ShowMessageType) {
    this.#getInfoFun = getInfoFun || ((data) => data) as T;
    if (showMessageFun)
      this.showMessage = showMessageFun;
    else {
      if ((window as any).ElementPlus) {
        this.showMessage = (window as any).ElementPlus.ElMessage.error;
      } else if ((window as any).ELEMENT) {
        this.showMessage = (window as any).ELEMENT.Message.error;
      } else
        this.showMessage = console.error;
    }
  }

  async<R extends Parameters<T>[0]>(promise: Promise<R>, silence = false) {
    return promise.then(data => new ToResult<PassToResultType<P, R>>(data, undefined, this.#getInfoFun))
      .catch(e => {
        if (!silence) {
          const messageError = '网络错误';
          const messageForbidden = "无权访问";
          let message: string;
          if (e.message === 'Network Error')
            message = messageError;
          else if (e.message === 'Request failed with status code 404')
            message = messageError;
          else if (e.message === 'Request failed with status code 401')
            message = messageForbidden;
          else if (e.message === 'Request failed with status code 403')
            message = messageForbidden;
          else if (e.message === 'canceled')
            message = '';
          else if (typeof e === 'string')
            message = e;
          else if (e.message && typeof e.message === 'string')
            message = e.message;
          else
            message = '未知错误';
          message && this.showMessage(message);
        }
        return new ToResult<PassToResultType<P, R>>(undefined, e, this.#getInfoFun);
      });
  }
}