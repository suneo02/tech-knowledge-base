import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const LOCALES_DIR = path.resolve(__dirname, '../../src/intl/locales')
const FILES = [
  { name: 'iml_cn.json', prefix: 'iml_cn' },
  { name: 'iml_en.json', prefix: 'iml_en' },
]
const CHUNK_SIZE = 2000

FILES.forEach(({ name, prefix }) => {
  const filePath = path.join(LOCALES_DIR, name)
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`)
    return
  }
  const raw = fs.readFileSync(filePath, 'utf8')
  const obj = JSON.parse(raw)
  const keys = Object.keys(obj)
  const total = keys.length
  const chunkCount = Math.ceil(total / CHUNK_SIZE)
  console.log(`Splitting ${name}: ${total} entries, ${chunkCount} files...`)
  for (let i = 0; i < chunkCount; i++) {
    const chunkObj = {}
    const start = i * CHUNK_SIZE
    const end = Math.min(start + CHUNK_SIZE, total)
    for (let j = start; j < end; j++) {
      chunkObj[keys[j]] = obj[keys[j]]
    }
    const outName = `${prefix}_${i + 1}.json`
    const outPath = path.join(LOCALES_DIR, outName)
    fs.writeFileSync(outPath, JSON.stringify(chunkObj, null, 2), 'utf8')
    console.log(`  -> ${outName} (${end - start} entries)`)
  }
})

console.log('Done.')
