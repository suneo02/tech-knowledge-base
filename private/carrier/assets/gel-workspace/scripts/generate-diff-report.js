const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// 配置
const TARGET_BRANCH = 'origin/develop' // 比较的基准分支
const OUTPUT_DIR = 'diff_report' // 输出目录名

/**
 * 执行 Shell 命令并返回结果
 */
function runCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8', maxBuffer: 1024 * 1024 * 20 }).trim()
  } catch (error) {
    return ''
  }
}

function generateDiffDoc() {
  console.log('🔄 正在初始化差异分析...')

  // 1. 准备输出目录
  if (fs.existsSync(OUTPUT_DIR)) {
    console.log(`🧹 清理旧目录: ${OUTPUT_DIR}`)
    fs.rmSync(OUTPUT_DIR, { recursive: true, force: true })
  }
  fs.mkdirSync(OUTPUT_DIR)

  // 2. 获取当前分支信息
  const currentBranch = runCommand('git branch --show-current') || 'HEAD'
  const dateStr = new Date().toLocaleString()

  console.log(`📊 当前分支: ${currentBranch}`)
  console.log(`🎯 目标分支: ${TARGET_BRANCH}`)

  // 3. 获取变更文件列表
  const diffStats = runCommand(`git diff --name-status ${TARGET_BRANCH}...${currentBranch}`)

  if (!diffStats) {
    console.log('✅ 未检测到任何差异。')
    return
  }

  // 过滤掉空行和 md 文件
  const fileLines = diffStats
    .split('\n')
    .filter(Boolean)
    .filter((line) => !line.trim().endsWith('.md'))

  console.log(`📝 检测到 ${fileLines.length} 个代码文件变更 (已忽略 .md 文档)。`)

  // 4. 构建索引页 (README.md)
  let indexContent = `# 代码差异报告索引\n\n`
  indexContent += `- **生成时间**: ${dateStr}\n`
  indexContent += `- **当前分支**: \`${currentBranch}\`\n`
  indexContent += `- **基准分支**: \`${TARGET_BRANCH}\`\n\n`
  indexContent += `> 点击下方链接查看具体文件的差异详情 (已忽略文档变更)。\n\n`
  indexContent += `## 变更文件列表\n\n`
  indexContent += `| 状态 | 文件路径 (点击查看详情) |\n`
  indexContent += `| :--- | :--- |\n`

  console.log('🔍 正在生成差异文件...')

  fileLines.forEach((line, index) => {
    const parts = line.split(/\t/)
    const status = parts[0]
    const filePath = parts[1] // 原始文件路径

    // 状态图标
    let statusIcon = status.startsWith('M')
      ? '🟡 修改'
      : status.startsWith('A')
        ? '🟢 新增'
        : status.startsWith('D')
          ? '🔴 删除'
          : status

    // 扁平化文件名：src/utils/test.ts -> src__utils__test.ts.md
    const flatFileName = filePath.replace(/[\\/]/g, '__') + '.md'
    const outputFilePath = path.join(OUTPUT_DIR, flatFileName)

    // 获取 Diff 内容
    const diffCmd = `git diff ${TARGET_BRANCH}...${currentBranch} -- "${filePath}"`
    const diffContent = runCommand(diffCmd)

    // 都在同一级目录下，直接返回 ./README.md
    const relativeToHome = './README.md'

    let fileContent = `# 差异详情: ${filePath}\n\n`
    fileContent += `[← 返回索引](${relativeToHome})\n\n`
    fileContent += `- **状态**: ${statusIcon}\n`
    fileContent += `- **原文件**: \`${filePath}\`\n\n`

    if (diffContent) {
      fileContent += '```diff\n'
      fileContent += diffContent + '\n'
      fileContent += '```\n'
    } else {
      fileContent += '> (无文本差异内容，可能是二进制文件或空文件)\n'
    }

    fs.writeFileSync(outputFilePath, fileContent, 'utf8')

    // 索引页添加链接
    indexContent += `| ${statusIcon} | [${filePath}](${flatFileName}) |\n`

    process.stdout.write(`\r[${index + 1}/${fileLines.length}] 已生成: ${filePath}          `)
  })

  fs.writeFileSync(path.join(OUTPUT_DIR, 'README.md'), indexContent, 'utf8')

  console.log(`\n\n✅ 成功！差异报告目录已生成: ${path.resolve(OUTPUT_DIR)}`)
  console.log(`👉 请打开 ${path.join(OUTPUT_DIR, 'README.md')} 查看索引。`)
}

generateDiffDoc()
