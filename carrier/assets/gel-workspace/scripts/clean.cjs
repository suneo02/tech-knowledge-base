/* Cross-platform robust cleaner to avoid Windows EPERM during rimraf */
/* Usage: node scripts/clean.cjs dist [build] */
const { rimraf } = require('rimraf')
const fs = require('fs')
const fsp = require('fs/promises')
const path = require('path')
const { spawnSync } = require('child_process')

const targets = process.argv.slice(2)
if (targets.length === 0) targets.push('dist')

async function removeWithRimraf(p) {
  return rimraf(p, { maxRetries: 30, retryDelay: 300, glob: false })
}

async function removeWithFs(p) {
  try {
    await fsp.rm(p, { recursive: true, force: true })
  } catch (e) {
    try {
      fs.rmSync(p, { recursive: true, force: true })
    } catch (e2) {
      throw e2
    }
  }
}

function removeWithCmd(p) {
  if (process.platform !== 'win32') return false
  const result = spawnSync('cmd.exe', ['/c', 'rmdir', '/s', '/q', p], {
    stdio: 'inherit',
  })
  return result.status === 0
}

function removeWithPowershell(p) {
  if (process.platform !== 'win32') return false
  const ps = `Remove-Item -LiteralPath '${p.replace(/'/g, "''")}' -Recurse -Force -ErrorAction SilentlyContinue`
  const result = spawnSync('powershell.exe', ['-NoProfile', '-Command', ps], {
    stdio: 'inherit',
  })
  return result.status === 0
}

function exists(p) {
  try {
    fs.accessSync(p)
    return true
  } catch {
    return false
  }
}

async function nuke(target) {
  const abs = path.resolve(process.cwd(), target)
  console.log(`Clean: 正在清理 ${abs} 目录...`)
  if (!exists(abs)) {
    console.log(`Clean: ${abs} 不存在，跳过`)
    return
  }

  try {
    await removeWithRimraf(abs)
    console.log(`Clean: ${abs} 已删除 (rimraf)`)
    return
  } catch (e) {
    console.warn(`Clean: rimraf 失败，尝试 fs.rm -> ${e?.code || e}`)
  }

  if (process.platform === 'win32') {
    if (removeWithCmd(abs) || removeWithPowershell(abs)) {
      console.log(`Clean: ${abs} 已删除 (system)`)
      return
    }
  }

  try {
    const tomb = `${abs}-${Date.now()}-trash`
    fs.renameSync(abs, tomb)
    await removeWithRimraf(tomb).catch(() => removeWithFs(tomb))
    console.log(`Clean: ${abs} 已通过重命名方式清理`)
  } catch (e) {
    console.error(
      `Clean: 仍然无法删除 ${abs}，请关闭占用该目录的程序（编辑器/资源管理器/杀软），或手动删除。错误: ${e?.code || e}`
    )
    process.exitCode = 1
  }
}

;(async () => {
  for (const t of targets) {
    try {
      await nuke(t)
    } catch (e) {
      console.error(`Clean: 清理 ${t} 失败: ${e?.code || e}`)
      process.exitCode = 1
    }
  }
})()
