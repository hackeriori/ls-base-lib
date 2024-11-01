import type {AxiosResponse} from "axios";

/**
 * 异步加载js文件
 * @param src js文件地址
 * @param doc 文档体
 */
export async function docLoadScript(src: string, doc?: Document) {
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
 * 异步加载css文件
 * @param src css文件地址
 * @param doc 文档体
 */
export async function docLoadCss(src: string, doc?: Document) {
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
 * 复制文本到剪贴板
 * @param text 带复制的文本
 */
export function docCopyText(text: string) {
  let success = false;
  const input = document.createElement('textarea');
  input.style.position = 'absolute'
  document.body.appendChild(input);
  input.value = text;
  input.select();
  //（此方法虽然已废弃，但是不需要https，不需要用户授权）
  if (document.execCommand)
    success = document.execCommand('copy');
  document.body.removeChild(input);
  return success;
}

/**
 * 通过a标签的形式下载文件
 * @param url 文件路径
 * @param name 指定下载文件名称
 */
export function docDownloadFile(url: string, name?: string) {
  let link = document.createElement("a");
  link.style.display = "none";
  link.href = url;
  link.setAttribute("download", name || '');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 下载接口返回的流数据
 * @param data Axios的返回信息
 * @param name 无法获取接口文件名称时的备用名称
 */
export function docDownLoadSteamFile(data: AxiosResponse<string>, name: string) {
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
 * 打印dom，通过iFrame实现
 * @param innerHTML html文本，一般由dom的父级元素通过innerHTML属性获取
 * @param headStyle 打印时需要写入head的样式
 * @param cssPaths 外郡样式文件列表
 * @param size 指定body的宽度，A4X为210mm，A4Y为297mm，也可以自己指定宽度（单位mm）
 * @param debug 是否调试打印，调试时打印时，生成的iFrame不会移除
 */
export async function docPrintDom(innerHTML: string, headStyle?: string, cssPaths?: string[], size?: 'A4X' | 'A4Y' | number, debug = false) {
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
 * 打开文件对话框选择文件
 * @param fileExtension 允许选择的文件后缀名，以逗号分割，同input的accept
 * @param multiple 是否允许选择多个文件
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