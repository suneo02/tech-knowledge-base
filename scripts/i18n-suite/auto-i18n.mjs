import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'

// --- 1. Load Global Locales (Source of Truth) ---

export function loadGlobalLocales(globalLocalesDir) {
  console.log('Loading global locales...')
  const cnMap = {}
  const enMap = {}
  const textToIdMap = {}
  const allIds = new Set()

  const cnFiles = fs.readdirSync(globalLocalesDir).filter((f) => f.startsWith('iml_cn_') && f.endsWith('.json'))
  const enFiles = fs.readdirSync(globalLocalesDir).filter((f) => f.startsWith('iml_en_') && f.endsWith('.json'))

  cnFiles.forEach((f) => {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(globalLocalesDir, f), 'utf-8'))
      Object.assign(cnMap, data)
      Object.keys(data).forEach((id) => allIds.add(id))
      Object.entries(data).forEach(([id, text]) => {
        const normalizedText = text.trim()
        if (!textToIdMap[normalizedText]) {
          textToIdMap[normalizedText] = id
        }
      })
    } catch (e) {
      console.error(`Error reading ${f}:`, e)
    }
  })

  enFiles.forEach((f) => {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(globalLocalesDir, f), 'utf-8'))
      Object.assign(enMap, data)
      Object.keys(data).forEach((id) => allIds.add(id))
    } catch (e) {
      console.error(`Error reading ${f}:`, e)
    }
  })

  console.log(`Loaded ${Object.keys(cnMap).length} CN keys and ${Object.keys(enMap).length} EN keys.`)
  return { cnMap, enMap, textToIdMap, allIds }
}

// --- Helpers ---

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

function getFiles(dir, extList = ['.ts', '.tsx', '.js', '.jsx']) {
  let results = []
  if (!fs.existsSync(dir)) return results
  const list = fs.readdirSync(dir)
  list.forEach((file) => {
    if (['node_modules', '.git', 'dist', 'build', '.trae', '.cursor'].includes(file)) return
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(filePath, extList))
    } else {
      if (extList.includes(path.extname(file))) {
        results.push(filePath)
      }
    }
  })
  return results
}

function saveJson(filePath, data) {
  const sortedData = Object.keys(data)
    .sort()
    .reduce((obj, key) => {
      obj[key] = data[key]
      return obj
    }, {})
  fs.writeFileSync(filePath, JSON.stringify(sortedData, null, 2) + '\n', 'utf-8')
}

// Format link for report (copied from global-index.mjs logic)
const formatLink = (rootDir, rel, line) => {
  const abs = path.join(rootDir, rel)
  const url = `http://localhost:4789/open?path=${encodeURIComponent(abs)}&line=${line}`
  const safeUrl = url.replace(/"/g, '&quot;')
  const copyJs = `navigator.clipboard && navigator.clipboard.writeText('${abs.replace(/"/g, '\\"')}')`
  return `<span><a href="#" onclick="(function(){var i=new Image();i.src='${safeUrl}';})();return false;">${rel}:${line}</a> <a href="#" onclick="${copyJs};return false;" style="color:#64748b;margin-left:6px;">复制</a></span>`
}

// --- Core Logic ---

export function processProject(options, globalData) {
  const { targetDir, localesOutputDir, namespace } = options
  const { cnMap, enMap, textToIdMap } = globalData
  const rootDir = process.cwd()

  console.log(`\n--- Processing Project: ${namespace} ---`)

  // Enforce src directory
  let effectiveTargetDir = targetDir
  if (!targetDir.endsWith('/src') && !targetDir.endsWith('\\src') && fs.existsSync(path.join(targetDir, 'src'))) {
    effectiveTargetDir = path.join(targetDir, 'src')
  }
  console.log(`Target: ${effectiveTargetDir}`)

  // Track usage for report and locale generation
  const validIdsUsed = new Set()
  const reportData = {
    matched: [],
    unmatched: [],
  }

  // 1. Scan and Fix Code
  let files = getFiles(effectiveTargetDir)

  // Filter out "no intl" files
  files = files.filter((file) => {
    const content = fs.readFileSync(file, 'utf-8')
    const firstLines = content.split('\n').slice(0, 5).join('\n')
    return !/no\s*intl/i.test(firstLines)
  })

  let modifiedCount = 0

  files.forEach((file) => {
    let content = fs.readFileSync(file, 'utf-8')
    const originalContent = content

    // Check for "intl done" to skip modification
    const firstLines = content.split('\n').slice(0, 5).join('\n')
    const isLocked = /\/\/\s*intl\s*done/i.test(firstLines)

    // Helper to resolve ID
    const resolveId = (id, text) => {
      const trimmedText = text ? text.trim() : ''
      let pureId = id
      if (id && id.includes(':')) {
        pureId = id.split(':')[1]
      }

      // 1. If ID exists in global map, it is valid.
      if (pureId && (cnMap[pureId] || enMap[pureId])) {
        // Double check: if text is provided, does it match?
        // We prioritize ID validity. If ID is valid, we trust it.
        // But if the text is wildly different, it might be a copy-paste error.
        // For now, we assume valid ID = valid.
        validIdsUsed.add(pureId)
        return pureId
      }

      // 2. ID invalid or missing. Look up by Text.
      if (trimmedText && textToIdMap[trimmedText]) {
        const foundId = textToIdMap[trimmedText]
        validIdsUsed.add(foundId)
        return foundId
      }

      // 3. Not found.
      return ''
    }

    // --- Regex Replacements ---

    if (isLocked) {
      // If locked, we only scan for valid IDs to ensure they are included in the locale files
      // We do NOT modify the content.
      // We scan for t('id'...) regardless of whether it has a second argument or not.
      const scanPattern = /\bt\(\s*(['"])([^'"]+)\1/g
      let match
      while ((match = scanPattern.exec(content)) !== null) {
        let id = match[2]
        if (id && id.includes(':')) id = id.split(':')[1]

        // Only register if ID is explicitly present and valid
        if (id && (cnMap[id] || enMap[id])) {
          validIdsUsed.add(id)
        }
      }
      return
    }

    // A. Standard t('id', 'text') or t('ns:id', 'text')
    const tPattern = /\bt\(\s*(['"])(.*?)\1\s*,\s*(['"])(.*?)\3\s*\)/g
    content = content.replace(tPattern, (match, q1, id, q2, text) => {
      const resolvedId = resolveId(id, text)
      if (resolvedId) {
        return `t(${q1}${namespace}:${resolvedId}${q1}, ${q2}${text}${q2})`
      } else {
        return `t(${q1}${q1}, ${q2}${text}${q2})`
      }
    })

    // B. JSX Attributes: prop="中文"
    // Note: We only match if it contains Chinese to avoid false positives on non-i18n strings
    const jsxAttrPattern = /(\w+)\s*=\s*(['"])(.*?[\u4e00-\u9fa5]+.*?)\2/g
    content = content.replace(jsxAttrPattern, (match, prop, quote, text) => {
      if (text.includes('t(')) return match // Already wrapped
      if (text.includes('${')) return match // Template literal

      const resolvedId = resolveId(null, text)
      if (resolvedId) {
        return `${prop}={t('${namespace}:${resolvedId}', '${text}')}`
      } else {
        return `${prop}={t('', '${text}')}`
      }
    })

    // C. JSX Text: >中文<
    const jsxTextPattern = /(\{\/\*[\s\S]*?\*\/\})|((?<!=)\s*>([^<]*[\u4e00-\u9fa5]+[^<]*)<\/)/g
    content = content.replace(jsxTextPattern, (match, jsxComment, fullTag, text) => {
      if (jsxComment) return match
      if (text.includes('t(')) return match
      if (text.includes('{/*')) return match
      if (!text.trim()) return match
      if (text.trim().startsWith('{') && text.trim().endsWith('}')) return match

      const resolvedId = resolveId(null, text)
      if (resolvedId) {
        return `>{t('${namespace}:${resolvedId}', '${text}')}</`
      } else {
        return `>{t('', '${text}')}</`
      }
    })

    // D. JS Strings (careful with this one)
    // Matches: t(...) OR Comments OR Strings with Chinese
    const combinedJsPattern =
      /(\bt\(\s*['"`].*?['"`]\s*,\s*['"`].*?['"`]\s*\))|(\/\/[^\n]*)|(\/\*[\s\S]*?\*\/)|((['"`])((?:(?!\5)[^\\\n]|\\.)*?[\u4e00-\u9fa5]+(?:(?!\5)[^\\\n]|\\.)*?)\5)/g

    content = content.replace(
      combinedJsPattern,
      (match, tCall, singleComment, multiComment, stringLiteral, quote, stringContent) => {
        if (tCall || singleComment || multiComment) return match
        if (match.includes('console.log') || match.includes('console.error') || match.includes('console.warn'))
          return match
        if (stringContent.includes('${')) return match

        const resolvedId = resolveId(null, stringContent)
        if (resolvedId) {
          return `t('${namespace}:${resolvedId}', '${stringContent}')`
        } else {
          return `t('', '${stringContent}')`
        }
      }
    )

    if (content !== originalContent) {
      fs.writeFileSync(file, content, 'utf-8')
      modifiedCount++
    }
  })

  console.log(`Modified ${modifiedCount} files.`)

  // 2. Generate Locales (Based on Valid IDs Found)
  console.log('--- Syncing Locale Files ---')
  const localCn = {}
  const localEn = {}

  console.log(`Debug: Valid IDs count: ${validIdsUsed.size}`)
  if (validIdsUsed.size > 0) {
    const sampleId = Array.from(validIdsUsed)[0]
    console.log(`Debug: Sample ID: ${sampleId}, In CN: ${!!cnMap[sampleId]}, In EN: ${!!enMap[sampleId]}`)
  }

  validIdsUsed.forEach((id) => {
    if (cnMap[id]) localCn[id] = cnMap[id]
    if (enMap[id]) localEn[id] = enMap[id]
    else if (cnMap[id]) localEn[id] = cnMap[id] // Fallback to CN
  })

  if (!fs.existsSync(localesOutputDir)) {
    fs.mkdirSync(localesOutputDir, { recursive: true })
  }

  saveJson(path.join(localesOutputDir, `${namespace}.cn.json`), localCn)
  saveJson(path.join(localesOutputDir, `${namespace}.en.json`), localEn)
  console.log(`Saved locales to ${localesOutputDir}`)
  console.log(`Total valid IDs: ${validIdsUsed.size}`)

  // 3. Prepare Report Data
  // We need to re-scan or use our knowledge to find "Missing" items.
  // Since we just fixed the code, "Missing" means items that are in the code but don't have a valid Global ID (i.e., t('', 'text')).

  const suggestionIndex = buildSuggestionIndex(cnMap)

  // Let's do a quick pass to find items with empty IDs to report them as "Missing Both" (or similar)
  // And check valid IDs for missing translations.

  files.forEach((file) => {
    const content = fs.readFileSync(file, 'utf-8')
    const lines = content.split('\n')
    const relPath = path.relative(rootDir, file)

    // Regex to find t('namespace:id', 'text') OR t('', 'text')
    const reportPattern = /\bt\(\s*(['"])(.*?)\1\s*,\s*(['"])(.*?)\3\s*\)/g

    lines.forEach((line, index) => {
      let match
      // Reset lastIndex for each line if using global regex, but here we create new regex or match string
      while ((match = reportPattern.exec(line)) !== null) {
        const idFull = match[2]
        const text = match[4]
        const lineNum = index + 1

        let id = idFull
        if (idFull.includes(':')) id = idFull.split(':')[1]

        if (!id) {
          // Empty ID -> Unmatched (Local text only)
          // We construct a unique key for the report
          const reportKey = `UNTRANSLATED:${text.substring(0, 20)}`

          // Check if we already have this entry to append ref
          let entry = reportData.unmatched.find((e) => e.id === reportKey)
          if (!entry) {
            const normalized = normalizeTxt(text)
            let suggest = ''
            if (normalized && suggestionIndex[normalized] && suggestionIndex[normalized].length) {
              suggest = `${suggestionIndex[normalized][0].id} / ${suggestionIndex[normalized][0].text}`
            }

            entry = {
              id: reportKey,
              text: text,
              type: 'unmatched',
              suggest,
              refs: [],
            }
            reportData.unmatched.push(entry)
          }
          entry.refs.push({ file: relPath, line: lineNum })
        } else {
          // Valid ID -> Matched
          let entry = reportData.matched.find((e) => e.id === id)
          if (!entry) {
            entry = {
              id,
              text: cnMap[id] || enMap[id] || text,
              type: 'matched',
              refs: [],
            }
            reportData.matched.push(entry)
          }
          entry.refs.push({ file: relPath, line: lineNum })
        }
      }
    })
  })

  // Format refs for HTML
  const formatRefs = (list) => {
    return list.map((item) => {
      const refsHtml = item.refs
        .slice(0, 3)
        .map((r) => formatLink(rootDir, r.file, r.line))
        .join('<br>')
      return { ...item, refs: refsHtml }
    })
  }

  return {
    name: namespace,
    summary: {
      total: reportData.matched.length + reportData.unmatched.length,
      used: validIdsUsed.size,
      matched: reportData.matched.length,
      unmatched: reportData.unmatched.length,
    },
    data: {
      matched: formatRefs(reportData.matched),
      unmatched: formatRefs(reportData.unmatched),
    },
  }
}

export function generateReport(allData, globalSummary, reportPath) {
  const templatePath = path.join(process.cwd(), 'scripts/i18n-suite/global-template.html')

  if (!fs.existsSync(templatePath)) {
    console.error(`Template not found at ${templatePath}`)
    return
  }

  let html = fs.readFileSync(templatePath, 'utf-8')

  html = html.replace('__ALL_DATA__', JSON.stringify(allData))
  html = html.replace('__GLOBAL_SUMMARY__', JSON.stringify(globalSummary))
  html = html.replace('__IS_SINGLE__', allData.length === 1 ? 'true' : 'false')

  fs.writeFileSync(reportPath, html, 'utf-8')
  console.log(`Report saved to ${reportPath}`)

  // Attempt to start server for "Open in Editor" functionality
  try {
    const child = spawn('node', ['scripts/i18n-suite/global-server.mjs'], { detached: true, stdio: 'ignore' })
    child.unref()
    console.log('Started background i18n server.')
  } catch {
    console.log('Could not start i18n server automatically.')
  }
}

// --- CLI Entry Point ---

function parseArgs(args) {
  const config = {}
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2)
      const value = args[i + 1]
      if (value && !value.startsWith('--')) {
        config[key] = value
        i++
      } else {
        config[key] = true
      }
    }
  }
  return config
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const ARGS = process.argv.slice(2)
  const config = parseArgs(ARGS)

  if (!config.target || !config.locales || !config.namespace) {
    console.error('Usage: node auto-i18n.mjs --target <dir> --locales <dir> --namespace <ns>')
    process.exit(1)
  }

  const ROOT_DIR = process.cwd()
  const TARGET_DIR = path.resolve(ROOT_DIR, config.target)
  const LOCALES_OUTPUT_DIR = path.resolve(ROOT_DIR, config.locales)
  const GLOBAL_LOCALES_DIR = path.resolve(ROOT_DIR, 'packages/gel-util/src/intl/locales')
  const NAMESPACE = config.namespace

  const globalData = loadGlobalLocales(GLOBAL_LOCALES_DIR)
  const appData = processProject(
    {
      targetDir: TARGET_DIR,
      localesOutputDir: LOCALES_OUTPUT_DIR,
      namespace: NAMESPACE,
    },
    globalData
  )

  const summary = {
    total: appData.summary.total,
    matched: appData.summary.matched,
    unmatched: appData.summary.unmatched,
  }

  const reportPath = path.join(ROOT_DIR, 'i18n-report.html')
  generateReport([appData], summary, reportPath)
}
