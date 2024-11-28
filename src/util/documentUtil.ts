import type {AxiosResponse} from "axios";

/**
 * 异步加载JavaScript脚本。
 *
 * @param src - 要加载的JavaScript脚本的URL。
 * @param doc - 可选参数，指定要在其中加载脚本的文档对象。默认为当前文档。
 * @returns 返回一个Promise对象，解析为脚本是否成功加载。
 *
 * @example
 * // 示例：加载一个外部脚本并处理加载结果
 * const result = await docLoadScript('https://example.com/script.js')
 * if (result) {
 *   // do something
 * }
 */
export async function docLoadScript(src: string, doc?: Document): Promise<boolean> {
  return new Promise<boolean>(resolve => {
    if (!doc)
      doc = document
    const scriptElement = doc.createElement('script');
    scriptElement.src = src;
    scriptElement.addEventListener('load', () => resolve(true));
    scriptElement.addEventListener('error', () => resolve(false));
    doc.body.append(scriptElement);
  });
}

/**
 * 异步加载css样式。
 *
 * @param src - 要加载的css样式的URL。
 * @param doc - 可选参数，指定要在其中加载样式的文档对象。默认为当前文档。
 * @returns 返回一个Promise对象，解析为样式是否成功加载。
 *
 * @example
 * // 示例：加载一个外部样式
 * await docLoadCss('https://example.com/remote.css')
 */
export async function docLoadCss(src: string, doc?: Document): Promise<boolean> {
  return new Promise<boolean>(resolve => {
    if (!doc)
      doc = document
    const linkElement = doc.createElement("link");
    linkElement.rel = 'stylesheet';
    linkElement.href = src;
    linkElement.addEventListener('load', () => resolve(true));
    linkElement.addEventListener('error', () => resolve(false));
    doc.head.append(linkElement);
  });
}

/**
 * 复制文本到剪贴板，支持多行文本。
 *
 * @param text - 需要复制的文本内容。
 * @returns 复制操作是否成功。
 *
 * @example
 * // 调用示例
 * const result = docCopyText('Hello, World!');
 * if (result) {
 *   console.log('文本已成功复制到剪贴板');
 * } else {
 *   console.log('复制失败');
 * }
 */
export function docCopyText(text: string): boolean {
  let success = false;
  const input = document.createElement('textarea');
  input.style.position = 'absolute'
  document.body.appendChild(input);
  input.value = text;
  input.select();
  // 此方法虽然已废弃，但是不需要https，不需要用户授权
  if (document.execCommand)
    success = document.execCommand('copy');
  document.body.removeChild(input);
  return success;
}

/**
 * 下载文件。
 *
 * @param url - 文件的URL地址。
 * @param [name] - 下载后的文件名，如果不指定则使用URL中的文件名。
 * @returns 无返回值。
 *
 * @example
 * docDownloadFile('https://example.com/file.pdf', 'file.pdf');
 */
export function docDownloadFile(url: string, name?: string): void {
  let link = document.createElement("a");
  link.style.display = "none";
  link.href = url;
  link.setAttribute("download", name || '');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 下载从服务器返回的流数据。<br/>
 * 主要用于解决下载后端给出的流数据时，无法获取文件名的问题。
 *
 * @param data - Axios响应对象，包含文件内容和头部信息。
 * @param name - 默认文件名。
 * @returns 无返回值。
 *
 * @example
 * // 后端需要添加Response.Headers.Add("Access-Control-Expose-Headers", "Content-Disposition")，并设置好文件名为example.xlsx
 * axios.get('https://api.example.com/download', {
 *   responseType: 'arraybuffer' // 确保请求类型为流
 * }).then((response) => {
 *   docDownLoadSteamFile(response); // 此时浏览器开始下载，并且保存的文件名正好是后端给出的example.xlsx
 * });
 */
export function docDownLoadSteamFile(data: AxiosResponse<string>, name: string): void {
  //请求类型需要使用流，responseType: 'arraybuffer',
  //如果需要文件名，后端需要添加 Response.Headers.Add("Access-Control-Expose-Headers", "Content-Disposition");
  const content = data.headers['content-disposition'];
  let fileName = name;
  if (content) {
    //Content-Disposition: attachment; filename=____20220919161042.xls; filename*=UTF-8''%E6%B5%8B%E6%8E%A7%E7%82%B9%E8%A1%A820220919161042.xls
    let fileNames = data.headers['content-disposition'].split(';');
    fileNames = fileNames.at(-1)?.split("''") ?? [];
    if (fileNames.length === 2)
      fileName = decodeURI(fileNames.at(-1)!);
  }
  const url = URL.createObjectURL(new Blob([data.data]));
  docDownloadFile(url, fileName)
}

/**
 * 打印指定的DOM内容。
 *
 * @param innerHTML - 要打印的HTML内容。
 * @param headStyle - 可选的CSS样式，将附加到文档头部head部分。
 * @param cssPaths - 可选的CSS文件路径数组，这些文件将被加载并应用到文档中。
 * @param size - 打印纸张大小，可以是字符串（'A4X' 或 'A4Y'）或数字（毫米），A4X表示A4纸纵向打印，A4Y表示A4纸纵向打印。
 * @param debug - 可选的调试模式，如果为true，则iframe会在页面上可见。默认值为false。
 * @returns 无实际返回值。
 *
 * @example
 * // 示例：打印一个简单的HTML字符串
 * docPrintDom('<div>Hello, World!</div>', undefined, undefined, 'A4X', true);
 */
export async function docPrintDom(innerHTML: string, headStyle?: string, cssPaths?: string[], size?: 'A4X' | 'A4Y' | number, debug = false): Promise<void> {
  const iframe = document.createElement('iframe');
  if (debug)
    iframe.setAttribute('style', 'position:absolute;width:100%;height:100%;left:0;top:0;border:none');
  else
    iframe.setAttribute('style', 'position:absolute;width:0;height:0;left:-500;top:-500;border:none');
  document.body.appendChild(iframe);
  const doc = iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    if (size) {
      //获取长度（毫米）
      let pageWidth: number;
      if (typeof size === 'string') {
        pageWidth = size === 'A4X' ? 210 : 297;
      } else
        pageWidth = size;
      //将毫米转换为像素
      const bodyWidth = Math.round(pageWidth * 480 / 127);
      doc.write("<style>" + "body{width:" + bodyWidth + "px}" + "</style>")
    }
    if (headStyle) {
      doc.write("<style>" + headStyle + "</style>")
    }
    doc.write('<div class="appContainer">' + innerHTML + '</div>');
    doc.close();
    if (cssPaths) {
      await Promise.all(cssPaths.map(x => docLoadCss(x, doc)));
    }
    if (!debug)
      iframe.contentWindow.addEventListener("afterprint", () => {
        document.body.removeChild(iframe)
      });
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  }
}

function docOpenFileDialog(fileExtension: string, multiple: true): Promise<File[]>
function docOpenFileDialog(fileExtension: string, multiple: false): Promise<File | null>
/**
 * 打开文件选择对话框并返回选中的文件。
 *
 * @param fileExtension - 允许的文件扩展名，例如 '.txt' 或 '.jpg,.png'。
 * @param multiple - 是否允许多个文件选择。如果为 `true`，则返回一个文件数组；如果为 `false`，则返回单个文件或 `null`。
 * @returns 返回一个 Promise，解析为选中的文件或文件数组，如果用户取消对话框，则返回 `null`。
 *
 * @example
 * // 选择单个文件
 * const file = await docOpenFileDialog('.jpg,.png', false)
 * if (file) {
 *   // do something, like upload
 * }
 *
 * @example
 * // 选择多个文件
 * const files = await docOpenFileDialog('.jpg,.png', true)
 * if (files) {
 *   // do something, like upload
 * }
 */
function docOpenFileDialog(fileExtension: string, multiple: boolean): Promise<File | File[] | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = fileExtension;
    input.multiple = multiple;
    input.addEventListener('change', (event) => {
      if (multiple)
        resolve(input.files === null ? [] : Array.from(input.files))
      else
        resolve(input.files?.[0] || null);
    });
    input.click();
    // 由于input的change事件无法监听到用户取消的情况，所以在文件选择对话框打开后（对话框会阻塞进程），监听文档的鼠标移动事件，当鼠标移动时，表明对话框已关闭
    document.addEventListener('mousemove', () => {
      resolve(null)
    }, {once: true});
  });
}

export {docOpenFileDialog}