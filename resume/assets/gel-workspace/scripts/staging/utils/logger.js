// 日志工具模块

// 颜色定义
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

/**
 * 日志工具
 */
const logger = {
  /**
   * 信息日志
   * @param {string} msg - 消息内容
   */
  info: (msg) => console.log(`${colors.green}[${new Date().toISOString()}] ${msg}${colors.reset}`),

  /**
   * 警告日志
   * @param {string} msg - 消息内容
   */
  warn: (msg) => console.log(`${colors.yellow}[WARNING] ${msg}${colors.reset}`),

  /**
   * 错误日志
   * @param {string} msg - 消息内容
   */
  error: (msg) => console.log(`${colors.red}[ERROR] ${msg}${colors.reset}`),

  /**
   * 成功日志
   * @param {string} msg - 消息内容
   */
  success: (msg) => console.log(`${colors.cyan}[SUCCESS] ${msg}${colors.reset}`),

  /**
   * 调试日志（仅在 verbose 模式下显示）
   * @param {string} msg - 消息内容
   * @param {boolean} verbose - 是否启用详细输出
   */
  debug: (msg, verbose = false) => {
    if (verbose) {
      console.log(`${colors.blue}[DEBUG] ${msg}${colors.reset}`)
    }
  },
}

module.exports = {
  colors,
  logger,
}
