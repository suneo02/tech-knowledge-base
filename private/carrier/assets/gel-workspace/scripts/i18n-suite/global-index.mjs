import fs from 'fs'
import path from 'path'
import { execSync, spawn } from 'child_process'

const rootDir = process.cwd()
const appsDir = path.join(rootDir, 'apps')
const localesDir = path.join(rootDir, 'packages/gel-util/src/intl/locales')
const tplPath = path.join(rootDir, 'scripts/i18n-suite/global-template.html')

const readJSON = (p) => JSON.parse(fs.readFileSync(p, 'utf-8'))
const loadLocales = () => {
  const cnFiles = fs.readdirSync(localesDir).filter((f) => f.startsWith('iml_cn_'))
  const enFiles = fs.readdirSync(localesDir).filter((f) => f.startsWith('iml_en_'))
  const cn = {}
  const en = {}
  for (const f of cnFiles) Object.assign(cn, readJSON(path.join(localesDir, f)))
  for (const f of enFiles) Object.assign(en, readJSON(path.join(localesDir, f)))
  return { cn, en }
}

const normalizeTxt = (s) => (s || '').replace(/[\s\p{P}\p{S}]/gu, '')
const buildSuggestionIndex = (cn) => {
  const idx = {}
  for (const [id, text] of Object.entries(cn)) {
    const key = normalizeTxt(text)
    if (!key) continue
    if (!idx[key]) idx[key] = []
    idx[key].push({ id, text })
  }
  return idx
}

const collectDefaults = (srcDir) => {
  const map = {}
  const add = (id, text) => {
    if (id && text && !map[id]) map[id] = text
  }
  const rxT = /\bt\(\s*(?:['"`]([^'"`]*)['"`]|(\d+))\s*,\s*(['"`])([\s\S]*?)\3\s*\)/g
  const rxI = /\bintl\(\s*(?:['"`]([^'"`]*)['"`]|(\d+))\s*,\s*(['"`])([\s\S]*?)\3\s*\)/g
  const walk = (dir) => {
    for (const f of fs.readdirSync(dir)) {
      const p = path.join(dir, f)
      const stat = fs.statSync(p)
      if (stat.isDirectory()) walk(p)
      else if (/\.(js|jsx|ts|tsx)$/.test(f)) {
        const c = fs.readFileSync(p, 'utf-8')
        const firstLines = c.split('\n').slice(0, 5).join('\n')
        if (/no\s*intl/i.test(firstLines)) continue
        let m
        while ((m = rxT.exec(c)) !== null) add(String(m[1] || m[2] || ''), m[4])
        while ((m = rxI.exec(c)) !== null) add(String(m[1] || m[2] || ''), m[4])
      }
    }
  }
  walk(srcDir)
  return map
}

const formatLink = (rel, line) => {
  const abs = path.join(rootDir, rel)
  const url = `http://localhost:4789/open?path=${encodeURIComponent(abs)}&line=${line}`
  const safeUrl = url.replace(/"/g, '&quot;')
  const copyJs = `navigator.clipboard && navigator.clipboard.writeText('${abs.replace(/"/g, '\\"')}')`
  return `<span><a href="#" onclick="(function(){var i=new Image();i.src='${safeUrl}';})();return false;">${rel}:${line}</a> <a href="#" onclick="${copyJs};return false;" style="color:#64748b;margin-left:6px;">复制</a></span>`
}

const scanApp = (appName, cn, en) => {
  const appRoot = path.join(appsDir, appName)
  const srcDir = path.join(appRoot, 'src')
  if (!fs.existsSync(srcDir)) return null

  const ids = new Set()
  const occs = {}
  const addOcc = (id, fileRel, line) => {
    if (!occs[id]) occs[id] = []
    occs[id].push({ file: fileRel, line })
  }
  const patterns = [
    { regex: /\bt\(\s*(?:['"`]([^'"`]*)['"`]|(\d+))(?:\s*,\s*(['"`])([\s\S]*?)\3)?/ },
    { regex: /\bintl\(\s*(?:['"`]([^'"`]*)['"`]|(\d+))(?:\s*,\s*(['"`])([\s\S]*?)\3)?/ },
    { regex: /\bwindow\.intl\(\s*(?:['"`]([^'"`]*)['"`]|(\d+))(?:\s*,\s*(['"`])([\s\S]*?)\3)?/ },
    { regex: /\bintlCode\s*:\s*['"`]([^'"`]*)['"`]/ },
  ]
  const untranslatedDefaults = {}
  const walk = (dir) => {
    for (const f of fs.readdirSync(dir)) {
      const p = path.join(dir, f)
      const stat = fs.statSync(p)
      if (stat.isDirectory()) walk(p)
      else if (/\.(js|jsx|ts|tsx)$/.test(f)) {
        const content = fs.readFileSync(p, 'utf-8')
        // Check for no intl
        const firstLines = content.split('\n').slice(0, 5).join('\n')
        if (/no\s*intl/i.test(firstLines)) continue

        const lines = content.split(/\r?\n/)
        const rel = path.relative(rootDir, p)
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i]
          for (const pat of patterns) {
            const m = pat.regex.exec(line)
            if (m) {
              let id = String(m[1] || m[2] || '')
              const text = m[4]
              if (id && /^\d+$/.test(id)) {
                // If ID is valid (numeric), check if it exists in global maps
                const inCN = Object.prototype.hasOwnProperty.call(cn, id)
                const inEN = Object.prototype.hasOwnProperty.call(en, id)
                if (inCN || inEN) {
                  ids.add(id)
                  addOcc(id, rel, i + 1)
                } else {
                  // Valid format but not found -> treat as Unmatched or Matched but invalid?
                  // Let's treat as Unmatched if not found in ANY locale, or maybe Matched (since it has ID) but potentially missing?
                  // To align with auto-i18n:
                  // Matched = ID exists in map.
                  // Unmatched = ID empty or ID not in map.
                  // Actually auto-i18n: "If ID exists in global map, it is valid... return pureId" -> Matched.
                  // If not found -> returns '' -> Unmatched.
                  // So if ID not in CN/EN, it's Unmatched.
                  const reportKey = `INVALID_ID:${id}`
                  ids.add(reportKey)
                  addOcc(reportKey, rel, i + 1)
                  untranslatedDefaults[reportKey] = text || ''
                }
              } else if (text) {
                id = `UNTRANSLATED:${text.slice(0, 50)}`
                ids.add(id)
                addOcc(id, rel, i + 1)
                untranslatedDefaults[id] = text
              }
            }
          }
        }
      }
    }
  }
  walk(srcDir)
  const matched = []
  const unmatched = []

  for (const id of ids) {
    if (id.startsWith('UNTRANSLATED:') || id.startsWith('INVALID_ID:')) {
      unmatched.push({ id, refs: occs[id] || [] })
    } else {
      matched.push({ id, refs: occs[id] || [] })
    }
  }

  const summary = {
    total: ids.size,
    matched: matched.length,
    unmatched: unmatched.length,
  }

  const defaults = collectDefaults(srcDir)
  Object.assign(defaults, untranslatedDefaults)
  const cnIdx = buildSuggestionIndex(cn)

  const decorate = (row, type) => {
    const def = defaults[row.id] || ''
    const key = normalizeTxt(def)
    let suggest = ''
    if (key && cnIdx[key] && cnIdx[key].length) suggest = `${cnIdx[key][0].id} / ${cnIdx[key][0].text}`

    // For matched items, we don't necessarily need suggestions, but maybe for invalid ones we do.
    // Matched items (valid ID) usually don't need 'suggest' unless we want to show alternative text.
    // Let's keep logic consistent.

    const refsHtml = (row.refs || [])
      .slice(0, 3)
      .map((r) => formatLink(r.file, r.line))
      .join('<br>')
    return {
      id: row.id,
      text: def || cn[row.id] || en[row.id] || '', // Use default text or map text
      type,
      suggest,
      refs: refsHtml,
    }
  }

  const data = {
    matched: matched.map((r) => decorate(r, 'matched')),
    unmatched: unmatched.map((r) => decorate(r, 'unmatched')),
  }

  return {
    name: appName,
    summary,
    data,
  }
}

// normalize IDs in a single app based on default Chinese text
const normalizeApp = (appName, cn, en) => {
  const appRoot = path.join(appsDir, appName)
  const srcDir = path.join(appRoot, 'src')
  if (!fs.existsSync(srcDir)) return { changedFiles: 0 }
  const existsId = (id) => Object.prototype.hasOwnProperty.call(cn, id) || Object.prototype.hasOwnProperty.call(en, id)
  const cnTextIndex = {}
  for (const [id, text] of Object.entries(cn)) {
    if (!cnTextIndex[text]) cnTextIndex[text] = []
    cnTextIndex[text].push(id)
  }
  let changedFiles = 0
  const files = []
  const walk = (dir) => {
    for (const f of fs.readdirSync(dir)) {
      const p = path.join(dir, f)
      const stat = fs.statSync(p)
      if (stat.isDirectory()) walk(p)
      else if (/\.(js|jsx|ts|tsx)$/.test(f)) files.push(p)
    }
  }
  walk(srcDir)
  const reCall = (callName) =>
    new RegExp(
      '\\b' + callName + '\\(\\s*(?:([\'"`])([^\'"`]*)\\1|(\\d+))\\s*,\\s*([\'"`])([\\s\\S]*?)\\4([\\s\\S]*?\\))',
      'g'
    )
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8')
    const before = content
    const replacer = (match, qId, sId, nId, qTxt, sTxt) => {
      const originalId = sId || nId || ''
      let id = originalId
      // User requirement: non-numeric keys are invalid and should be treated as empty
      if (!/^\d+$/.test(id)) id = ''

      const txt = sTxt || ''
      if (existsId(id)) return match
      const candidates = cnTextIndex[txt]

      let newId = ''
      if (candidates && candidates.length) {
        newId = candidates[0]
      }

      if (!newId) {
        // If no replacement found
        if (/^\d+$/.test(originalId)) return match // Keep valid numeric IDs even if missing
        // If original was invalid (non-numeric), replace with empty
        newId = ''
      }

      const idOut = qId ? `${qId}${newId}${qId}` : `${newId}`
      return `${match.replace(`${qId || ''}${originalId}${qId || ''}`, idOut)}`
    }
    content = content.replace(reCall('t'), replacer)
    content = content.replace(reCall('intl'), replacer)
    if (content !== before) {
      fs.writeFileSync(file, content, 'utf-8')
      changedFiles++
    }
  }
  return { changedFiles }
}

const main = () => {
  const { cn, en } = loadLocales()
  const apps = fs.readdirSync(appsDir).filter((d) => fs.statSync(path.join(appsDir, d)).isDirectory())
  const argv = process.argv.slice(2)
  let filterApp = null
  const idxApp = argv.indexOf('--app')
  if (idxApp !== -1 && argv[idxApp + 1]) filterApp = argv[idxApp + 1]
  if (!filterApp && argv.length === 1 && argv[0] !== '--app') filterApp = argv[0]
  const all = []
  const targetApps = filterApp ? apps.filter((a) => a === filterApp) : apps
  for (const a of targetApps) {
    normalizeApp(a, cn, en)
    const res = scanApp(a, cn, en)
    if (res) all.push(res)
  }
  const globalSummary = all.reduce(
    (acc, a) => {
      acc.used += a.summary.used
      acc.present += a.summary.present
      acc.missingEN += a.summary.missingEN
      acc.missingCN += a.summary.missingCN
      acc.missingBoth += a.summary.missingBoth
      acc.replace += a.summary.replace || 0
      return acc
    },
    { used: 0, present: 0, missingEN: 0, missingCN: 0, missingBoth: 0, replace: 0 }
  )
  let tpl = fs.readFileSync(tplPath, 'utf-8')
  tpl = tpl.replace('__ALL_DATA__', JSON.stringify(all))
  tpl = tpl.replace('__GLOBAL_SUMMARY__', JSON.stringify(globalSummary))
  tpl = tpl.replace('__IS_SINGLE__', JSON.stringify(targetApps.length === 1))
  const out = path.join(rootDir, filterApp ? `i18n-reports-${filterApp}.html` : 'i18n-reports.html')
  fs.writeFileSync(out, tpl, 'utf-8')
  try {
    const child = spawn('node', ['scripts/i18n-suite/global-server.mjs'], { detached: true, stdio: 'ignore' })
    child.unref()
  } catch {
    /* ignore */
  }
  try {
    execSync(`open ${out}`, { stdio: 'inherit' })
  } catch {
    console.log('Open report:', out)
  }
}

main()
