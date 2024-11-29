/**
 * 获取canvas指定区域的图像数据并导出为Blob对象（需要确保canvas的画布未被污染）。<br/>
 * 如果不需要指定区域，那么直接用canvas.toBlob方法，因为这个方法会通过临时canvas中转。<br/>
 * 如果需要将Blob提供给其他元素加载，可以使用URL.createObjectURL方法创建链接
 *
 * @param canvas - 画布元素
 * @param x - 图像矩形区域的左上角X坐标
 * @param y - 图像矩形区域的左上角Y坐标。
 * @param width - 图像矩形区域的宽度。
 * @param height - 图像矩形区域的高度
 * @param exportType - 可选参数，指定导出文件类型，默认为 'image/png'
 * @param exportQuality - 可选参数，指定导出图片质量（0-1），在指定图片格式为 image/jpeg 或 image/webp 的情况下，可以从 0 到 1 的区间内选择图片的质量。如果超出取值范围，将会使用默认值 0.92。
 *
 * @example
 * // 获取指定区域并导出为png图片
 * const blob = await imgGetCanvasRect(canvasElement, 10, 20, 150, 100)
 * if (blob) {
 *   console.log('Blob created:', blob);
 * }
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
      return new Promise<Blob | undefined>(resolve => {
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
 * 加载图片并返回一个HTMLImageElement对象
 *
 * @param src - 图片的URL地址。
 * @param crossOrigin - 是否设置跨域属性，以允许从其他域加载图片。
 * @returns 一个Promise对象，解析为HTMLImageElement或undefined。
 *
 * @example
 * async function loadImage() {
 *   const img = await imgLoad('https://example.com/image.jpg', true);
 *   if (img) {
 *     document.body.appendChild(img);
 *   } else {
 *     console.error('图片加载失败');
 *   }
 * }
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
 * 根据指定的尺寸调整图片大小，并返回一个新的 `Blob` 对象。
 *
 * @param img - 要调整大小的图片元素。
 * @param targetSide - 目标图片的最小或最大边长，取决于 `scaleType` 参数。
 * @param scaleType - 指定是根据长边（'long'）还是短边（'short'）进行缩放。默认值为 'long'。
 * @param exportType - 可选参数，指定导出文件类型，默认为 'image/png'
 * @param exportQuality - 可选参数，指定导出图片质量（0-1），在指定图片格式为 image/jpeg 或 image/webp 的情况下，可以从 0 到 1 的区间内选择图片的质量。如果超出取值范围，将会使用默认值 0.92。
 * @returns 一个 Promise，解析为调整大小后的图片的 `Blob` 对象，如果失败则解析为 `undefined`。
 *
 * @example
 * ```typescript
 * const img = new Image();
 * img.src = 'path/to/image.jpg';
 * img.onload = async () => {
 *   const resizedImage = await imgResize(img, 200); // 将图片压缩成最大边长为200的图片
 *   if (resizedImage) {
 *     const url = URL.createObjectURL(resizedImage);
 *     docDownloadFile(url);
 *   } else {
 *     console.error('Failed to resize image.');
 *   }
 * };
 * ```
 */
export async function imgResize(img: HTMLImageElement, targetSide: number, scaleType: 'long' | 'short' = 'long', exportType?: string, exportQuality?: number): Promise<Blob | undefined> {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (context) {
    const {width: originWidth, height: originHeight} = img;
    let targetWidth = originWidth;
    let targetHeight = originHeight;
    const originSortSide = scaleType === 'long' ? Math.max(originWidth, originHeight) : Math.min(originWidth, originHeight);
    // 缩放
    if (originSortSide !== targetSide) {
      const scale = targetSide / originSortSide;
      // 目标尺寸
      targetWidth = Math.round(originWidth * scale);
      targetHeight = Math.round(originHeight * scale);
    }
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    // 图片绘制
    context.drawImage(img, 0, 0, targetWidth, targetHeight);
    return new Promise<Blob | undefined>(resolve => {
      canvas.toBlob(blob => {
        if (blob)
          resolve(blob);
        else
          resolve(undefined);
      }, exportType, exportQuality);
    });
  }
}