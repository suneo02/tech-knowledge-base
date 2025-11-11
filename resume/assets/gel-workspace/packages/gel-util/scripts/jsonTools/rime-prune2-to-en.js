import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CN_PATH = path.resolve(__dirname, '../../src/config/industryTree/rimeTrackCn.json')
const EN_PATH = path.resolve(__dirname, '../../src/config/industryTree/rimeTrackEn.json')

function readJson(file) {
  if (!fs.existsSync(file)) throw new Error(`File not found: ${file}`)
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function pick(item) {
  const { code, name, level, pcode } = item || {}
  const out = { code, name, level }
  if (pcode !== undefined) out.pcode = pcode
  return out
}

// 从完整树裁剪为两层（1层 + 其直接2层子节点），保留根节点的 node，子节点不再包含更深层 node
function pruneToTwoLevelsNested(list) {
  const result = []
  for (const root of list) {
    if (!root || typeof root !== 'object') continue
    if (root.level === 1) {
      const prunedRoot = pick(root)
      const children = Array.isArray(root.node) ? root.node : []
      const level2 = children
        .filter((child) => child && typeof child === 'object' && child.level === 2)
        .map((child) => pick(child))
      prunedRoot.node = level2
      result.push(prunedRoot)
    }
  }
  return result
}

// 从英文树构建 code->英文名 的映射（遍历所有层级）
function buildCodeToEnNameMap(enData) {
  const map = new Map()
  const stack = Array.isArray(enData) ? [...enData] : []
  while (stack.length > 0) {
    const item = stack.pop()
    if (!item || typeof item !== 'object') continue
    if (item.code && typeof item.name === 'string') {
      map.set(String(item.code), item.name)
    }
    if (Array.isArray(item.node) && item.node.length) stack.push(...item.node)
  }
  return map
}

function main() {
  const cnFull = readJson(CN_PATH)
  const enFull = readJson(EN_PATH)

  // 1) 覆盖 CN：两层嵌套（根含 node，子项无 node）
  const cnNested = pruneToTwoLevelsNested(cnFull)
  fs.writeFileSync(CN_PATH, JSON.stringify(cnNested, null, 2), 'utf8')
  console.log(`Overwrote CN two-level nested: ${CN_PATH}`)

  // 2) 覆盖 EN：基于 CN 两层结构，用 EN 的 code->英文名 映射替换 name
  const codeToEn = buildCodeToEnNameMap(enFull)
  const enNested = cnNested.map((root) => {
    const nameEnRoot = codeToEn.get(String(root.code))
    const outRoot = { ...root, name: nameEnRoot || root.name }
    if (Array.isArray(root.node)) {
      outRoot.node = root.node.map((child) => {
        const nameEnChild = codeToEn.get(String(child.code))
        return { ...child, name: nameEnChild || child.name }
      })
    }
    return outRoot
  })
  fs.writeFileSync(EN_PATH, JSON.stringify(enNested, null, 2), 'utf8')
  console.log(`Overwrote EN two-level nested: ${EN_PATH}`)
}

main()
