// 命令执行器模块

const { execSync } = require('child_process')

/**
 * 创建命令执行器
 * @param {object} config - 配置对象
 * @returns {function} 执行命令的函数
 */
function createExecutor(config) {
  /**
   * 执行命令
   * @param {string} command - 要执行的命令
   * @param {object} options - 执行选项
   * @returns {object} 执行结果 { success: boolean, result?: any, error?: Error }
   */
  return function execCommand(command, options = {}) {
    try {
      // 设置环境变量
      const env = {
        ...process.env,
        ...config.env,
        ...options.env,
      }

      const result = execSync(command, {
        stdio: options.stdio || 'pipe',
        cwd: options.cwd || config.sourcePath,
        env,
        ...options,
      })

      return { success: true, result }
    } catch (error) {
      return { success: false, error }
    }
  }
}

module.exports = {
  createExecutor,
}
