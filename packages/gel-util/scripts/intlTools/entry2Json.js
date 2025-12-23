const fs = require('fs')
const path = require('path')

/**
 * 将多语言词条写入到中英文 JSON 文件中
 * @description 用于将从多语言管理系统导出的词条写入到项目的语言文件中
 * @author xhliu <xhliu.liuxh@wind.com.cn>
 * @param {string} str - excel复制的词条，格式为: "id\t中文\t英文\t"
 * @param {string} path_zh - 中文语言文件的相对路径
 * @param {string} path_en - 英文语言文件的相对路径
 * @example
 * entry2json('6653\t关闭\tClose', '../locale/zh_CN.json', '../locale/en_US.json');
 */
function entry2json(str, path_zh, path_en) {
  // 转换为绝对路径
  const filePath_zh = path.join(__dirname, path_zh)
  const filePath_en = path.join(__dirname, path_en)

  // 解析词条字符串
  const entries = parseEntryString(str)

  // 写入每个词条到对应的语言文件
  entries.forEach(({ key, zhValue, enValue }) => {
    addFieldToJsonFile(filePath_zh, key, zhValue)
    addFieldToJsonFile(filePath_en, key, enValue)
  })
}

/**
 * 解析词条字符串为结构化数据
 * @private
 * @param {string} str - 词条字符串，格式为: "id\t中文\t英文\t"
 * @returns {Array<{key: number, zhValue: string, enValue: string}>} 解析后的词条数组
 */
function parseEntryString(str) {
  const entries = []
  const items = str
    .trim()
    .split(/[\t\n]/)
    .filter((item) => item)

  for (let i = 0; i < items.length; i += 3) {
    entries.push({
      key: +items[i],
      zhValue: items[i + 1],
      enValue: items[i + 2],
    })
  }

  return entries
}

/**
 * 添加或更新 JSON 文件中的字段
 * @private
 * @param {string} filePath - JSON 文件的完整路径
 * @param {number} key - 词条 ID
 * @param {string} value - 词条内容
 * @throws {Error} 当 key 不是数字或 JSON 解析失败时抛出错误
 */
function addFieldToJsonFile(filePath, key, value) {
  // 验证 key 类型
  if (typeof key !== 'number') {
    throw new Error(`Invalid key type: ${typeof key}, expected number`)
  }

  try {
    // 读取并解析 JSON 文件
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const jsonData = JSON.parse(fileContent)

    // 更新字段
    jsonData[key] = value

    // 格式化并写回文件
    const updatedContent = JSON.stringify(jsonData, null, 2)
    fs.writeFileSync(filePath, updatedContent, 'utf-8')

    console.log(`Successfully added/updated field ${key}: ${value} in ${filePath}`)
  } catch (error) {
    console.error(`Failed to process file ${filePath}:`, error)
    throw error
  }
}

// 使用示例
const EXAMPLE_ZH_PATH = '../../src/intl/locales/iml_cn.json'
const EXAMPLE_EN_PATH = '../../src/intl/locales/iml_en.json'

const EXAMPLE_ENTRY = ``

entry2json(EXAMPLE_ENTRY, EXAMPLE_ZH_PATH, EXAMPLE_EN_PATH)

module.exports = {
  entry2json,
}
