const fs = require('fs')
const path = require('path')

// 统一颜色输出
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

function colorLog(message, color) {
  console.log(`${color}${message}${colors.reset}`)
}

// 统一应用配置
// 这里整合了 deploy.js 和 deploy-config.js 的配置
const appConfigs = {
  company: {
    name: 'Company',
    buildDir: 'build',
    description: '企业主应用',
    // 兼容 staging 配置
    buildCommand: 'turbo build:staging --filter=company',
    sourceDir: 'apps/company/build',
    deployDir: ['Company', 'browser'],
  },
  'ai-chat': {
    name: 'AI Chat',
    buildDir: 'dist',
    description: 'AI 聊天应用',
    buildCommand: 'turbo build:staging --filter=ai-chat',
    sourceDir: 'apps/ai-chat/dist',
    deployDir: 'ai',
  },
  'report-ai': {
    name: 'Report AI',
    buildDir: 'dist',
    description: '报告 AI 应用',
    buildCommand: 'turbo build:staging --filter=report-ai',
    sourceDir: 'apps/report-ai/dist',
    deployDir: 'reportai',
  },
  'report-preview': {
    name: 'Report Preview',
    buildDir: 'dist',
    description: '报告预览应用',
    buildCommand: 'turbo build:staging --filter=report-preview',
    sourceDir: 'apps/report-preview/dist',
    deployDir: 'reportpreview',
  },
  'report-print': {
    name: 'Report Print',
    buildDir: 'dist',
    description: '报告打印应用',
    buildCommand: 'turbo build:staging --filter=report-print',
    sourceDir: 'apps/report-print/dist',
    deployDir: 'reportprint',
  },
  'wind-zx': {
    name: 'Wind ZX',
    buildDir: 'dist',
    description: 'Wind ZX 官网',
    buildCommand: 'turbo build:staging --filter=wind-zx',
    sourceDir: 'apps/wind-zx/dist',
    deployDir: 'windzx',
  },
  'super-agent': {
    name: 'Super Agent',
    buildDir: 'dist',
    description: 'Super Agent 应用',
    buildCommand: 'turbo build:staging --filter=super-agent',
    sourceDir: 'apps/super-agent/dist',
    deployDir: 'agent',
  },
}

/**
 * 解析并验证命令行参数
 * 支持格式:
 *   node script.js --all
 *   node script.js app1 app2
 *   node script.js app1 --branch test
 * @returns {object} { apps: string[], branch: string, options: object }
 */
function parseDeployArgs() {
  const args = process.argv.slice(2)
  let apps = []
  let branch = 'release' // 默认为 release，可以在脚本中覆盖默认值
  let options = {
    all: false,
    verbose: false,
    clearCache: false,
    help: false
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--branch') {
      branch = args[i + 1]
      i++ 
    } else if (arg === '--all') {
      options.all = true
    } else if (arg === '--verbose' || arg === '-v') {
      options.verbose = true
    } else if (arg === '--help' || arg === '-h') {
      options.help = true
    } else if (arg === '--clear-cache') {
      options.clearCache = true
    } else if (!arg.startsWith('--')) {
      apps.push(arg)
    }
  }

  if (options.all) {
    apps = Object.keys(appConfigs)
  }

  // 验证应用名称
  if (apps.length > 0) {
    const invalidApps = apps.filter(app => !appConfigs[app])
    if (invalidApps.length > 0) {
      colorLog(`错误: 未找到应用配置: ${invalidApps.join(', ')}`, colors.red)
      colorLog(`可用应用: ${Object.keys(appConfigs).join(', ')}`, colors.cyan)
      process.exit(1)
    }
  } else if (!options.all && process.argv[1].includes('deploy')) { 
      // 仅在明确是部署脚本且未提供app时提示，避免某些通用脚本误报
      // 这里简单处理，调用者应该检查 apps.length
  }

  return {
    apps,
    branch,
    options,
    appConfigs
  }
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

// 递归查找并修复空 CSS 文件
function fixEmptyCssFiles(directory) {
  if (!fs.existsSync(directory)) return

  const items = fs.readdirSync(directory)
  for (const item of items) {
    const itemPath = path.join(directory, item)
    const stat = fs.statSync(itemPath)

    if (stat.isDirectory()) {
      fixEmptyCssFiles(itemPath)
    } else if (item.endsWith('.css')) {
      const content = fs.readFileSync(itemPath, 'utf8')
      if (!content.trim()) {
        colorLog(`发现空 CSS 文件，自动修复: ${itemPath}`, colors.yellow)
        fs.writeFileSync(itemPath, '/**/')
      }
    }
  }
}

module.exports = {
  colors,
  colorLog,
  appConfigs,
  parseDeployArgs,
  copyRecursive,
  fixEmptyCssFiles
}
