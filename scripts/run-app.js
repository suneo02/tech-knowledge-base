#!/usr/bin/env node

/**
 * 通用应用管理脚本
 * 用法:
 *   pnpm app dev report-ai
 *   pnpm app build company --staging
 *   pnpm app tsc ai-chat
 *   pnpm app deploy-prod company
 *   pnpm app deploy-staging company --verbose
 */

const { execSync } = require('child_process')
const path = require('path')

const args = process.argv.slice(2)
const command = args[0] // dev, build, tsc, serve, deploy-prod, deploy-staging
const appName = args[1] // app 名称
const flags = args.slice(2) // 额外参数

// 彩色输出
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

function showHelp() {
  colorLog('\n📦 应用管理工具 - 统一的开发、构建和部署入口\n', colors.cyan)

  console.log('用法: pnpm app <command> [options]\n')

  colorLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.cyan)
  colorLog('开发命令', colors.green)
  colorLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.cyan)
  console.log('  dev <app>')
  console.log('    启动应用开发模式（自动构建依赖包）')
  console.log('    示例: pnpm app dev report-ai\n')

  console.log('  build <app|--all> [--staging]')
  console.log('    构建应用及其依赖')
  console.log('    --staging: 构建预发布版本')
  console.log('    示例: pnpm app build company')
  console.log('    示例: pnpm app build company --staging')
  console.log('    示例: pnpm app build --all\n')

  console.log('  tsc <app>')
  console.log('    对应用进行 TypeScript 类型检查')
  console.log('    示例: pnpm app tsc ai-chat\n')

  console.log('  check:circular <app|--all>')
  console.log('    检查应用的循环依赖')
  console.log('    示例: pnpm app check:circular report-ai')
  console.log('    示例: pnpm app check:circular --all\n')

  console.log('  storybook <app>')
  console.log('    启动 Storybook 开发模式（自动构建依赖包）')
  console.log('    示例: pnpm app storybook report-ai\n')

  console.log('  serve <app>')
  console.log('    启动本地静态服务器预览已构建的应用')
  console.log('    示例: pnpm app serve company\n')

  colorLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.cyan)
  colorLog('部署命令', colors.green)
  colorLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.cyan)
  console.log('  deploy-prod <app|--all>')
  console.log('    构建并部署到生产环境（本地 SVN 目录）')
  console.log('    示例: pnpm app deploy-prod company')
  console.log('    示例: pnpm app deploy-prod --all\n')

  console.log('  deploy-staging <app|--all> [--verbose] [--clear-cache]')
  console.log('    部署到预发布环境（远程服务器）')
  console.log('    --verbose: 显示详细日志')
  console.log('    --clear-cache: 清除缓存后部署')
  console.log('    示例: pnpm app deploy-staging company')
  console.log('    示例: pnpm app deploy-staging --all --verbose\n')

  colorLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.cyan)
  colorLog('可用应用', colors.green)
  colorLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.cyan)
  console.log('  ai-chat         AI 聊天应用')
  console.log('  company         企业主应用')
  console.log('  report-ai       报告 AI 应用')
  console.log('  report-print    报告打印应用')
  console.log('  report-preview  报告预览应用')
  console.log('  wind-zx         Wind ZX 应用')
  console.log('  super-agent     Super Agent 应用\n')

  colorLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.cyan)
  colorLog('常用工作流', colors.green)
  colorLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.cyan)
  console.log('  # 本地开发')
  console.log('  pnpm app dev company')
  console.log('')
  console.log('  # 代码质量检查')
  console.log('  pnpm app tsc company')
  console.log('  pnpm app check:circular company')
  console.log('')
  console.log('  # 构建并本地预览')
  console.log('  pnpm app build company')
  console.log('  pnpm app serve company')
  console.log('')
  console.log('  # 部署到生产环境')
  console.log('  pnpm app deploy-prod company')
  console.log('')
  console.log('  # 部署到预发布环境（带详细日志）')
  console.log('  pnpm app deploy-staging company --verbose')
  console.log('')

  colorLog('💡 提示:', colors.yellow)
  console.log('  - 使用 --all 可以部署所有应用')
  console.log('  - staging 环境部署需要配置服务器访问权限')
  console.log('  - 更多信息请查看: scripts/README.md\n')
}

if (!command) {
  showHelp()
  process.exit(1)
}

// 所有命令都需要应用名（除了帮助命令）
if (!appName) {
  showHelp()
  process.exit(1)
}

const isStaging = flags.includes('--staging')
const rootDir = path.join(__dirname, '..')

try {
  let cmd = ''

  switch (command) {
    case 'dev':
      // dev 命令：启动开发模式（turbo 会自动构建依赖包）
      cmd = `turbo dev --filter=${appName}`
      break

    case 'build':
      // build 命令：构建 app 及其依赖
      const buildTask = isStaging ? 'build:staging' : 'build'
      if (appName === '--all') {
        // 构建所有应用：不使用 filter，交由 turbo 处理全局构建
        cmd = `turbo ${buildTask}`
      } else {
        cmd = `turbo ${buildTask} --filter=${appName}...`
      }
      break

    case 'tsc':
      if (appName === '--all') {
        cmd = `turbo tsc`
      } else {
        // 类型检查命令：先构建依赖包，然后检查依赖包和目标 app
        cmd = `turbo tsc --filter=${appName}...`
      }
      break

    case 'check:circular':
      // 循环依赖检查命令（递归检查依赖包）
      if (appName === '--all') {
        cmd = `turbo check:circular`
      } else {
        // 使用 ... 后缀递归检查当前包及其所有依赖包
        cmd = `turbo check:circular --filter=${appName}...`
      }
      break

    case 'storybook':
      // storybook 命令：启动 Storybook（turbo 会自动构建依赖包）
      cmd = `turbo storybook --filter=${appName}`
      break

    case 'serve':
      // 静态服务器命令
      const distPath = appName === 'company' ? 'build' : 'dist'
      cmd = `npx serve -s apps/${appName}/${distPath}`
      break

    case 'deploy-prod':
      // 生产环境：构建并部署
      colorLog('\n🚀 开始生产环境部署流程...', colors.cyan)
      if (appName === '--all') {
        cmd = `node "${path.join(__dirname, 'build-and-deploy.js')}"`
      } else {
        cmd = `node "${path.join(__dirname, 'build-and-deploy.js')}" ${appName}`
      }
      break

    case 'deploy-staging':
      // 预发布环境：部署到远程服务器
      colorLog('\n🚀 开始预发布环境部署流程...', colors.cyan)
      if (appName === '--all') {
        cmd = `node "${path.join(__dirname, 'staging', 'deployStaging.js')}" --all`
      } else {
        const stagingFlags = flags.join(' ')
        cmd = `node "${path.join(__dirname, 'staging', 'deployStaging.js')}" ${appName} ${stagingFlags}`.trim()
      }
      break

    default:
      console.error(`❌ 未知命令: ${command}`)
      process.exit(1)
  }

  console.log(`\n🚀 执行: ${cmd}\n`)
  execSync(cmd, { stdio: 'inherit', cwd: rootDir })

  if (command.startsWith('deploy-')) {
    colorLog('\n✅ 部署完成！', colors.green)
  }
} catch (error) {
  if (command.startsWith('deploy-')) {
    colorLog('\n❌ 部署失败', colors.red)
  } else {
    console.error(`\n❌ 命令执行失败`)
  }
  process.exit(1)
}
