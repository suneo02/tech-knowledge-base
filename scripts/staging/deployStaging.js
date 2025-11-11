#!/usr/bin/env node

/**
 * 预发布环境部署脚本
 *
 * 用法:
 *   node deployStaging.js --all                # 部署所有应用
 *   node deployStaging.js company              # 部署单个应用
 *   node deployStaging.js --verbose company    # 显示详细输出
 *   node deployStaging.js --help               # 显示帮助
 */

const { createDeployConfig } = require('./deploy-config')
const { createExecutor } = require('./utils/executor')
const { createDeployTasks } = require('./deploy-tasks')
const { showHelp, listApps, parseArgs, validateAppNames } = require('./cli-helper')
const { logger } = require('./utils/logger')

/**
 * 主函数
 */
function main() {
  const args = process.argv.slice(2)
  const { options, apps: appNames } = parseArgs(args)

  // 创建配置
  const config = createDeployConfig({
    verbose: options.verbose,
    clearCache: options.clearCache,
  })

  // 处理帮助选项
  if (options.help) {
    showHelp(config.apps)
    return
  }

  // 处理列表选项
  if (options.list) {
    listApps(config.apps)
    return
  }

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
    let appsToDeploy = []

    if (options.all || appNames.length === 0) {
      appsToDeploy = Object.keys(config.apps)
    } else {
      // 验证应用名
      const invalidApps = validateAppNames(appNames, config.apps)
      if (invalidApps.length > 0) {
        throw new Error(`未知的应用: ${invalidApps.join(', ')}`)
      }
      appsToDeploy = appNames
    }

    logger.info(`准备部署 ${appsToDeploy.length} 个应用: ${appsToDeploy.join(', ')}`)

    // 5. 部署应用
    appsToDeploy.forEach((appKey, index) => {
      logger.info(`[${index + 1}/${appsToDeploy.length}] 开始部署 ${config.apps[appKey].description}`)
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
