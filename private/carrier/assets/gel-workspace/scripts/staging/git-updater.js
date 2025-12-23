#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
}

// 日志函数
const log = {
  info: (msg) => console.log(`${colors.green}[INFO] ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}[WARN] ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}[ERROR] ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.cyan}[SUCCESS] ${msg}${colors.reset}`),
}

/**
 * 执行命令
 * @param {string} command - 要执行的命令
 * @param {object} options - 执行选项
 * @returns {{success: boolean, result?: string, error?: Error}}
 */
function execCommand(command, options = {}) {
  try {
    const result = execSync(command, {
      stdio: options.stdio || 'pipe',
      encoding: 'utf-8',
      cwd: options.cwd,
      ...options,
    })
    return { success: true, result }
  } catch (error) {
    return { success: false, error }
  }
}

/**
 * 更新 Git 仓库代码
 * @param {object} config - 配置对象
 * @param {string} config.repoPath - Git 仓库路径
 * @param {string} config.branch - 要切换的分支名（默认: staging）
 * @param {boolean} config.force - 是否强制更新，丢弃本地修改（默认: true）
 * @param {boolean} config.verbose - 是否显示详细输出（默认: false）
 * @returns {Promise<void>}
 */
function updateGitRepo(config = {}) {
  const {
    repoPath = process.cwd(),
    branch = 'staging',
    force = true,
    verbose = false,
  } = config

  log.info(`开始更新 Git 仓库: ${repoPath}`)

  // 检查是否是 Git 仓库
  if (!fs.existsSync(path.join(repoPath, '.git'))) {
    throw new Error(`当前目录不是 Git 仓库: ${repoPath}`)
  }

  // 显示更新前的状态
  log.info('检查当前 Git 状态...')
  const statusResult = execCommand('git status --porcelain', { cwd: repoPath })
  if (statusResult.success && statusResult.result?.trim()) {
    const hasChanges = statusResult.result.trim().length > 0
    if (hasChanges) {
      if (force) {
        log.warn('检测到本地修改，将强制更新到远程版本')
      } else {
        log.warn('检测到本地修改，但未启用强制更新')
        throw new Error('存在本地修改，请先提交或丢弃修改')
      }
    }
  }

  // 获取远程更新
  log.info('获取远程更新...')
  const fetchResult = execCommand(`git fetch origin ${branch}`, { cwd: repoPath })
  if (!fetchResult.success) {
    log.warn('获取远程更新失败，尝试继续')
  }

  if (force) {
    // 强制重置到远程分支（丢弃本地修改）
    log.info(`强制重置到远程 ${branch} 分支...`)

    // 1. 先重置暂存区
    const resetResult = execCommand('git reset --hard HEAD', { cwd: repoPath })
    if (!resetResult.success) {
      log.warn('重置暂存区失败')
    }

    // 2. 清理未跟踪的文件
    const cleanResult = execCommand('git clean -fd', { cwd: repoPath })
    if (!cleanResult.success) {
      log.warn('清理未跟踪文件失败')
    }
  }

  // 3. 切换到指定分支
  log.info(`切换到 ${branch} 分支...`)
  const checkoutResult = execCommand(`git checkout ${branch}`, { cwd: repoPath })
  if (!checkoutResult.success) {
    throw new Error(`无法切换到 ${branch} 分支`)
  }

  // 4. 更新到最新版本
  if (force) {
    // 强制重置到远程分支
    const forceResetResult = execCommand(`git reset --hard origin/${branch}`, { cwd: repoPath })
    if (!forceResetResult.success) {
      // 如果强制重置失败，尝试普通拉取
      log.warn('强制重置失败，尝试普通拉取...')
      const pullResult = execCommand(`git pull origin ${branch}`, {
        cwd: repoPath,
        stdio: verbose ? 'inherit' : 'pipe',
      })
      if (!pullResult.success) {
        throw new Error('代码更新失败，请检查网络连接和仓库权限')
      }
    } else {
      log.success('强制更新成功')
    }
  } else {
    // 普通拉取
    const pullResult = execCommand(`git pull origin ${branch}`, {
      cwd: repoPath,
      stdio: verbose ? 'inherit' : 'pipe',
    })
    if (!pullResult.success) {
      throw new Error('代码更新失败，请检查网络连接和仓库权限')
    }
    log.success('代码更新成功')
  }

  // 显示当前分支信息
  const branchResult = execCommand('git branch --show-current', { cwd: repoPath })
  const commitResult = execCommand('git log -1 --oneline --no-pager', { cwd: repoPath })

  if (branchResult.success) {
    log.info(`当前分支: ${branchResult.result?.trim()}`)
  }
  if (commitResult.success) {
    log.info(`最新提交: ${commitResult.result?.trim()}`)
  }

  log.success(`Git 仓库更新完成: ${repoPath}`)
}

/**
 * 获取当前 Git 信息
 * @param {string} repoPath - Git 仓库路径
 * @returns {{branch: string, commit: string, hasChanges: boolean}}
 */
function getGitInfo(repoPath = process.cwd()) {
  const branchResult = execCommand('git branch --show-current', { cwd: repoPath })
  const commitResult = execCommand('git log -1 --oneline --no-pager', { cwd: repoPath })
  const statusResult = execCommand('git status --porcelain', { cwd: repoPath })

  return {
    branch: branchResult.success ? branchResult.result?.trim() : 'unknown',
    commit: commitResult.success ? commitResult.result?.trim() : 'unknown',
    hasChanges: statusResult.success && statusResult.result?.trim().length > 0,
  }
}

module.exports = {
  updateGitRepo,
  getGitInfo,
  execCommand,
  log,
}

