#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-require-imports */

const path = require('path')
const fs = require('fs')
const fse = require('fs-extra')
const { execSync, spawnSync } = require('child_process')

const ROOT = path.join(__dirname, '..')
const APPS_DIR = path.join(ROOT, 'apps')
const PACKAGES_DIR = path.join(ROOT, 'packages')
const DIST_ROOT = path.join(ROOT, 'dist')

const MAX_RETRY = 3

const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
}

// CLI flags
const ARGS = process.argv.slice(2)
const CONTINUE_ON_ERROR = ARGS.includes('--continue-on-error') || ARGS.includes('-c')

// 24-bit color helpers
function color24(r, g, b) {
  return `\x1b[38;2;${r};${g};${b}m`
}
function bgColor24(r, g, b) {
  return `\x1b[48;2;${r};${g};${b}m`
}
function hexToRgb(hex) {
  const h = hex.replace('#', '')
  const v =
    h.length === 3
      ? h.split('').map((c) => parseInt(c + c, 16))
      : [h.slice(0, 2), h.slice(2, 4), h.slice(4, 6)].map((c) => parseInt(c, 16))
  return [v[0], v[1], v[2]]
}
// 支持带位置的渐变停靠点：[{ color:[r,g,b], pos:0-1 }, ...]
function gradientText(text, stops) {
  if (!text) return ''
  if (!stops || stops.length === 0) return text
  const len = Math.max(1, text.length - 1)

  // 规范化停靠点
  const normalized = stops.map((s) => {
    if (Array.isArray(s)) return { color: s, pos: undefined }
    return s
  })
  const hasPos = normalized.every((s) => typeof s.pos === 'number')
  const totalSegments = normalized.length - 1

  let out = ''
  for (let i = 0; i < text.length; i += 1) {
    const t = len === 0 ? 0 : i / len

    let idx = 0
    let localT = 0
    if (hasPos) {
      // 根据位置选择左右停靠点
      let leftIndex = 0
      let rightIndex = normalized.length - 1
      for (let k = 0; k < normalized.length - 1; k += 1) {
        if (t >= normalized[k].pos && t <= normalized[k + 1].pos) {
          leftIndex = k
          rightIndex = k + 1
          break
        }
        if (t > normalized[k + 1].pos) {
          leftIndex = k + 1
        }
      }
      const p1 = normalized[leftIndex].pos
      const p2 = normalized[rightIndex].pos
      const denom = Math.max(1e-6, p2 - p1)
      idx = leftIndex
      localT = (t - p1) / denom
      localT = Math.max(0, Math.min(1, localT))
    } else {
      // 等距停靠点
      idx = Math.min(totalSegments - 1, Math.floor(t * totalSegments))
      const local = t * totalSegments - idx
      localT = local
    }

    const c1 = normalized[idx].color
    const c2 = normalized[Math.min(idx + 1, normalized.length - 1)].color
    const r = Math.round(c1[0] + (c2[0] - c1[0]) * localT)
    const g = Math.round(c1[1] + (c2[1] - c1[1]) * localT)
    const b = Math.round(c1[2] + (c2[2] - c1[2]) * localT)
    out += `${color24(r, g, b)}${text[i]}`
  }
  return `${out}${colors.reset}`
}

// 使用用户提供的 CSS 渐变：
// linear-gradient(45deg,#3862ed,#274cda 29%,#00aec7 62%,#12cbbe 76%,#9d9ae3)
function getPreferredStops() {
  return [
    { color: hexToRgb('#3862ed'), pos: 0.0 },
    { color: hexToRgb('#274cda'), pos: 0.29 },
    { color: hexToRgb('#00aec7'), pos: 0.62 },
    { color: hexToRgb('#12cbbe'), pos: 0.76 },
    { color: hexToRgb('#9d9ae3'), pos: 1.0 },
  ]
}

function banner(message) {
  const line = '━'.repeat(Math.max(20, message.length + 6))
  const stops = getPreferredStops()
  const top = gradientText(line, stops)
  const midText = `  ${message}  `
  const pad = Math.max(0, line.length - midText.length)
  const leftPad = Math.floor(pad / 2)
  const rightPad = pad - leftPad
  const body = ' '.repeat(leftPad) + midText + ' '.repeat(rightPad)
  const bodyColored = `${bgColor24(30, 30, 30)}${gradientText(body, stops)}${colors.reset}`
  return `\n${top}\n${bodyColored}\n${top}\n`
}

function log(msg, color = 'reset') {
  const c = colors[color] || colors.reset
  console.log(`${c}${msg}${colors.reset}`)
}

function run(cmd, options = {}) {
  log(`$ ${cmd}`, 'cyan')
  execSync(cmd, { stdio: 'inherit', cwd: options.cwd || ROOT, env: process.env })
}

function runSafe(cmd, options = {}) {
  log(`$ ${cmd}`, 'cyan')
  const res = spawnSync(cmd, { shell: true, cwd: options.cwd || ROOT, stdio: 'inherit', env: process.env })
  return res.status === 0
}

function listApps() {
  return fs
    .readdirSync(APPS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()
}

function listPackages() {
  if (!fs.existsSync(PACKAGES_DIR)) return []
  return fs
    .readdirSync(PACKAGES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()
}

function detectAppDistDir(appName) {
  // company 使用 build，其它默认 dist
  if (appName === 'company') return 'build'
  return 'dist'
}

function cleanPackagesDist() {
  if (!fs.existsSync(PACKAGES_DIR)) return
  const items = fs.readdirSync(PACKAGES_DIR, { withFileTypes: true })
  items.forEach((d) => {
    if (!d.isDirectory()) return
    const distPath = path.join(PACKAGES_DIR, d.name, 'dist')
    if (fs.existsSync(distPath)) {
      log(`清理: ${path.relative(ROOT, distPath)}`, 'yellow')
      fse.removeSync(distPath)
    }
  })
}

function ensureEmptyDistRoot() {
  if (fs.existsSync(DIST_ROOT)) {
    log(`清空目录: ${path.relative(ROOT, DIST_ROOT)}`, 'yellow')
    fse.emptyDirSync(DIST_ROOT)
  } else {
    fse.ensureDirSync(DIST_ROOT)
  }
}

async function promptSelectApps() {
  // 延迟加载 prompts，避免作为依赖不可用时报错
  let prompts
  try {
    prompts = require('prompts')
  } catch {
    log('缺少依赖 prompts，请先安装: pnpm add -D prompts', 'red')
    process.exit(1)
  }
  const apps = listApps()
  if (apps.length === 0) {
    log('未发现 apps/* 目录', 'red')
    process.exit(1)
  }
  const response = await prompts({
    type: 'multiselect',
    name: 'selected',
    message: '选择要构建的 apps (可多选)',
    choices: apps.map((name) => ({ title: name, value: name })),
    instructions: false,
    min: 1,
  })
  if (!response.selected || response.selected.length === 0) {
    log('未选择任何 app，已退出。', 'red')
    process.exit(1)
  }
  return response.selected
}

function buildPackagesBulkOnce() {
  // 使用 turbo 对所有 packages 批量构建一次（更快）
  return runSafe('pnpm run build:packages')
}

function packageHasDist(pkgName) {
  const distPath = path.join(PACKAGES_DIR, pkgName, 'dist')
  return fs.existsSync(distPath) && fs.readdirSync(distPath).length > 0
}

function buildSinglePackageWithRetry(pkgName) {
  let attempt = 0
  while (attempt < MAX_RETRY) {
    attempt += 1
    log(`构建 package: ${pkgName} (第 ${attempt} 次)`, 'green')
    const ok = runSafe('pnpm run build', { cwd: path.join(PACKAGES_DIR, pkgName) })
    if (ok) return true
    log(`package ${pkgName} 构建失败，准备重试...`, 'yellow')
  }
  return false
}

function buildPackagesSmart() {
  // 先批量构建一次
  const bulkOk = buildPackagesBulkOnce()
  if (bulkOk) return true

  // 批量失败：从第一个未产出 dist 的包开始，逐个按顺序构建
  const allPkgs = listPackages()
  if (allPkgs.length === 0) return true

  let startIndex = allPkgs.findIndex((name) => !packageHasDist(name))
  if (startIndex === -1) {
    // 所有包都有 dist，但批量报错（可能是并行日志导致失败标识），保险起见从头依次构建
    startIndex = 0
  }

  for (let i = startIndex; i < allPkgs.length; i += 1) {
    const name = allPkgs[i]
    const ok = buildSinglePackageWithRetry(name)
    if (!ok) {
      log(`package ${name} 多次构建失败，终止。`, 'red')
      return false
    }
  }

  return true
}

function copyAppArtifact(appName) {
  const distDirName = detectAppDistDir(appName)
  const appDist = path.join(APPS_DIR, appName, distDirName)
  const target = path.join(DIST_ROOT, appName)
  if (!fs.existsSync(appDist)) {
    log(`未找到构建产物: apps/${appName}/${distDirName}`, 'red')
    return
  }
  fse.ensureDirSync(target)
  fse.emptyDirSync(target)
  log(`拷贝产物到 dist/${appName}`, 'green')
  fse.copySync(appDist, target, { overwrite: true })
}

function createDistZip() {
  try {
    const zipPath = path.join(DIST_ROOT, 'dist.zip')
    if (fs.existsSync(zipPath)) {
      fse.removeSync(zipPath)
    }
    // 压缩 dist 目录内容为 dist.zip（不包含父目录）
    const ok = runSafe('zip -qr dist.zip .', { cwd: DIST_ROOT })
    return ok && fs.existsSync(zipPath)
  } catch {
    return false
  }
}

function summary(successApps, failedApps) {
  const stops = getPreferredStops()
  const title = `全部完成 ✅ 成功 ${successApps.length} 个 | 失败 ${failedApps.length} 个`
  let block = banner(title)
  if (successApps.length > 0) {
    const successLine = `成功: ${successApps.join(', ')}`
    block += `${gradientText(successLine, stops)}\n`
  }
  if (failedApps.length > 0) {
    const failText = failedApps.map((n) => `${colors.red}${n}${colors.reset}`).join(', ')
    block += `${colors.red}失败: ${failText}${colors.reset}\n`
  }
  return block
}

async function main() {
  // 1) 交互式多选 apps
  const selectedApps = await promptSelectApps()

  // 2) pnpm i（根目录一次即可）
  console.log(banner('安装依赖 PNPM I'))
  run('pnpm i')

  // 3) 清理所有 packages/*/dist
  console.log(banner('清理 packages/*/dist'))
  cleanPackagesDist()

  // 4) 构建 packages（仅一次；失败后从失败点起逐个构建，单包重试3次）
  console.log(banner('构建 WORKSPACE PACKAGES'))
  const ok = buildPackagesSmart()
  if (!ok) {
    log('构建 packages 失败，退出。', 'red')
    process.exit(1)
  }

  // 5) 逐个构建所选 apps（仅执行各自的 build）
  const successApps = []
  const failedApps = []
  for (const app of selectedApps) {
    console.log(banner(`开始构建 APP ▶ ${app}`))
    const appDir = path.join(APPS_DIR, app)
    const success = runSafe('pnpm run build', { cwd: appDir })
    if (!success) {
      failedApps.push(app)
      console.log(banner(`APP 构建失败 ✗ ${app}`))
      if (!CONTINUE_ON_ERROR) {
        process.exit(1)
      }
      continue
    }
    successApps.push(app)
    console.log(banner(`APP 构建完成 ✓ ${app}`))
  }

  // 6) 清空 dist 并按 app 拷贝产物（仅复制成功的）
  console.log(banner('整理产物到 dist'))
  ensureEmptyDistRoot()
  successApps.forEach(copyAppArtifact)

  // 6.5) 压缩输出 dist.zip
  console.log(banner('压缩 dist/dist.zip'))
  const zipped = createDistZip()
  if (!zipped) {
    log('生成 dist/dist.zip 失败', 'red')
    if (!CONTINUE_ON_ERROR) {
      process.exit(1)
    }
  }

  // 7) 汇总
  console.log(summary(successApps, failedApps))
  if (failedApps.length > 0 || !zipped) {
    // 继续执行模式下，设置非零退出码以便外层 CI 感知失败
    process.exitCode = 1
  }
}

main().catch((err) => {
  log(String(err?.stack || err), 'red')
  process.exit(1)
})
