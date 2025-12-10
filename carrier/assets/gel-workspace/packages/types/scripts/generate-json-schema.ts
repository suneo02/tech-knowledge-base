// scripts/generate-json-schema.ts
import { execSync } from 'child_process'
import { existsSync, mkdirSync } from 'fs'
import * as path from 'path'

const tsconfigPath = 'tsconfig.schema.json'
const typeDefPath = 'src/ConfigDetail/index.ts'

const outputDir = path.join(__dirname, '..', '..', 'detail-page-config', 'src', 'validation', 'schema')
if (!existsSync(outputDir)) {
  mkdirSync(outputDir)
}

const types = [
  'ReportHorizontalTableJson',
  'ReportVerticalTableJson',
  'ReportCrossTableJson',
  'ReportDetailCustomNodeJson',
]

for (const typeName of types) {
  const outputPath = path.join(outputDir, `${typeName}.schema.json`)
  const cmd = [
    'npx ts-json-schema-generator',
    `--tsconfig ${tsconfigPath}`,
    `--type ${typeName}`,
    `--path ${typeDefPath}`,
    '--expose all',
    '--jsDoc extended',
    `> ${outputPath}`,
  ].join(' ')

  console.log(`🛠 Generating schema for type: ${typeName}`)
  try {
    execSync(cmd, {
      stdio: 'inherit',
      shell: '/bin/bash',
      env: { ...process.env, TS_NODE_PROJECT: tsconfigPath },
    })
    console.log(`✅ Output: ${outputPath}`)
  } catch (err) {
    console.error(`❌ Failed to generate schema for ${typeName}`, err)
  }
}
