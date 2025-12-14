const fs = require('fs')
const path = require('path')

// 正则表达式：匹配注释（单行和多行）和字符串（单引号、双引号、反引号）
const commentRegex = /\/\/.*|\/\*[\s\S]*?\*\//g
const stringRegex = /(['"`])(\\?.)*?\1/g
const chineseRegex = /[\u4e00-\u9fa5]+/g

// 读取intl文件
function readIntlFile(intlFilePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(intlFilePath, 'utf-8', (err, data) => {
      if (err) {
        return reject(err)
      }
      try {
        const jsonData = JSON.parse(data)
        resolve(jsonData)
      } catch (parseErr) {
        reject(parseErr)
      }
    })
  })
}

// 搜索并替换中文字符的主函数
async function searchAndReplaceChinese(rootDir, intlFilePath) {
  const intlData = await readIntlFile(intlFilePath)
  const notFound = new Set() // 用于存储未找到的中文字符

  function processFile(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf-8')

    // 移除注释和字符串内容
    const codeWithoutCommentsAndStrings = fileContent.replace(commentRegex, '').replace(stringRegex, '')

    // 搜索非注释、非字符串中的中文字符
    const chineseMatches = codeWithoutCommentsAndStrings.match(chineseRegex)
    if (chineseMatches) {
      let newFileContent = fileContent // 保存更新后的文件内容
      chineseMatches.forEach((chineseStr) => {
        // 在intl中查找对应的id
        const intlEntry = Object.entries(intlData).find(([key, value]) => value === chineseStr)
        if (intlEntry) {
          const [id] = intlEntry
          // 用 intl(id, value) 替换原始中文字符
          const intlReplacement = `intl('${id}', '${chineseStr}')`
          newFileContent = newFileContent.replace(new RegExp(chineseStr, 'g'), intlReplacement)
        } else {
          // 如果没有找到，加入到notFound集合中
          notFound.add(chineseStr)
        }
      })

      // 写回更新后的文件内容
      fs.writeFileSync(filePath, newFileContent, 'utf-8')
      console.log(`Processed and updated: ${filePath}`)
    }
  }

  function traverseDir(dir) {
    const files = fs.readdirSync(dir)

    files.forEach((file) => {
      const filePath = path.join(dir, file)
      if (filePath.endsWith('src\\views\\Customer\\index.jsx')) {
        // 隐私协议 用户协议
        return
      }
      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        // 递归遍历子目录
        traverseDir(filePath)
      } else if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
        // 处理JS或JSX文件
        processFile(filePath)
      }
    })
  }

  // 开始遍历指定的根目录
  traverseDir(rootDir)

  // 打印未找到的中文字符
  if (notFound.size > 0) {
    console.log('The following Chinese strings were not found in the intl file:')
    console.log(Array.from(notFound).join('\n '))
  } else {
    console.log('All Chinese strings were found in the intl file.')
  }
}

// 使用示例：传入根目录路径和intl文件路径
const rootDir = 'src' // React项目的根目录，替换为你的项目目录
const intlFilePath = 'src\\locales\\zh.json' // 多语言文件路径

searchAndReplaceChinese(rootDir, intlFilePath)
