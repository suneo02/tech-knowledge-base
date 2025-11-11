#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// 彩色输出函数
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
}

function colorLog(message, color) {
  console.log(`${color}${message}${colors.reset}`)
}

// 主函数
async function main() {
  const appToBuild = process.argv[2]

  const rootDir = path.join(__dirname, '..')

  const appConfigs = {
    company: {
      buildDir: 'build',
    },
    'ai-chat': {
      buildDir: 'dist',
    },
    'report-print': {
      buildDir: 'dist',
    },
    'report-preview': {
      buildDir: 'dist',
    },
    'report-ai': {
      buildDir: 'dist',
    },
  }

  const appsToProcess = appToBuild ? [appToBuild] : Object.keys(appConfigs)

  if (appToBuild && !appConfigs[appToBuild]) {
    colorLog(`错误: 未找到应用 '${appToBuild}' 的配置。`, colors.red)
    colorLog(`可用应用: ${Object.keys(appConfigs).join(', ')}`, colors.cyan)
    process.exit(1)
  }

  try {
    const runAppScript = path.join(__dirname, 'run-app.js')

    for (const appName of appsToProcess) {
      const config = appConfigs[appName]

      if (!config) {
        colorLog(`未找到 ${appName} 的配置，跳过。`, colors.yellow)
        continue
      }

      // 使用统一的 run-app.js 构建项目
      colorLog(`正在构建 ${appName}...`, colors.green)
      execSync(`node "${runAppScript}" build ${appName}`, { stdio: 'inherit', cwd: rootDir })

      const buildDir = path.join(rootDir, 'apps', appName, config.buildDir)

      // 确保构建目录存在
      if (!fs.existsSync(buildDir)) {
        colorLog(`构建目录 ${buildDir} 不存在，请检查 ${appName} 的构建配置`, colors.red)
        continue
      }

      colorLog(`${appName} 构建完成！构建产物位于: ${buildDir}`, colors.green)
    }

    colorLog('所有应用构建完成！', colors.green)

    // 调用部署脚本
    colorLog('开始部署...', colors.cyan)
    const deployScript = path.join(__dirname, 'deploy.js')
    const deployCommand = appToBuild ? `node "${deployScript}" ${appToBuild}` : `node "${deployScript}"`

    execSync(deployCommand, { stdio: 'inherit', cwd: rootDir })

    colorLog('构建和部署全部完成！', colors.green)
  } catch (error) {
    colorLog(`执行过程中出错: ${error.message}`, colors.red)
    process.exit(1)
  }
}

main()
