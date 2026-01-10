import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { glob } from 'glob'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const windHeaderPath = path.resolve(__dirname, '../src/common/WindHeader')
const localesPath = path.resolve(__dirname, '../locales')
const outputPath = path.resolve(__dirname, '../../gel-util/src/locales/namespaces/windHeader')

const tFunctionRegex = /t\((['"`])(windHeader:(\d+)|[^'"`]+)\1[^)]*\)/g
const titleIntlRegex = /['"`]windHeader:(\d+)['"`]/g
const userMenuIdRegex = /id: (\d+)/g

async function findI18nKeys() {
  const keys = new Set()

  // Find keys in .ts and .tsx files
  const tsFiles = await glob(`${windHeaderPath}/**/*.{ts,tsx}`)
  for (const file of tsFiles) {
    const content = await fs.readFile(file, 'utf-8')
    let match
    while ((match = tFunctionRegex.exec(content)) !== null) {
      if (match[3]) {
        keys.add(match[3])
      }
    }
    while ((match = titleIntlRegex.exec(content)) !== null) {
      keys.add(match[1])
    }
    if (file.endsWith('userMenus.ts')) {
      while ((match = userMenuIdRegex.exec(content)) !== null) {
        keys.add(match[1])
      }
    }
  }

  // Find keys in .json files
  const jsonFiles = await glob(`${windHeaderPath}/**/*.json`)
  for (const file of jsonFiles) {
    const content = await fs.readFile(file, 'utf-8')
    const json = JSON.parse(content)
    if (Array.isArray(json)) {
      json.forEach((item) => {
        if (item.titleIntl) {
          keys.add(item.titleIntl)
        }
      })
    }
  }

  const allKeys = [...keys].filter(Boolean)
  console.log('Found i18n keys:', allKeys)
  return allKeys
}

async function generateLocaleFiles() {
  const i18nKeys = await findI18nKeys()
  await fs.mkdir(outputPath, { recursive: true })
  const localeFiles = await fs.readdir(localesPath)
  for (const file of localeFiles) {
    const mainLocalePath = path.join(localesPath, file)
    const mainLocaleContent = await fs.readFile(mainLocalePath, 'utf-8')
    const mainLocaleJson = JSON.parse(mainLocaleContent)

    const newLocaleJson = {}
    for (const key of i18nKeys) {
      if (mainLocaleJson[key]) {
        newLocaleJson[key] = mainLocaleJson[key]
      }
    }

    const newFileName = `windHeader.${file.split('_')[1]}`
    const outputFilePath = path.join(outputPath, newFileName)
    await fs.writeFile(outputFilePath, JSON.stringify(newLocaleJson, null, 2))
    console.log(`Generated ${newFileName}`)
  }
}

generateLocaleFiles().catch(console.error)
