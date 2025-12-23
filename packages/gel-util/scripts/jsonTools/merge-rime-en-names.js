import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CN_INPUT = path.resolve(__dirname, '../../src/config/industryTree/rimeTrackCn.2levels.json')
const EN_SOURCE = path.resolve(__dirname, '../../src/config/industryTree/rimeTrackEn.json')
const OUTPUT = path.resolve(__dirname, '../../src/config/industryTree/rimeTrackCn.2levels.enriched.json')

function readJson(file) {
  if (!fs.existsSync(file)) throw new Error(`File not found: ${file}`)
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function buildCodeToNameMap(enData) {
  const map = new Map()
  const stack = Array.isArray(enData) ? [...enData] : []
  while (stack.length > 0) {
    const item = stack.pop()
    if (!item || typeof item !== 'object') continue
    if (item.code) {
      map.set(String(item.code), item.name)
    }
    if (Array.isArray(item.node) && item.node.length > 0) {
      stack.push(...item.node)
    }
  }
  return map
}

function enrichCnWithEnglish(cnData, codeToEnName) {
  return cnData.map((root) => {
    const rootCopy = { ...root }
    if (rootCopy.code) {
      const enName = codeToEnName.get(String(rootCopy.code))
      if (enName) rootCopy.nameEn = enName
    }
    if (Array.isArray(rootCopy.node)) {
      rootCopy.node = rootCopy.node.map((child) => {
        const childCopy = { ...child }
        if (childCopy.code) {
          const enName = codeToEnName.get(String(childCopy.code))
          if (enName) childCopy.nameEn = enName
        }
        return childCopy
      })
    }
    return rootCopy
  })
}

function main() {
  const cn = readJson(CN_INPUT)
  const en = readJson(EN_SOURCE)
  const codeToEn = buildCodeToNameMap(en)
  const result = enrichCnWithEnglish(cn, codeToEn)
  fs.writeFileSync(OUTPUT, JSON.stringify(result, null, 2), 'utf8')
  console.log(`Done. Wrote enriched JSON to: ${OUTPUT}`)
}

main()
