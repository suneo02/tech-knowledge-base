#!/usr/bin/env node

/**
 * 预发布环境部署脚本
 *
 * 用法:
 *   node scripts/staging/deploy-staging.js --all                # 部署所有应用
 *   node scripts/staging/deploy-staging.js company              # 部署单个应用
 *   node scripts/staging/deploy-staging.js --verbose company    # 显示详细输出
 *   node scripts/staging/deploy-staging.js --help               # 显示帮助
 */

const { createDeployConfig } = require('./deploy-config')
const { createExecutor } = require('./utils/executor')
const { createDeployTasks } = require('./deploy-tasks')
const { logger } = require('./utils/logger')
const { 
  parseDeployArgs, 
  appConfigs: sharedAppConfigs, 
  colorLog, 
  colors 
} = require('../deploy-utils')

/**
 * 主函数
 */
function main() {
  const { apps: appNames, options } = parseDeployArgs()

  // 处理帮助选项
  if (options.help) {
    console.log(`
🚀 预发布环境部署脚本

用法:
  node scripts/staging/deploy-staging.js [options] [app...]

选项:
  --all             部署所有应用
  --verbose, -v     显示详细日志
  --clear-cache     清除缓存 (如有)
  --help, -h        显示此帮助信息

示例:
  node scripts/staging/deploy-staging.js company
  node scripts/staging/deploy-staging.js --all
`)
    return
  }

  // 创建配置
  // 注意：这里我们混合使用了本地的 deploy-config 和共享的 utils
  // 理想情况下应该完全合并，但为了最小化改动，我们保持 DEPLOY_CONFIG 结构
  // 但使用 sharedAppConfigs 来覆盖 apps 配置，确保源头统一
  const config = createDeployConfig({
    verbose: options.verbose,
    clearCache: options.clearCache,
    apps: sharedAppConfigs
  })

  try {
    // 创建命令执行器和任务执行器
    const execCommand = createExecutor(config)
    const tasks = createDeployTasks(config, execCommand)

    logger.info('开始部署到预发布环境...')

    // 1. 前置检查
    tasks.checkDependencies()
    tasks.checkDirectories()

    // 2. 更新代码
    tasks.updateCode()

    // 3. 安装依赖
    tasks.installDependencies()

    // 4. 确定要部署的应用
    let appsToDeploy = appNames

    if (options.all || appNames.length === 0) {
      if (!options.all && appNames.length === 0) {
        // 如果没有参数，deploy-utils 不会报错（除非是 strict），但这里我们希望默认行为还是需要明确
        // 不过 parseDeployArgs 在 deploy-utils 里如果没传参且没 --all，返回空数组
        // 原有逻辑是没参数报错或者显示帮助？
        // 让我们遵循 deploy-utils 的逻辑：如果为空，说明用户可能没传。
        // check deploy-utils again: if apps.length > 0 check invalid.
        // If length is 0 and no --all, it just returns empty.
        
        // 这里我们强制要求参数，或者 --all
        colorLog('错误: 请指定要部署的应用，或使用 --all', colors.red)
        process.exit(1)
      }
      appsToDeploy = Object.keys(config.apps)
    }

    logger.info(`准备部署 ${appsToDeploy.length} 个应用: ${appsToDeploy.join(', ')}`)

    // 5. 部署应用
    appsToDeploy.forEach((appKey, index) => {
      // 检查应用配置是否存在
      if (!config.apps[appKey]) {
        logger.warn(`跳过未知应用: ${appKey}`)
        return
      }
      
      logger.info(`[${index + 1}/${appsToDeploy.length}] 开始部署 ${config.apps[appKey].description || appKey}`)
      tasks.deployApp(appKey)
    })

    // 6. 重启服务
    tasks.restartNginx()

    // 7. 显示部署信息
    tasks.showDeploymentInfo()

    logger.success('所有应用部署完成！')
  } catch (error) {
    logger.error(`部署失败: ${error.message}`)
    process.exit(1)
  }
}

// 执行主函数
if (require.main === module) {
  main()
}

// 导出供测试使用
module.exports = {
  main,
}
