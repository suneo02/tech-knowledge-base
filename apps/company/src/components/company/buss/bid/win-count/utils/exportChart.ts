let _html2canvas: ((element: HTMLElement, options?: any) => Promise<HTMLCanvasElement>) | null = null
const loadHtml2canvas = async () => {
  if (_html2canvas) return _html2canvas
  const mod = await import('html2canvas')
  _html2canvas = mod.default
  return _html2canvas
}

/**
 * 导出图表为图片的工具函数
 *
 * @description 将指定的DOM元素转换为图片并自动下载
 * @since 1.0.0
 */

/**
 * 导出图表为PNG图片
 *
 * @param element - 要导出的DOM元素
 * @param filename - 文件名（不包含扩展名）
 * @param options - 导出选项
 */
export const exportChartAsImage = async (
  element: HTMLElement,
  filename: string = 'chart',
  options: {
    scale?: number
    backgroundColor?: string
    width?: number
    height?: number
  } = {}
): Promise<void> => {
  try {
    const { scale = 2, backgroundColor = '#ffffff', width, height } = options

    // 配置html2canvas选项
    const html2canvas = await loadHtml2canvas()
    const canvas = await html2canvas(element, {
      scale,
      backgroundColor,
      width,
      height,
      useCORS: true,
      allowTaint: true,
      logging: false,
      // 确保图表完全渲染
      onclone: (clonedDoc: Document) => {
        const target = clonedDoc.querySelector('[data-chart-container]') || clonedDoc.body
        if (target instanceof HTMLElement) {
          target.style.display = 'block'
          target.style.visibility = 'visible'
        }
      },
    })

    // 创建下载链接
    const link = document.createElement('a')
    link.download = `${filename}.png`
    link.href = canvas.toDataURL('image/png')

    // 触发下载
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('导出图表失败:', error)
    throw new Error('export error')
  }
}
