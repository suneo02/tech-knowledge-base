#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const { 
  colors, 
  colorLog, 
  parseDeployArgs 
} = require('./deploy-utils')

// 主函数
async function main() {
  const { apps: appsToProcess, branch: targetBranch, options, appConfigs } = parseDeployArgs()

  if (appsToProcess.length === 0) {
    colorLog('错误: 请指定要构建的应用，或使用 --all', colors.red)
    colorLog(`可用应用: ${Object.keys(appConfigs).join(', ')}`, colors.cyan)
    process.exit(1)
  }

  const rootDir = path.join(__dirname, '..')

  try {
    colorLog('正在安装依赖...', colors.green)
    try {
      execSync('pnpm install', { stdio: 'inherit', cwd: rootDir })
      colorLog('依赖安装完成', colors.green)
    } catch (installError) {
      colorLog(`依赖安装失败: ${installError.message}`, colors.red)
    }

    for (const appName of appsToProcess) {
      const config = appConfigs[appName]

      // 虽然 utils 已经过滤了无效应用，但这里再检查一次更安全
      if (!config) continue

      // 使用 turbo 直接构建项目
      colorLog(`正在构建 ${appName}...`, colors.green)
      execSync(`pnpm turbo build --filter=${appName}`, { stdio: 'inherit', cwd: rootDir })

      const buildDir = path.join(rootDir, 'apps', appName, config.buildDir)

      // 确保构建目录存在
      if (!fs.existsSync(buildDir)) {
        colorLog(`构建目录 ${buildDir} 不存在，请检查 ${appName} 的构建配置`, colors.red)
        continue
      }

      colorLog(`${appName} 构建完成！构建产物位于: ${buildDir}`, colors.green)
    }

    colorLog('所有选定应用构建完成！', colors.green)

    // 调用部署脚本
    colorLog('开始部署...', colors.cyan)
    const deployScript = path.join(__dirname, 'deploy.js')
    
    let deployArgs = []
    
    if (options.all) {
      deployArgs.push('--all')
    } else {
      deployArgs.push(...appsToProcess)
    }
    
    if (targetBranch) {
      deployArgs.push('--branch', targetBranch)
    }
    
    const deployCommand = `node "${deployScript}" ${deployArgs.join(' ')}`

    execSync(deployCommand, { stdio: 'inherit', cwd: rootDir })

    colorLog('构建和部署全部完成！', colors.green)
  } catch (error) {
    colorLog(`执行过程中出错: ${error.message}`, colors.red)
    process.exit(1)
  }
}

main()
