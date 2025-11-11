#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const { updateGitRepo } = require('./git-updater')

// 配置
const CONFIG = {
  sourceConfigPath: path.join(__dirname, 'frontend'),
  targetConfigPath: '/etc/nginx/sites-enabled/frontend',
  maxBackups: 5, // 最多保留的备份数量
  verbose: false,
}

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

// 日志函数
const log = {
  info: (msg) => console.log(`${colors.green}[INFO] ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}[WARN] ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}[ERROR] ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.cyan}[SUCCESS] ${msg}${colors.reset}`),
  debug: (msg) => CONFIG.verbose && console.log(`${colors.blue}[DEBUG] ${msg}${colors.reset}`),
}

// 执行命令
function execCommand(command, options = {}) {
  try {
    log.debug(`执行命令: ${command}`)
    const result = execSync(command, {
      stdio: options.stdio || 'pipe',
      encoding: 'utf-8',
      ...options,
    })
    return { success: true, result }
  } catch (error) {
    return { success: false, error }
  }
}

// 检查配置文件
function checkSourceConfig() {
  log.info('检查源配置文件...')

  if (!fs.existsSync(CONFIG.sourceConfigPath)) {
    throw new Error(`源配置文件不存在: ${CONFIG.sourceConfigPath}`)
  }

  // 读取并验证配置文件
  const configContent = fs.readFileSync(CONFIG.sourceConfigPath, 'utf-8')
  if (!configContent.includes('server {')) {
    throw new Error('配置文件格式不正确，缺少 server 块')
  }

  log.success(`源配置文件检查通过: ${CONFIG.sourceConfigPath}`)
  log.info(`配置文件大小: ${(configContent.length / 1024).toFixed(2)} KB`)

  return configContent
}

// 获取所有备份文件
function getBackupFiles() {
  const dirPath = path.dirname(CONFIG.targetConfigPath)
  const baseName = path.basename(CONFIG.targetConfigPath)
  const backupPattern = `${baseName}.backup.*`

  const lsResult = execCommand(`ls -1t ${dirPath}/${backupPattern} 2>/dev/null`)
  if (lsResult.success && lsResult.result) {
    return lsResult.result
      .trim()
      .split('\n')
      .filter((line) => line.trim())
  }
  return []
}

// 清理旧备份文件
function cleanOldBackups() {
  log.info(`清理旧备份文件（保留最近 ${CONFIG.maxBackups} 个）...`)

  const backups = getBackupFiles()
  log.debug(`找到 ${backups.length} 个备份文件`)

  if (backups.length <= CONFIG.maxBackups) {
    log.info(`备份文件数量未超过限制，无需清理`)
    return
  }

  // 需要删除的备份（保留最新的 maxBackups 个）
  const toDelete = backups.slice(CONFIG.maxBackups)
  log.info(`准备删除 ${toDelete.length} 个旧备份文件...`)

  let deletedCount = 0
  for (const backupFile of toDelete) {
    const deleteResult = execCommand(`sudo rm -f ${backupFile}`)
    if (deleteResult.success) {
      deletedCount++
      log.debug(`已删除: ${backupFile}`)
    } else {
      log.warn(`删除失败: ${backupFile}`)
    }
  }

  if (deletedCount > 0) {
    log.success(`已清理 ${deletedCount} 个旧备份文件`)
  }
}

// 备份现有配置文件
function backupConfig() {
  log.info('备份现有配置文件...')

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
  const backupPath = `${CONFIG.targetConfigPath}.backup.${timestamp}`

  // 检查配置文件是否存在
  const checkResult = execCommand(`test -f ${CONFIG.targetConfigPath} && echo "exists"`)
  if (checkResult.success && checkResult.result?.trim() === 'exists') {
    const backupResult = execCommand(`sudo cp ${CONFIG.targetConfigPath} ${backupPath}`)
    if (!backupResult.success) {
      log.warn('备份配置文件失败，但继续执行')
    } else {
      log.success(`配置文件已备份到: ${backupPath}`)
      
      // 清理旧备份
      cleanOldBackups()
      
      return backupPath
    }
  } else {
    log.info('目标配置文件不存在，跳过备份')
  }

  return null
}

// 复制配置文件
function copyConfig() {
  log.info('复制配置文件到 Nginx 目录...')

  const cpResult = execCommand(`sudo cp ${CONFIG.sourceConfigPath} ${CONFIG.targetConfigPath}`)
  if (!cpResult.success) {
    throw new Error('复制配置文件失败，请检查文件权限')
  }

  log.success(`配置文件已复制到: ${CONFIG.targetConfigPath}`)
}

// 测试 nginx 配置
function testNginxConfig() {
  log.info('测试 Nginx 配置...')

  const testResult = execCommand('sudo nginx -t', { stdio: CONFIG.verbose ? 'inherit' : 'pipe' })
  if (!testResult.success) {
    log.error('Nginx 配置测试失败')
    if (testResult.error?.stderr) {
      console.log(testResult.error.stderr)
    }
    throw new Error('Nginx 配置测试失败，请检查配置文件语法')
  }

  log.success('Nginx 配置测试通过')
}

// 重新加载 nginx
function reloadNginx() {
  log.info('重新加载 Nginx...')

  const reloadResult = execCommand('sudo systemctl reload nginx')
  if (!reloadResult.success) {
    throw new Error('Nginx 重新加载失败')
  }

  log.success('Nginx 已重新加载')
}

// 验证部署
function verifyDeployment() {
  log.info('验证部署结果...')

  // 检查 nginx 状态
  const statusResult = execCommand('sudo systemctl status nginx | head -n 3')
  if (statusResult.success) {
    log.info('Nginx 服务状态:')
    console.log(statusResult.result)
  }

  // 检查配置文件是否存在
  const checkResult = execCommand(`ls -lh ${CONFIG.targetConfigPath}`)
  if (checkResult.success) {
    log.info('配置文件信息:')
    console.log(checkResult.result)
  }

  log.success('部署验证完成')
}

// 显示帮助信息
function showHelp() {
  console.log(`
🚀 Nginx 配置部署脚本使用说明

用法: node deployNginxConfig.js [选项]

选项:
  -h, --help              显示帮助信息
  -v, --verbose           显示详细输出
  --config <path>         指定源配置文件路径 (默认: ${CONFIG.sourceConfigPath})
  --target <path>         指定目标配置文件路径 (默认: ${CONFIG.targetConfigPath})
  --max-backups <number>  最多保留的备份数量 (默认: ${CONFIG.maxBackups})
  --dry-run               仅测试，不实际部署

配置信息:
  源配置文件: ${CONFIG.sourceConfigPath}
  目标配置路径: ${CONFIG.targetConfigPath}
  最大备份数量: ${CONFIG.maxBackups}

部署流程:
  1. 更新 Git 仓库（获取最新配置）
  2. 检查源配置文件
  3. 备份现有配置文件
  4. 复制新配置文件
  5. 测试 Nginx 配置
  6. 重新加载 Nginx
  7. 验证部署结果

示例:
  node deployNginxConfig.js                              # 部署配置
  node deployNginxConfig.js --verbose                    # 显示详细输出
  node deployNginxConfig.js --dry-run                    # 仅测试，不实际部署
  node deployNginxConfig.js --config /path/to/frontend   # 使用自定义源配置
  node deployNginxConfig.js --max-backups 10             # 保留最近 10 个备份

注意事项:
  1. 脚本需要在服务器上本地执行
  2. 需要 sudo 权限来操作 Nginx 配置
  3. 配置文件会自动备份，备份文件名包含时间戳
  4. 如果 Nginx 配置测试失败，不会重新加载服务
  5. 建议先使用 --dry-run 测试配置文件是否正确
`)
}

// 主函数
function main() {
  const args = process.argv.slice(2)

  // 处理帮助选项
  if (args.includes('-h') || args.includes('--help')) {
    showHelp()
    return
  }

  // 处理详细输出选项
  if (args.includes('-v') || args.includes('--verbose')) {
    CONFIG.verbose = true
  }

  // 处理自定义配置选项
  const configIndex = args.indexOf('--config')
  if (configIndex !== -1 && args[configIndex + 1]) {
    CONFIG.sourceConfigPath = args[configIndex + 1]
  }

  const targetIndex = args.indexOf('--target')
  if (targetIndex !== -1 && args[targetIndex + 1]) {
    CONFIG.targetConfigPath = args[targetIndex + 1]
  }

  const maxBackupsIndex = args.indexOf('--max-backups')
  if (maxBackupsIndex !== -1 && args[maxBackupsIndex + 1]) {
    const maxBackups = parseInt(args[maxBackupsIndex + 1], 10)
    if (!isNaN(maxBackups) && maxBackups > 0) {
      CONFIG.maxBackups = maxBackups
    } else {
      log.warn('--max-backups 参数无效，使用默认值')
    }
  }

  const dryRun = args.includes('--dry-run')

  let backupPath = null

  try {
    log.info('开始部署 Nginx 配置...')
    console.log('')
    log.info(`源配置文件: ${CONFIG.sourceConfigPath}`)
    log.info(`目标配置路径: ${CONFIG.targetConfigPath}`)
    console.log('')

    // 1. 更新 Git 仓库（获取最新配置）
    const repoPath = path.resolve(__dirname, '../..')
    try {
      updateGitRepo({
        repoPath,
        branch: 'staging',
        force: true,
        verbose: CONFIG.verbose,
      })
    } catch (error) {
      log.warn(`Git 更新失败: ${error.message}`)
      log.warn('将使用本地配置文件继续部署')
    }

    // 2. 检查源配置文件
    checkSourceConfig()

    if (dryRun) {
      log.info('DRY RUN 模式，仅验证源配置文件')
      log.success('源配置文件验证通过，未实际部署')
      return
    }

    // 3. 备份现有配置文件
    backupPath = backupConfig()

    // 4. 复制配置文件
    copyConfig()

    // 5. 测试 nginx 配置
    testNginxConfig()

    // 6. 重新加载 nginx
    reloadNginx()

    // 7. 验证部署
    verifyDeployment()

    console.log('')
    log.success('🎉 Nginx 配置部署成功！')
    console.log('')
    log.info('建议验证以下访问地址是否正常:')
    console.log('  - http://your-server/Wind.WFC.Enterprise.Web/PC.Front/Company')
    console.log('  - http://your-server/Wind.WFC.Enterprise.Web/PC.Front/reportai')
    console.log('')
  } catch (error) {
    console.log('')
    log.error(`部署失败: ${error.message}`)
    console.log('')
    if (backupPath) {
      log.info('如需恢复配置，请执行以下命令:')
      console.log(`  sudo cp ${backupPath} ${CONFIG.targetConfigPath}`)
      console.log(`  sudo nginx -t && sudo systemctl reload nginx`)
    }
    console.log('')
    process.exit(1)
  }
}

// 执行主函数
if (require.main === module) {
  main()
}

module.exports = {
  CONFIG,
  checkSourceConfig,
  getBackupFiles,
  cleanOldBackups,
  backupConfig,
  copyConfig,
  testNginxConfig,
  reloadNginx,
  verifyDeployment,
}

