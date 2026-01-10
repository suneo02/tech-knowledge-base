const fs = require('fs')
const path = require('path')
const glob = require('glob')

console.log('开始执行脚本...')

// 配置项：需要排除的文件和文件夹模式
const excludePatterns = [
  '**/node_modules/**',
  '**/dist/**',
  '**/i18nCheck.cjs',
  '**/src/api/configApi.ts',
  '**/src/api/pointBuried/**',
  '**/src/api/qualificationsApi.js',
  '**/src/api/corp/info/common.ts',
  '**/src/locales/**',
  '**/src/views/Dev/**',
  '**/src/views/SearchHome.tsx',
  '**/src/views/Fetured/nameCodeMap/oldCodeNameMap.ts',
  '**/src/views/CompanyDynamic.js',
  '**/src/utils/industryOfNationalEconomyTree.js',
  '**/src/utils/electronEconomyTree.js',
  '**/src/utils/areaTree.js',
  '**/src/utils/lowCarbonTree.js',
  '**/src/utils/strategicEmergingIndustryTree.js',
  '**/src/components/table/tableDictionary.tsx',
  '**/src/views/overseaSearchList.js',
  '**/src/views/groupSearchList.tsx',
  '**/src/views/Qualifications/qualificationBury.ts',
  '**/src/views/Qualifications/detail.js',
  '**/src/views/Fetured/nameCodeMap/oldNameCodeMap.ts',
  '**/src/lib/countryCode.js',
  '**/src/lib/city.js',
  '**/src/handle/searchConfig/newMap.ts',
  '**/src/views/personSearchList.tsx',
  '**/src/views/SearchList/index.tsx',
  '**/src/views/FilterRes.js',
  // 在这里添加其他要排除的文件或文件夹模式
  // 例如: '**/test/**', '**/*.test.{js,jsx,ts,tsx}'
]

/**
 * 生成唯一的6位数字ID生成器
 * @returns {Function} 返回一个生成唯一ID的函数
 */
const createIdGenerator = () => {
  let counter = 1
  return () => `A${String(counter++).padStart(6, '0')}`
}

/**
 * 移除代码中的注释
 * @param {string} content 源代码内容
 * @returns {string} 移除注释后的代码
 */
function removeComments(content) {
  try {
    // 移除多行注释 /* ... */
    content = content.replace(/\/\*[\s\S]*?\*\//g, '')

    // 移除单行注释 // ...
    content = content.replace(/\/\/.*/g, '')

    // 移除 JSX 注释 {/* ... */}
    content = content.replace(/\{\/\*[\s\S]*?\*\/\}/g, '')

    return content
  } catch (error) {
    console.error('移除注释时出错:', error)
    return content
  }
}

/**
 * 从文本内容中提取中文字符串
 * @param {string} content 要检查的文本内容
 * @returns {string[]} 返回提取到的中文字符串数组
 */
function extractChineseStrings(content) {
  try {
    // 先移除注释
    const contentWithoutComments = removeComments(content)

    // 移除 pointBuriedGel() 函数中的内容
    const contentWithoutPointBuried = contentWithoutComments.replace(/pointBuriedGel\([^)]*\)/g, '')

    // 移除 console 相关的内容
    const contentWithoutConsole = contentWithoutPointBuried.replace(/console\.[^)]*\)/g, '')

    const chineseStrings = new Set()

    // 更新正则表达式以匹配更复杂的中文组合
    const chineseRegex =
      /(?:[\u4e00-\u9fa5]+[0-9%]*[\u4e00-\u9fa5]*|[\u4e00-\u9fa5][^'")\n\r]*?[\u4e00-\u9fa5])[^'")\n\r]*/g

    // 使用正则表达式匹配所有中文字符串
    let match
    while ((match = chineseRegex.exec(contentWithoutConsole)) !== null) {
      const str = match[0].trim()
      // 过滤掉太短的字符串（通常是误匹配）
      if (str && str.length >= 2) {
        // 处理特殊情况：如果字符串以非中文字符结尾，且不是特殊字符（如%），则去掉
        const finalStr = str.replace(/[^%\u4e00-\u9fa5]$/g, '').trim()
        if (finalStr) {
          chineseStrings.add(finalStr)
        }
      }
    }

    return Array.from(chineseStrings)
  } catch (error) {
    console.error('提取中文字符串时出错:', error)
    return []
  }
}

/**
 * 检查字符串是否在intl方法中被使用
 * @param {string} content 文件内容
 * @param {string} str 要检查的字符串
 * @returns {boolean} 是否在intl方法中
 */
function isInIntlMethod(content, str) {
  try {
    const escapedStr = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    // 匹配 intl('id', '中文') 或 intl("id", "中文") 或 intl(`id`, `中文`) 的模式
    const intlPatterns = [
      // 匹配 intl('xxx', '中文') 模式
      new RegExp(`intl\\(['"]\w+['"],\\s*['"]${escapedStr}['"]\\)`),
      // 匹配 intl(`xxx`, `中文`) 模式
      new RegExp(`intl\\(\`\\w+\`,\\s*\`${escapedStr}\`\\)`),
      // 匹配 intlNoIndex('xxx', '中文') 模式
      new RegExp(`intlNoIndex\\(['"]\w+['"],\\s*['"]${escapedStr}['"]\\)`),
      // 匹配 intlNoIndex(`xxx`, `中文`) 模式
      new RegExp(`intlNoIndex\\(\`\\w+\`,\\s*\`${escapedStr}\`\\)`),
    ]

    return intlPatterns.some((pattern) => pattern.test(content))
  } catch (error) {
    console.error('检查intl方法时出错:', error)
    return false
  }
}

/**
 * 读取多语言文件
 * @returns {Object} 包含中英文翻译的对象
 */
function loadLocaleFiles() {
  const rootDir = process.cwd()
  const zhPath = path.join(rootDir, 'src/locales/zh.json')
  const enPath = path.join(rootDir, 'src/locales/en.json')
  const zhLocale = JSON.parse(fs.readFileSync(zhPath, 'utf-8'))
  const enLocale = JSON.parse(fs.readFileSync(enPath, 'utf-8'))
  return { zhLocale, enLocale }
}

/**
 * 处理单个文件的中文检查
 * @param {string} file 文件路径
 * @param {Object} zhLocale 中文翻译对象
 * @param {Object} enLocale 英文翻译对象
 * @param {Object} result 结果对象
 * @param {Function} generateNewId ID生成器函数
 */
function processFile(file, zhLocale, enLocale, result, generateNewId) {
  try {
    const content = fs.readFileSync(file, 'utf-8')
    const chineseStrings = extractChineseStrings(content)

    for (const str of chineseStrings) {
      // 如果在intl方法中，直接跳过，不需要处理
      if (isInIntlMethod(content, str)) {
        continue
      }

      // 在zh.json中查找匹配
      const foundEntry = Object.entries(zhLocale).find(([, value]) => value === str)
      if (foundEntry) {
        const [intlId] = foundEntry
        if (!result.match[str]) {
          result.match[str] = {
            intlId,
            cnName: str,
            enName: enLocale[intlId] || '',
            files: [],
          }
        }
        if (!result.match[str].files.includes(file)) {
          result.match[str].files.push(file)
        }
      } else {
        // 只有不在intl方法中且在zh.json中找不到的才算未匹配
        const newId = generateNewId()
        if (!result.noMatch[str]) {
          result.noMatch[str] = {
            intlId: newId,
            cnName: str,
            enName: '',
            files: [],
          }
        }
        if (!result.noMatch[str].files.includes(file)) {
          result.noMatch[str].files.push(file)
        }
      }
    }
  } catch (error) {
    console.error(`处理文件 ${file} 时出错：`, error)
  }
}

/**
 * 保存检查结果到文件
 * @param {Object} result 检查结果
 * @param {Object} fileBasedResult 按文件组织的结果
 */
function saveResults(result, fileBasedResult) {
  // 转换match结果为数组格式
  const matchArray = Object.entries(result.match).map(([, value], index) => ({
    id: index + 1,
    intlId: value.intlId,
    cnName: value.cnName,
    enName: value.enName,
    files: value.files.map((file) => file.replace(/\\/g, '/')),
  }))

  // 转换noMatch结果为数组格式
  const noMatchArray = Object.entries(result.noMatch).map(([, value], index) => ({
    id: index + 1,
    intlId: value.intlId,
    cnName: value.cnName,
    enName: value.enName,
    files: value.files.map((file) => file.replace(/\\/g, '/')),
  }))

  // 转换 fileBasedResult 的键名
  const formattedFileBasedResult = Object.entries(fileBasedResult).reduce((acc, [key, value]) => {
    acc[key.replace(/\\/g, '/')] = value
    return acc
  }, {})

  // 保存匹配结果
  const matchPath = path.join(process.cwd(), 'i18n_match.json')
  fs.writeFileSync(matchPath, JSON.stringify(matchArray, null, 2), 'utf-8')

  // 保存未匹配结果
  const noMatchPath = path.join(process.cwd(), 'i18n_no_match.json')
  fs.writeFileSync(noMatchPath, JSON.stringify(noMatchArray, null, 2), 'utf-8')

  // 保存按文件组织的结果
  const fileBasedOutputPath = path.join(process.cwd(), 'i18n-check-by-file.json')
  fs.writeFileSync(fileBasedOutputPath, JSON.stringify(formattedFileBasedResult, null, 2), 'utf-8')

  console.log('检查完成！结果已保存到:')
  console.log('- i18n_match.json')
  console.log('- i18n_no_match.json')
  console.log('- i18n-check-by-file.json')
  console.log(`匹配到的中文数量：${matchArray.length}`)
  console.log(`未匹配的中文数量：${noMatchArray.length}`)
  console.log(`包含未匹配中文的文件数量：${Object.keys(formattedFileBasedResult).length}`)
}

/**
 * 主函数：执行整个检查流程
 */
async function main() {
  try {
    const { zhLocale, enLocale } = loadLocaleFiles()
    const generateNewId = createIdGenerator()

    const result = {
      match: {},
      noMatch: {},
    }
    const fileBasedResult = {}

    const files = glob.sync('src/**/*.{js,jsx,ts,tsx}', {
      ignore: excludePatterns,
    })

    for (const file of files) {
      processFile(file, zhLocale, enLocale, result, generateNewId)

      // 收集每个文件中的未匹配字段
      const unmatchedInFile = Object.entries(result.noMatch)
        .filter(([, value]) => value.files.includes(file))
        .map(([key, value]) => ({
          cnName: key,
          intlId: value.intlId,
        }))

      if (unmatchedInFile.length > 0) {
        fileBasedResult[file] = unmatchedInFile
      }
    }

    saveResults(result, fileBasedResult)
  } catch (error) {
    console.error('执行过程中出现错误：', error)
    process.exit(1)
  }
}

// 执行主函数
try {
  main()
} catch (error) {
  console.error('执行过程中出现错误：', error)
}
