/**
 * 下载文件到本地。
 *
 * @param {string} fileUrl - 要下载文件的URL地址。
 * @param {string} saveFileName - 下载文件时的保存文件名。
 */
export async function downloadFileToLocal(
  fileUrl: string,
  saveFileName: string,
  callbacks: {
    onSuccess?: () => void
    onError?: (errorMessage: string) => void
  } = {}
) {
  // 验证URL是否为有效的字符串
  if (typeof fileUrl !== 'string' || !fileUrl.trim()) {
    const errorMessage = '提供的URL不合法'
    console.error(errorMessage)
    callbacks?.onError?.(errorMessage)
  }

  // 验证文件名是否为有效的字符串
  if (typeof saveFileName !== 'string' || !saveFileName.trim()) {
    const errorMessage = '提供的文件名不合法'
    console.error(errorMessage)
    callbacks?.onError?.(errorMessage)
  }

  try {
    // 使用fetch API获取文件数据
    const response = await fetch(fileUrl)

    // 检查响应状态是否为成功
    if (!response.ok) {
      const errorMessage = `HTTP error! status: ${response.status}`
      callbacks?.onError?.(errorMessage)
      throw new Error(errorMessage)
    }

    // 获取blob数据
    const blob = await response.blob()

    // 创建一个新的URL对象表示指定的Blob对象
    const blobUrl = window.URL.createObjectURL(blob)

    // 创建一个隐藏的a标签用于下载
    const downloadLink = document.createElement('a')
    downloadLink.href = blobUrl
    downloadLink.download = saveFileName || 'download'
    document.body.appendChild(downloadLink)
    downloadLink.click()

    // 释放创建的URL对象
    window.URL.revokeObjectURL(blobUrl)
    document.body.removeChild(downloadLink)

    // 成功回调
    callbacks?.onSuccess?.()
    return
  } catch (error) {
    // 错误处理
    const errorMessage = `下载文件失败: ${error}`
    console.error(errorMessage)
    callbacks?.onError?.(errorMessage)
  }
}
