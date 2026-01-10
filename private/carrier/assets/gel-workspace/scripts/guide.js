#!/usr/bin/env node

/**
 * Gel Workspace 开发指南脚本
 * 用途: 显示常用开发命令和部署指南 (从 docs/development.md读取)
 */

const fs = require('fs')
const path = require('path')

// 彩色输出
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

function showHelp() {
  console.clear()
  console.log('\n')
  console.log(`${colors.cyan}${colors.bold}🚀 Gel Workspace 开发指南${colors.reset}`)
  console.log('\n')

  try {
    // 读取 docs/development.md
    const docPath = path.join(__dirname, '..', 'docs', 'development.md')
    if (fs.existsSync(docPath)) {
      const content = fs.readFileSync(docPath, 'utf8')
      console.log(content)
      console.log('\n')
    } else {
      console.log(`${colors.red}❌ 未找到文档: ${docPath}${colors.reset}\n`)
    }
  } catch (error) {
    console.log(`${colors.red}❌ 读取文档失败: ${error.message}${colors.reset}\n`)
  }
}

showHelp()

