// 部署任务模块

const fs = require('fs')
const path = require('path')
const { updateGitRepo } = require('./git-updater')
const { logger } = require('./utils/logger')

/**
 * 创建部署任务执行器
 * @param {object} config - 部署配置
 * @param {function} execCommand - 命令执行函数
 * @returns {object} 任务函数集合
 */
function createDeployTasks(config, execCommand) {
  const getDeployDirs = (deployDir) => {
    if (Array.isArray(deployDir)) return deployDir
    if (!deployDir) return []
    return [deployDir]
  }

  return {
    /**
     * 检查依赖
     */
    checkDependencies() {
      logger.info('检查依赖...')

      const dependencies = ['node', 'pnpm', 'git']
      for (const dep of dependencies) {
        const result = execCommand(`which ${dep}`, { stdio: 'ignore' })
        if (!result.success) {
          throw new Error(`${dep} 未安装`)
        }
      }
      logger.success('依赖检查通过')
    },

    /**
     * 安装项目依赖
     */
    installDependencies() {
      try {
        logger.info('安装项目依赖...')

        const installResult = execCommand('pnpm i', { stdio: 'inherit' })
        if (!installResult.success) {
          logger.error('项目依赖安装失败')
        }

        logger.success('项目依赖安装完成')
      } catch (e) {
        logger.error(e)
      }
    },

    /**
     * 检查目录
     */
    checkDirectories() {
      logger.info('检查目录...')

      // 检查源码目录
      if (!fs.existsSync(config.sourcePath)) {
        throw new Error(`源码目录不存在: ${config.sourcePath}`)
      }

      // 检查构建产物目录
      if (!fs.existsSync(config.deployPath)) {
        logger.warn(`构建产物目录不存在，正在创建: ${config.deployPath}`)
        execCommand(`sudo mkdir -p ${config.deployPath}`)
        execCommand(`sudo chown deploy:deploy ${config.deployPath}`)
      }

      // 检查各个应用目录
      Object.values(config.apps).forEach((app) => {
        const deployDirs = getDeployDirs(app.deployDir)
        deployDirs.forEach((deployDir) => {
          const appPath = path.join(config.deployPath, deployDir)
          if (!fs.existsSync(appPath)) {
            logger.warn(`应用目录不存在，正在创建: ${appPath}`)
            execCommand(`sudo mkdir -p ${appPath}`)
            execCommand(`sudo chown deploy:deploy ${appPath}`)
          }
        })
      })

      logger.success('目录检查完成')
    },

    /**
     * 更新代码
     */
    updateCode() {
      updateGitRepo({
        repoPath: config.sourcePath,
        branch: config.branch,
        force: true,
        verbose: config.verbose,
      })
    },

    /**
     * 部署单个应用
     * @param {string} appKey - 应用键名
     */
    deployApp(appKey) {
      const app = config.apps[appKey]
      if (!app) {
        throw new Error(`未知的应用: ${appKey}`)
      }
      const deployDirs = getDeployDirs(app.deployDir)
      if (deployDirs.length === 0) {
        throw new Error(`${app.description || appKey} 未配置 deployDir`)
      }

      logger.info(`开始部署 ${app.description}...`)

      // 检查 package.json 是否存在
      const packageJsonPath = path.join(config.sourcePath, 'package.json')
      if (!fs.existsSync(packageJsonPath)) {
        logger.warn(`${app.description} package.json 不存在，跳过部署`)
        return
      }

      // 显示环境变量信息
      if (config.verbose) {
        logger.debug(
          `预发布环境变量: NODE_ENV=${config.env.NODE_ENV}, DEPLOY_ENV=${config.env.DEPLOY_ENV}, BUILD_ENV=${config.env.BUILD_ENV}`,
          true
        )
      }

      // 清除构建缓存（可选）
      if (config.clearCache) {
        logger.info('清除 Turbo 缓存...')
        execCommand('pnpm exec turbo daemon clean', { stdio: 'pipe' })
      }

      // 构建项目
      logger.info(`构建 ${app.description}...`)
      if (config.verbose) {
        logger.debug(`使用构建命令: pnpm ${app.buildCommand}`, true)
        logger.debug(`环境变量: NODE_ENV=${config.env.NODE_ENV}, VITE_MODE=${config.env.VITE_MODE}`, true)
      }

      // 使用 --force 标志强制重新构建（如果需要）
      const forceFlag = config.clearCache ? ' --force' : ''
      const buildResult = execCommand(`pnpm ${app.buildCommand}${forceFlag}`, { stdio: 'inherit' })
      if (!buildResult.success) {
        throw new Error(`${app.description} 构建失败`)
      }

      // 检查构建产物
      const sourceDirPath = path.join(config.sourcePath, app.sourceDir)
      if (!fs.existsSync(sourceDirPath)) {
        throw new Error(`${app.description} 构建失败，构建产物目录不存在: ${sourceDirPath}`)
      }

      // 复制构建产物到服务目录
      deployDirs.forEach((deployDir) => {
        const deployDirPath = path.join(config.deployPath, deployDir)
        logger.info(`复制构建产物到 ${deployDirPath}...`)

        const rmResult = execCommand(`sudo rm -rf ${deployDirPath}/*`)
        if (!rmResult.success && config.verbose) {
          logger.warn('清理目录失败，继续执行')
        }

        const cpResult = execCommand(`sudo cp -r ${sourceDirPath}/* ${deployDirPath}/`)
        if (!cpResult.success) {
          throw new Error(`${app.description} 复制构建产物失败`)
        }

        const chownResult = execCommand(`sudo chown -R deploy:deploy ${deployDirPath}`)
        if (!chownResult.success && config.verbose) {
          logger.warn('设置文件权限失败')
        }
      })

      logger.success(`${app.description} 部署完成`)
    },

    /**
     * 重启 Nginx
     */
    restartNginx() {
      logger.info('重启 Nginx...')

      const testResult = execCommand('sudo nginx -t', { stdio: 'pipe' })
      if (testResult.success) {
        const reloadResult = execCommand('sudo systemctl reload nginx')
        if (reloadResult.success) {
          logger.success('Nginx 配置重载成功')
        } else {
          logger.warn('Nginx 重载失败，但继续执行')
        }
      } else {
        logger.warn('Nginx 配置测试失败，跳过重载')
      }
    },

    /**
     * 显示部署信息
     */
    showDeploymentInfo() {
      logger.success('部署完成！')
      console.log('')
      console.log('📁 部署路径信息：')
      console.log(`   源码目录: ${config.sourcePath}`)
      console.log(`   构建产物目录: ${config.deployPath}`)
      console.log('')
      console.log('🌐 访问地址：')

      Object.entries(config.apps).forEach(([, app]) => {
        const deployDirs = getDeployDirs(app.deployDir)
        const links = deployDirs.map((deployDir) => `http://your-domain.com/${deployDir}`).join(', ')
        console.log(`   ${app.description}: ${links}`)
      })

      console.log('')
      console.log('📋 部署的应用：')
      const lsResult = execCommand(`ls -la ${config.deployPath}`)
      if (lsResult.success) {
        const output = lsResult.result?.toString().trim()
        if (output) {
          console.log(output)
        }
      } else {
        console.log('无法列出部署目录内容')
      }
    },
  }
}

module.exports = {
  createDeployTasks,
}
