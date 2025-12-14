/**
 * 表格数据复制工具函数
 */

/**
 * 定义表格复制数据的类型
 */
export interface TableCopyData {
  text?: string
  html?: string
  data?: Array<string[] | string>
  [key: string]: unknown
}

/**
 * 复制数据到剪贴板（使用最兼容的方式，保持Excel格式）
 * @param copyData 要复制的数据
 * @returns 复制操作的结果，成功返回true，失败返回false
 */
export const copyToClipboard = (copyData: string, htmlData?: string): boolean => {
  try {
    // 创建一个临时的textarea元素
    const textarea = document.createElement('textarea')

    // 设置元素样式为不可见
    textarea.style.position = 'fixed'
    textarea.style.top = '0'
    textarea.style.left = '0'
    textarea.style.width = '1px'
    textarea.style.height = '1px'
    textarea.style.padding = '0'
    textarea.style.border = 'none'
    textarea.style.outline = 'none'
    textarea.style.boxShadow = 'none'
    textarea.style.background = 'transparent'

    // 设置要复制的文本
    textarea.value = copyData

    // 将元素添加到DOM
    document.body.appendChild(textarea)

    // 选中文本
    textarea.select()
    textarea.setSelectionRange(0, textarea.value.length)

    // 创建包含HTML格式数据的剪贴板事件处理（如果提供了HTML数据）
    if (htmlData) {
      const listener = (e: ClipboardEvent) => {
        try {
          e.clipboardData?.setData('text/html', htmlData)
          e.clipboardData?.setData('text/plain', copyData)
          e.preventDefault()
        } catch (err) {
          console.error('设置HTML格式数据失败:', err)
        }
      }

      // 添加临时事件监听器
      document.addEventListener('copy', listener as EventListener)

      // 执行复制命令
      const successful = document.execCommand('copy')

      // 移除事件监听器
      document.removeEventListener('copy', listener as EventListener)

      // 移除临时元素
      document.body.removeChild(textarea)

      return successful
    } else {
      // 如果没有HTML数据，直接执行复制命令
      const successful = document.execCommand('copy')

      // 移除临时元素
      document.body.removeChild(textarea)

      return successful
    }
  } catch (error) {
    console.error('复制到剪贴板失败:', error)
    return false
  }
}

/**
 * 处理表格复制数据，保持原始格式
 * @param copyData 表格复制事件提供的数据
 * @returns 复制操作的结果
 */
export const handleTableCopy = (copyData: TableCopyData): boolean => {
  try {
    if (!copyData) {
      return false
    }

    // 保持原始格式复制，优先使用text和html组合（适合Excel格式）
    if (copyData.text && typeof copyData.text === 'string') {
      // 如果同时提供了html数据，使用html格式保持表格结构
      if (copyData.html && typeof copyData.html === 'string') {
        return copyToClipboard(copyData.text, copyData.html)
      }

      // 只有文本，直接复制文本
      return copyToClipboard(copyData.text)
    }

    // 如果有data数组但没有text, 转换为制表符分隔的格式（适合Excel）
    if (copyData.data && Array.isArray(copyData.data)) {
      const formattedText = copyData.data
        .map((row) => {
          if (Array.isArray(row)) {
            return row.join('\t')
          }
          return row
        })
        .join('\n')

      // 如果同时需要生成HTML表格格式
      const formattedHtml = `<table>\n${copyData.data
        .map((row) => {
          if (Array.isArray(row)) {
            return `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`
          }
          return `<tr><td>${row}</td></tr>`
        })
        .join('\n')}\n</table>`

      return copyToClipboard(formattedText, formattedHtml)
    }

    // 如果是其他数据类型，作为JSON处理
    const jsonString = JSON.stringify(copyData)
    return copyToClipboard(jsonString)
  } catch (error) {
    console.error('处理复制数据失败:', error)
    return false
  }
}
