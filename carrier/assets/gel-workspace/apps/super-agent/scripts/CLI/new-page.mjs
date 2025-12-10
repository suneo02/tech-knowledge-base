#!/usr/bin/env node
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function toPascalCase(input) {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[\s_-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    .join('')
}

function toKebabCase(input) {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

function parseArgs(argv) {
  const args = { full: false }
  const rest = []
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i]
    if (a === '--full') args.full = true
    else if (a === '--no-full') args.full = false
    else if (a.startsWith('--')) {
      const [k, v] = a.replace(/^--/, '').split('=')
      args[k] = v ?? true
    } else {
      rest.push(a)
    }
  }
  if (!rest[0]) {
    console.error('Usage: pnpm new:page <Name> [--full|--no-full]')
    process.exit(1)
  }
  args.nameInput = rest[0]
  return args
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true })
}

async function fileExists(p) {
  try {
    await fs.access(p)
    return true
  } catch {
    return false
  }
}

function replacePlaceholders(text, replacements) {
  return text
    .replaceAll('{PascalCase}', replacements.PascalCase)
    .replaceAll('{camelCase}', replacements.camelCase)
    .replaceAll('{kebab-case}', replacements.kebab)
}

async function copyTemplateDir(templateDir, destDir, replacements) {
  await ensureDir(destDir)
  const entries = await fs.readdir(templateDir, { withFileTypes: true })
  for (const entry of entries) {
    const srcName = entry.name
    const replacedName = replacePlaceholders(srcName, replacements)
    const srcPath = path.join(templateDir, srcName)
    const dstPath = path.join(destDir, replacedName)
    if (entry.isDirectory()) {
      await copyTemplateDir(srcPath, dstPath, replacements)
    } else if (entry.isFile()) {
      const content = await fs.readFile(srcPath, 'utf8')
      const replaced = replacePlaceholders(content, replacements)
      await fs.writeFile(dstPath, replaced, 'utf8')
    }
  }
}

async function scaffoldPageFromTemplate(projectRoot, pascalName, camelName, kebabName) {
  const templatesRoot = path.join(__dirname, 'create', 'pages')
  const templateDir = path.join(templatesRoot, '{PascalCase}')
  if (!(await fileExists(templateDir))) {
    throw new Error(`Template not found: ${templateDir}`)
  }
  const destDir = path.join(projectRoot, `src/pages/${pascalName}`)
  if (await fileExists(destDir)) {
    throw new Error(`Destination already exists: ${destDir}`)
  }
  const replacements = {
    PascalCase: pascalName,
    camelCase: camelName,
    kebab: kebabName,
  }
  await copyTemplateDir(templateDir, destDir, replacements)
  return { destDir }
}

function insertImport(routesCode, componentName, importPath) {
  // If already imported, skip
  const importRe = new RegExp(`import\\s*\\{[^}]*\\b${componentName}\\b[^}]*\\}\\s*from\\s*['\"]${importPath}['\"]`)
  if (importRe.test(routesCode)) return routesCode

  // Insert after last import line
  const lines = routesCode.split('\n')
  let lastImportIdx = -1
  for (let i = 0; i < lines.length; i += 1) {
    if (/^import\s/.test(lines[i])) lastImportIdx = i
  }
  const importLine = `import { ${componentName} } from '${importPath}'`
  if (lastImportIdx >= 0) {
    lines.splice(lastImportIdx + 1, 0, importLine)
    return lines.join('\n')
  }
  return `${importLine}\n${routesCode}`
}

function insertIntoFullGroup(routesCode, routePath, componentName) {
  const groupMarker = 'element: <PageContainer full />'
  const idx = routesCode.indexOf(groupMarker)
  if (idx === -1) return routesCode
  const childrenIdx = routesCode.indexOf('children: [', idx)
  if (childrenIdx === -1) return routesCode

  // Find closing bracket of this children array
  let i = childrenIdx + 'children: ['.length
  let depth = 1
  while (i < routesCode.length && depth > 0) {
    const ch = routesCode[i]
    if (ch === '[') depth += 1
    else if (ch === ']') depth -= 1
    i += 1
  }
  const insertPos = i - 1 // position of the closing ']'

  const newRoute = `\n          {\n            path: '${routePath}',\n            element: <${componentName} name="${routePath}" />,\n          },`

  return routesCode.slice(0, insertPos) + newRoute + routesCode.slice(insertPos)
}

function ensureNonFullGroupAndInsert(routesCode, routePath, componentName) {
  const nonFullMarker = 'element: <PageContainer />'
  const pathRootMarker = "path: '/'"

  if (routesCode.includes(nonFullMarker)) {
    // Insert into existing non-full group's children
    const idx = routesCode.indexOf(nonFullMarker)
    const childrenIdx = routesCode.indexOf('children: [', idx)
    if (childrenIdx === -1) return routesCode
    let i = childrenIdx + 'children: ['.length
    let depth = 1
    while (i < routesCode.length && depth > 0) {
      const ch = routesCode[i]
      if (ch === '[') depth += 1
      else if (ch === ']') depth -= 1
      i += 1
    }
    const insertPos = i - 1
    const newRoute = `\n          {\n            path: '${routePath}',\n            element: <${componentName} name="${routePath}" />,\n          },`
    return routesCode.slice(0, insertPos) + newRoute + routesCode.slice(insertPos)
  }

  // Need to create a new group under root '/' children array
  const rootIdx = routesCode.indexOf(pathRootMarker)
  if (rootIdx === -1) return routesCode
  const childrenIdx = routesCode.indexOf('children: [', rootIdx)
  if (childrenIdx === -1) return routesCode
  // Find the position just after the first group's object (we'll insert after it)
  // We'll search for the closing of the first group object by matching braces
  let braceIdx = routesCode.indexOf('{', childrenIdx)
  if (braceIdx === -1) return routesCode
  let i = braceIdx + 1
  let depth = 1
  while (i < routesCode.length && depth > 0) {
    const ch = routesCode[i]
    if (ch === '{') depth += 1
    else if (ch === '}') depth -= 1
    i += 1
  }
  // i is position after the closing '}' of first group
  const insertPos = i
  const groupBlock = `,\n      {\n        element: <PageContainer />,\n        children: [\n          {\n            path: '${routePath}',\n            element: <${componentName} name="${routePath}" />,\n          },\n        ],\n      }`

  return routesCode.slice(0, insertPos) + groupBlock + routesCode.slice(insertPos)
}

async function updateRoutes(root, pascalName, kebabName, isFull) {
  const routesPath = path.join(root, 'src/router/routes.tsx')
  let code = await fs.readFile(routesPath, 'utf8')

  // 1) Add import
  code = insertImport(code, pascalName, `@/pages/${pascalName}`)

  // 2) Insert route in appropriate group
  if (isFull) {
    code = insertIntoFullGroup(code, kebabName, pascalName)
  } else {
    code = ensureNonFullGroupAndInsert(code, kebabName, pascalName)
  }

  await fs.writeFile(routesPath, code, 'utf8')
}

async function main() {
  const args = parseArgs(process.argv)
  const projectRoot = path.resolve(path.join(__dirname, '..', '..'))
  const pascal = toPascalCase(args.nameInput)
  const camel = pascal.charAt(0).toLowerCase() + pascal.slice(1)
  const kebab = toKebabCase(args.nameInput)
  const isFull = !!args.full

  await scaffoldPageFromTemplate(projectRoot, pascal, camel, kebab)
  await updateRoutes(projectRoot, pascal, kebab, isFull)

  console.log(`✔ Page created: src/pages/${pascal}`)
  console.log(`✔ Route added: /${kebab} (${isFull ? 'full' : 'non-full'})`)
}

main().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
