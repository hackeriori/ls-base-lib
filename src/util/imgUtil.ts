/**
 * 保存canvas指定区域为Blob，该方法在画布被污染的情况下不可用
 * 如果不需要指定区域，那么直接用canvas.toBlob方法，因为该方法会通过临时canvas中转
 * 如果需要将该源提供给其他元素加载，可以使用URL.createObjectURL()
 * @param canvas 画布元素
 * @param x 左上角x坐标
 * @param y 左上角y坐标
 * @param width 宽度
 * @param height 高度
 * @param exportType 图片格式，默认为 image/png
 * @param exportQuality 在指定图片格式为 image/jpeg 或 image/webp 的情况下，可以从 0 到 1 的区间内选择图片的质量。如果超出取值范围，将会使用默认值 0.92。
 */
export async function imgGetCanvasRect(canvas: HTMLCanvasElement, x: number, y: number, width: number, height: number, exportType?: string, exportQuality?: number): Promise<Blob | undefined> {
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const imageData = ctx.getImageData(x, y, width, height);
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx) {
      tempCtx.putImageData(imageData, 0, 0);
      return new Promise(resolve => {
        tempCanvas.toBlob(blob => {
          if (blob)
            resolve(blob);
          else
            resolve(undefined);
        }, exportType, exportQuality);
      });
    }
  }
}

/**
 * 新建一个HTMLImageElement，并设置src为指定的地址，在图片载入成功后返回img
 * @param src 图片地址
 * @param crossOrigin 设置图片跨域，常用于canvas导出
 */
export async function imgLoad(src: string, crossOrigin = true): Promise<HTMLImageElement | undefined> {
  return new Promise<HTMLImageElement | undefined>(resolve => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', () => resolve(undefined));
    if (crossOrigin)
      img.crossOrigin = 'Anonymous';
    img.src = src;
  });
}

/**
 * 重新调整图片大小，一般用于压缩图片，返回Blob
 * 如果需要将该源提供给其他元素加载，可以使用URL.createObjectURL()
 * @param img HTMLImageElement
 * @param sortSide 短边长度
 * @param exportType 图片格式，默认为 image/png
 * @param exportQuality 在指定图片格式为 image/jpeg 或 image/webp 的情况下，可以从 0 到 1 的区间内选择图片的质量。如果超出取值范围，将会使用默认值 0.92。
 * */
export function imgResize(img: HTMLImageElement, sortSide: number, exportType?: string, exportQuality?: number) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (context) {
    const {width: originWidth, height: originHeight} = img;
    let targetWidth = originWidth;
    let targetHeight = originHeight;
    const originSortSide = Math.min(originWidth, originHeight);
    // 缩放
    if (originSortSide !== sortSide) {
      const scale = sortSide / originSortSide;
      // 目标尺寸
      targetWidth = Math.round(originWidth * scale);
      targetHeight = Math.round(originHeight * scale);
    }
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    // 图片绘制
    context.drawImage(img, 0, 0, targetWidth, targetHeight);
    return new Promise(resolve => {
      canvas.toBlob(blob => {
        if (blob)
          resolve(blob);
        else
          resolve(undefined);
      }, exportType, exportQuality);
    });
  }
}