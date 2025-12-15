import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const INPUT_PATH = path.resolve(__dirname, '../../src/config/industryTree/rimeTrackCn.json')
const OUTPUT_PATH = path.resolve(__dirname, '../../src/config/industryTree/rimeTrackCn.2levels.flat.json')

function readJson(file) {
  if (!fs.existsSync(file)) throw new Error(`File not found: ${file}`)
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function pickFields(item) {
  const { code, name, level, pcode } = item
  const picked = { code, name, level }
  if (pcode !== undefined) picked.pcode = pcode
  return picked
}

function collectTwoLevelsFlat(list) {
  const result = []
  for (const root of list) {
    if (!root || typeof root !== 'object') continue
    if (root.level === 1) {
      result.push(pickFields(root))
      const children = Array.isArray(root.node) ? root.node : []
      for (const child of children) {
        if (child && typeof child === 'object' && child.level === 2) {
          result.push(pickFields(child))
        }
      }
    }
  }
  return result
}

function main() {
  const data = readJson(INPUT_PATH)
  if (!Array.isArray(data)) throw new Error('Unexpected JSON structure: expect top-level array')
  const flat = collectTwoLevelsFlat(data)
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(flat, null, 2), 'utf8')
  console.log(`Done. Wrote flat two-level JSON to: ${OUTPUT_PATH}`)
}

main()
