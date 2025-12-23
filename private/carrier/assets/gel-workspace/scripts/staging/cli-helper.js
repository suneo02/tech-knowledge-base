// CLI 辅助函数模块

/**
 * 显示帮助信息
 * @param {object} apps - 应用配置对象
 */
function showHelp(apps) {
  console.log(`
🚀 预发布环境部署脚本使用说明

用法: node deployStaging.js [选项] [应用名]

选项:
  -h, --help          显示帮助信息
  -a, --all           部署所有应用
  -l, --list          列出所有可用应用
  -v, --verbose       显示详细输出
  --clear-cache       清除 Turbo 缓存后再构建

应用名:
  ${Object.entries(apps)
    .map(([key, app]) => `${key.padEnd(18)} - ${app.description}`)
    .join('\n  ')}

环境配置:
  自动使用 staging 环境配置
  NODE_ENV=production (生产级别构建)
  VITE_MODE=staging (staging 模式)

示例:
  node deployStaging.js --all                    # 部署所有应用
  node deployStaging.js company                  # 只部署 Company 应用
  node deployStaging.js ai-chat report-preview   # 部署 AI Chat 和 Report Preview 应用
  node deployStaging.js --list                   # 列出所有应用
  node deployStaging.js --verbose company        # 显示详细输出
  node deployStaging.js --clear-cache --all     # 清除缓存后部署所有应用
`)
}

/**
 * 列出所有应用
 * @param {object} apps - 应用配置对象
 */
function listApps(apps) {
  console.log('📋 可用应用列表：')
  Object.entries(apps).forEach(([key, app]) => {
    console.log(`  ${key.padEnd(15)} - ${app.description}`)
  })
}

/**
 * 解析命令行参数
 * @param {string[]} args - 命令行参数
 * @returns {object} 解析后的选项和应用列表
 */
function parseArgs(args) {
  const options = {
    help: args.includes('-h') || args.includes('--help'),
    list: args.includes('-l') || args.includes('--list'),
    all: args.includes('-a') || args.includes('--all'),
    verbose: args.includes('-v') || args.includes('--verbose'),
    clearCache: args.includes('--clear-cache'),
  }

  // 过滤出非选项参数（应用名）
  const apps = args.filter((arg) => !arg.startsWith('-'))

  return { options, apps }
}

/**
 * 验证应用名称
 * @param {string[]} appNames - 要验证的应用名列表
 * @param {object} appsConfig - 应用配置对象
 * @returns {string[]} 无效的应用名列表
 */
function validateAppNames(appNames, appsConfig) {
  return appNames.filter((app) => !appsConfig[app])
}

module.exports = {
  showHelp,
  listApps,
  parseArgs,
  validateAppNames,
}
