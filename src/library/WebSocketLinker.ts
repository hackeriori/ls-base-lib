import type {MessageEventExt, WSMessageType, WSMessageTypeExt} from './types';

/**
 * WebSocket链接器类，提供WebSocket连接和消息处理功能。
 *
 * @template T - 解析后数据的类型。
 * @template U - 是否需要解析数据的标志。
 */
export class WebSocketLinker<T, U extends boolean> {
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

  /**
   * 构造函数，初始化WebSocket连接器。
   *
   * @param url - WebSocket链接地址。
   * @param parseData - 是否需要解析数据的标志。
   * @param messageHandler - 消息处理函数。
   * @param parseFun - 可选的消息体处理函数，用于预处理原始消息。
   */
  constructor(url: string, parseData: U, messageHandler: U extends true ? WSMessageTypeExt<string, T> : WSMessageType<string>, parseFun?: (ev: MessageEvent<string>) => string) {
    this.#url = url;
    this.#messageHandler = messageHandler;
    this.#parseData = parseData ?? false;
    this.#parseFun = parseFun;
  }

  /**
   * 处理WebSocket关闭事件，设置重连句柄。
   */
  #closeEvent = () => {
    this.cancelReConnect();
    this.#reConnect = setInterval(() => {
      this.connect()
    }, 10000) as any as number;
  }

  /**
   * 连接WebSocket并添加事件监听器。
   */
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

  /**
   * 取消重连句柄。
   */
  cancelReConnect() {
    if (this.#reConnect) {
      clearInterval(this.#reConnect);
      this.#reConnect = null;
    }
  }

  /**
   * 关闭WebSocket连接并移除事件监听器。
   */
  close() {
    this.#ws?.removeEventListener('close', this.#closeEvent);
    this.#ws?.close();
    this.#ws = null;
  }
}
