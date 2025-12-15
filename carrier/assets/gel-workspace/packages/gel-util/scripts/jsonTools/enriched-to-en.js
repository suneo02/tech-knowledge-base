import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const INPUT = path.resolve(__dirname, '../../src/config/industryTree/rimeTrackCn.2levels.enriched.json')
const OUTPUT = path.resolve(__dirname, '../../src/config/industryTree/rimeTrackEn.2levels.json')

function readJson(file) {
  if (!fs.existsSync(file)) throw new Error(`File not found: ${file}`)
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function toEnglishName(item) {
  const { nameEn, ...rest } = item || {}
  const name = nameEn ? nameEn : item.name
  const out = { ...rest, name }
  // 处理子项
  if (Array.isArray(item.node)) {
    out.node = item.node.map((c) => toEnglishName(c))
  }
  return out
}

function main() {
  const data = readJson(INPUT)
  if (!Array.isArray(data)) throw new Error('Unexpected JSON structure: expect top-level array')
  const result = data.map((root) => toEnglishName(root))
  fs.writeFileSync(OUTPUT, JSON.stringify(result, null, 2), 'utf8')
  console.log(`Done. Wrote English JSON to: ${OUTPUT}`)
}

main()
