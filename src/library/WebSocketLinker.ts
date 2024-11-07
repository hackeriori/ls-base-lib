export interface MessageEventExt<T, U> extends MessageEvent<T> {
  parseData: U
}

export type WSMessageTypeExt<T, U> = (ev: MessageEventExt<T, U>) => void;
export type WSMessageType<T> = (ev: MessageEvent<T>) => void;

export default class WebSocketLinker<T, U extends boolean> {
  //WebSocket连接实例
  #ws: WebSocket | null = null;
  //链接地址
  readonly #url: string;
  //重连句柄
  #reConnect: number | null = null;
  //消息处理函数
  readonly #messageHandler: WSMessageType<string> | WSMessageTypeExt<string, T>;
  //是否解析数据
  readonly #parseData: boolean;
  //消息体处理函数，处理原始消息（在messageHandler之前）
  readonly #parseFun?: (ev: MessageEvent<string>) => string

  constructor(url: string, parseData: U, messageHandler: U extends true ? WSMessageTypeExt<string, T> : WSMessageType<string>, parseFun?: (ev: MessageEvent<string>) => string) {
    this.#url = url;
    this.#messageHandler = messageHandler;
    this.#parseData = parseData ?? false;
    this.#parseFun = parseFun;
  }

  #closeEvent = () => {
    this.cancelReConnect();
    this.#reConnect = setInterval(() => {
      this.connect()
    }, 10000) as any as number;
  }

  //连接
  connect() {
    if (!this.#ws) {
      this.#ws = new WebSocket(this.#url);
      this.#ws.addEventListener('open', () => {
        this.cancelReConnect();
      });
      this.#ws.addEventListener('close', this.#closeEvent);
      if (this.#parseData)
        this.#ws.addEventListener('message', ev => {
          let result: string = '';
          if (this.#parseFun) {
            result = this.#parseFun(ev);
            //如果是返回了空字符串，那么放弃这条数据
            if (!result) return;
          }
          let parseData: T
          try {
            parseData = JSON.parse(result || ev.data);
          } catch {
            console.log('数据parse失败');
            return
          }
          const evt = ev as MessageEventExt<string, T>
          evt.parseData = parseData;
          this.#messageHandler(evt);
        })
      else
        this.#ws.addEventListener('message', this.#messageHandler as WSMessageType<string>);
    }
  }

  //取消重连
  cancelReConnect() {
    if (this.#reConnect) {
      clearInterval(this.#reConnect);
      this.#reConnect = null;
    }
  }

  //关闭连接
  close() {
    this.#ws?.removeEventListener('close', this.#closeEvent);
    this.#ws?.close();
    this.#ws = null;
  }
}
