#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const { 
  colors, 
  colorLog, 
  parseDeployArgs, 
  copyRecursive,
  fixEmptyCssFiles
} = require('./deploy-utils')

// 主函数
async function main() {
  const { apps: appsToProcess, branch: targetBranch, appConfigs } = parseDeployArgs()

  if (appsToProcess.length === 0) {
    colorLog('错误: 请指定要部署的应用，或使用 --all', colors.red)
    colorLog(`可用应用: ${Object.keys(appConfigs).join(', ')}`, colors.cyan)
    process.exit(1)
  }
  
  const rootDir = path.join(__dirname, '..')
  const parentDir = path.dirname(rootDir)
  const gitReleaseDir = path.join(parentDir, 'gel-release')

  try {
    if (!fs.existsSync(gitReleaseDir)) {
      colorLog(`未找到同级目录 gel-release: ${gitReleaseDir}`, colors.red)
      process.exit(1)
    }

    try {
      execSync('git rev-parse --is-inside-work-tree', { cwd: gitReleaseDir })
    } catch {
      colorLog('gel-release 不是一个 Git 仓库', colors.red)
      process.exit(1)
    }

    colorLog(`更新 ${targetBranch} 分支...`, colors.cyan)
    try {
      execSync('git fetch --all --prune', { stdio: 'inherit', cwd: gitReleaseDir })
      try {
        execSync(`git rev-parse --verify origin/${targetBranch}`, { cwd: gitReleaseDir })
        execSync(`git checkout -B ${targetBranch} origin/${targetBranch}`, { stdio: 'inherit', cwd: gitReleaseDir })
      } catch {
        // 如果远程分支不存在，尝试本地 checkout -B，如果本地也不存在则创建
        colorLog(`远程分支 origin/${targetBranch} 不存在，尝试切换或创建本地分支...`, colors.yellow)
        execSync(`git checkout -B ${targetBranch}`, { stdio: 'inherit', cwd: gitReleaseDir })
      }
    } catch (e) {
      colorLog(`更新 ${targetBranch} 分支失败: ${e.message}`, colors.red)
      process.exit(1)
    }

    const deployBaseDir = path.join(gitReleaseDir, 'deploy', 'pc-front')
    if (!fs.existsSync(deployBaseDir)) {
      fs.mkdirSync(deployBaseDir, { recursive: true })
    }
    
    for (const appName of appsToProcess) {
      const config = appConfigs[appName]

      // 虽然 utils 已经过滤了无效应用，但这里再检查一次更安全
      if (!config) continue

      const buildDir = path.join(rootDir, 'apps', appName, config.buildDir)

      // 确保构建目录存在
      if (!fs.existsSync(buildDir)) {
        colorLog(`构建目录 ${buildDir} 不存在，请先执行构建。`, colors.red)
        continue
      }



      const buildItems = fs.readdirSync(buildDir)
      const targetFolders = Array.isArray(config.deployDir) ? config.deployDir : [config.deployDir]

      for (const targetFolder of targetFolders) {
        const currentBaseDir = appName === 'wind-zx' ? path.join(gitReleaseDir, 'deploy') : deployBaseDir
        const targetDir = path.join(currentBaseDir, targetFolder)
        if (fs.existsSync(targetDir)) {
          colorLog(`清空目标目录 ${targetDir}...`, colors.yellow)
          fs.rmSync(targetDir, { recursive: true, force: true })
        }
        fs.mkdirSync(targetDir, { recursive: true })

        colorLog(`正在部署 ${appName} 到 ${targetDir}...`, colors.green)
        buildItems.forEach((itemName) => {
          const itemPath = path.join(buildDir, itemName)
          const destPath = path.join(targetDir, itemName)
          copyRecursive(itemPath, destPath)
        })
      }
    }

    let sourceSha = ''
    try {
      sourceSha = execSync('git rev-parse --short HEAD', { cwd: rootDir }).toString().trim()
    } catch {}

    const status = execSync('git status --porcelain', { cwd: gitReleaseDir }).toString().trim()
    if (status) {
      const appsDesc = appsToProcess.length > 3 
        ? `${appsToProcess.slice(0, 3).join(', ')} 等 ${appsToProcess.length} 个应用`
        : appsToProcess.join(', ')
        
      const commitMsg = `${targetBranch}: 同步 ${appsDesc} 构建产物 (gel-workspace-ops@${sourceSha})`
      
      colorLog(`提交并推送到 ${targetBranch} 分支...`, colors.cyan)
      execSync('git add deploy', { stdio: 'inherit', cwd: gitReleaseDir })
      execSync(`git commit -m "${commitMsg}"`, { stdio: 'inherit', cwd: gitReleaseDir })
      execSync(`git push origin ${targetBranch} --force-with-lease`, { stdio: 'inherit', cwd: gitReleaseDir })
      colorLog(`所有选定应用部署完成并已推送至 ${targetBranch}！`, colors.green)
    } else {
      colorLog('没有变更需要提交。', colors.yellow)
    }

    // 检查并修复 company CSS (单独提交)
    if (appsToProcess.includes('company')) {
      const config = appConfigs['company']
      const targetFolders = Array.isArray(config.deployDir) ? config.deployDir : [config.deployDir]

      for (const folder of targetFolders) {
        const targetPath = path.join(deployBaseDir, folder)
        fixEmptyCssFiles(targetPath)
      }

      const statusCss = execSync('git status --porcelain', { cwd: gitReleaseDir }).toString().trim()
      if (statusCss) {
        colorLog('提交空 CSS 文件修复...', colors.cyan)
        execSync('git add deploy', { stdio: 'inherit', cwd: gitReleaseDir })
        execSync('git commit -m "fix(company): empty css files"', { stdio: 'inherit', cwd: gitReleaseDir })
        execSync(`git push origin ${targetBranch}`, { stdio: 'inherit', cwd: gitReleaseDir })
        colorLog('空 CSS 文件修复已提交。', colors.green)
      }
    }
  } catch (error) {
    colorLog(`执行过程中出错: ${error.message}`, colors.red)
    process.exit(1)
  }
}

main()
 
