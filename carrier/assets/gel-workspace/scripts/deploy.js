#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

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

// 递归复制函数
function copyRecursive(src, dest) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true })
    }
    const entries = fs.readdirSync(src)
    for (const entry of entries) {
      const srcPath = path.join(src, entry)
      const destPath = path.join(dest, entry)
      copyRecursive(srcPath, destPath)
    }
  } else {
    fs.copyFileSync(src, dest)
  }
}

// 主函数
async function main() {
  const appToDeploy = process.argv[2]
  
  const rootDir = path.join(__dirname, '..')
  const WFC_DIR = 'D:\\whZhang.suneo\\SVN\\Src'
  const PC_FRONT_DIR = path.join(WFC_DIR, 'Wind.GEL.Enterprise.Font', 'dev', 'src', 'PC.Front')

  const appConfigs = {
    company: {
      buildDir: 'build',
      deployTargets: [path.join(PC_FRONT_DIR, 'browser'), path.join(PC_FRONT_DIR, 'Company')],
    },
    'ai-chat': {
      buildDir: 'dist',
      deployTargets: [path.join(PC_FRONT_DIR, 'ai')],
    },
    'report-print': {
      buildDir: 'dist',
      deployTargets: [path.join(PC_FRONT_DIR, 'reportprint')],
    },
    'report-preview': {
      buildDir: 'dist',
      deployTargets: [path.join(PC_FRONT_DIR, 'reportpreview')],
    },
    'report-ai': {
      buildDir: 'dist',
      deployTargets: [path.join(PC_FRONT_DIR, 'reportai')],
    },
  }

  const appsToProcess = appToDeploy ? [appToDeploy] : Object.keys(appConfigs)

  if (appToDeploy && !appConfigs[appToDeploy]) {
    colorLog(`错误: 未找到应用 '${appToDeploy}' 的配置。`, colors.red)
    colorLog(`可用应用: ${Object.keys(appConfigs).join(', ')}`, colors.cyan)
    process.exit(1)
  }

  try {
    for (const appName of appsToProcess) {
      const config = appConfigs[appName]

      if (!config) {
        colorLog(`未找到 ${appName} 的配置，跳过。`, colors.yellow)
        continue
      }

      const buildDir = path.join(rootDir, 'apps', appName, config.buildDir)

      // 确保构建目录存在
      if (!fs.existsSync(buildDir)) {
        colorLog(`构建目录 ${buildDir} 不存在，请先执行构建。`, colors.red)
        continue
      }

      if (config.deployTargets.length === 0) {
        colorLog(`没有为 ${appName} 配置部署目标，跳过部署。`, colors.yellow)
        continue
      }

      const buildItems = fs.readdirSync(buildDir)

      colorLog(`正在部署 ${appName}...`, colors.green)

      for (const targetDir of config.deployTargets) {
        // 检查目标目录是否存在
        colorLog(`检查目标目录 ${targetDir} 是否存在...`, colors.green)
        if (!fs.existsSync(targetDir)) {
          colorLog(`警告: 目标目录不存在: ${targetDir}，将为您创建。`, colors.yellow)
          fs.mkdirSync(targetDir, { recursive: true })
        }

        const deletedItems = []
        buildItems.forEach((itemName) => {
          const targetPath = path.join(targetDir, itemName)
          if (fs.existsSync(targetPath)) {
            deletedItems.push(itemName)
            if (fs.lstatSync(targetPath).isDirectory()) {
              fs.rmSync(targetPath, { recursive: true, force: true })
            } else {
              fs.unlinkSync(targetPath)
            }
          }
        })

        if (deletedItems.length > 0) {
          colorLog(`在 ${targetDir} 中删除已存在的文件: ${deletedItems.join(', ')}`, colors.yellow)
        }

        colorLog(`复制 ${buildItems.join(', ')} 到 ${targetDir}`, colors.cyan)
        buildItems.forEach((itemName) => {
          const itemPath = path.join(buildDir, itemName)
          const targetPath = path.join(targetDir, itemName)
          copyRecursive(itemPath, targetPath)
        })
      }
    }

    colorLog('所有应用部署完成！', colors.green)
  } catch (error) {
    colorLog(`执行过程中出错: ${error.message}`, colors.red)
    process.exit(1)
  }
}

main() 