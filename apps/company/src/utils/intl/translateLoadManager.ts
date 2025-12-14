import { message } from '@wind/wind-ui'

const TRANSLATE_MESSAGE_KEY = 'translate-loading'

/**
 * 翻译加载管理器
 * 用于统一管理翻译过程中的加载状态显示
 */
class TranslateLoadManager {
  // 通过 taskId 去重记录当前全局正在进行的翻译任务
  private globalTranslating = new Map<string, boolean>()
  // 标记当前是否已经展示翻译中的 loading
  private messageVisible = false
  // 延迟关闭 loading 的定时器句柄，确保 message 已创建完成
  private hideTimer: ReturnType<typeof setTimeout> | null = null

  // 清理遗留的延迟关闭定时器，避免重复关闭同一个 toast
  private clearHideTimer() {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer)
      this.hideTimer = null
    }
  }

  // 使用固定 key 打开 loading，保证全局只会出现一个翻译中的提示
  private showLoadingMessage() {
    message.open({
      key: TRANSLATE_MESSAGE_KEY,
      type: 'loading',
      content: 'Translate in progress',
      duration: 0,
    })
    this.messageVisible = true
  }

  // 关闭 loading 提示并同步可见状态
  private hideLoadingMessage() {
    message.destroy(TRANSLATE_MESSAGE_KEY)
    this.messageVisible = false
  }

  /**
   * 添加翻译任务
   * @param taskId 任务唯一标识
   */
  addLoadTask = (taskId: string): void => {
    // 添加防重复检查
    if (this.globalTranslating.has(taskId)) {
      return // 如果任务已存在，直接返回
    }

    this.globalTranslating.set(taskId, true)

    // 只在第一个任务时显示加载提示
    if (this.globalTranslating.size === 1) {
      this.clearHideTimer()
      this.showLoadingMessage()
    }
  }

  /**
   * 移除翻译任务
   * @param taskId 任务唯一标识
   */
  removeLoadTask = (taskId: string): void => {
    this.globalTranslating.delete(taskId)

    // 当所有任务完成时，隐藏加载提示
    if (this.globalTranslating.size === 0 && this.messageVisible) {
      this.clearHideTimer()

      // 延迟关闭消息确保其已经完成创建，避免重复 loading
      this.hideTimer = setTimeout(() => {
        this.hideLoadingMessage()
        this.clearHideTimer()
      }, 16)
    }
  }

  /**
   * 获取当前正在进行的任务数量
   */
  getTaskCount = (): number => {
    return this.globalTranslating.size
  }

  /**
   * 检查是否有任务正在进行
   */
  isTranslating = (): boolean => {
    return this.globalTranslating.size > 0
  }

  /**
   * 清除所有任务（用于异常情况下的清理）
   */
  clearAllTasks = (): void => {
    this.globalTranslating.clear()
    this.clearHideTimer()

    if (this.messageVisible) {
      // 清理方法同 addLoadTask，延迟关闭确保 message 内部状态一致
      setTimeout(() => {
        this.hideLoadingMessage()
      }, 0)
    }
  }
}

// 创建单例实例
export const translateLoadManager = new TranslateLoadManager()

// 导出方法的简化版本，保持向后兼容
export const addLoadTask = translateLoadManager.addLoadTask
export const removeLoadTask = translateLoadManager.removeLoadTask
