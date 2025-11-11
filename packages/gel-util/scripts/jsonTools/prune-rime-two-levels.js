import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 输入文件：src/config/industryTree/rimeTrackCn.json
const INPUT_PATH = path.resolve(__dirname, '../../src/config/industryTree/rimeTrackCn.json')
// 输出文件：与输入同目录，命名为 rimeTrackCn.2levels.json
const OUTPUT_PATH = path.resolve(__dirname, '../../src/config/industryTree/rimeTrackCn.2levels.json')

function readJson(file) {
  if (!fs.existsSync(file)) {
    throw new Error(`File not found: ${file}`)
  }
  const raw = fs.readFileSync(file, 'utf8')
  return JSON.parse(raw)
}

function pickFields(item) {
  // 仅保留 code, name, level, pcode（如果存在）；删除 node
  const { code, name, level, pcode } = item
  const picked = { code, name, level }
  if (pcode !== undefined) picked.pcode = pcode
  return picked
}

function pruneToTwoLevels(rootList) {
  // rootList: level=1 的数组
  return rootList.map((root) => {
    const prunedRoot = pickFields(root)
    const children = Array.isArray(root.node) ? root.node : []
    // 仅保留 level=2 的直接子项，并移除其 node
    const level2 = children
      .filter((child) => child && typeof child === 'object' && child.level === 2)
      .map((child) => pickFields(child))
    // 输出结构保留两层：根上保留一个 node 数组（已经去掉 deeper），若希望根也没有 node 则去掉下一行
    return { ...prunedRoot, node: level2 }
  })
}

function main() {
  const data = readJson(INPUT_PATH)
  if (!Array.isArray(data)) {
    throw new Error('Unexpected JSON structure: expect top-level array')
  }
  const result = pruneToTwoLevels(data)
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2), 'utf8')
  console.log(`Done. Wrote two-level JSON to: ${OUTPUT_PATH}`)
}

main()
