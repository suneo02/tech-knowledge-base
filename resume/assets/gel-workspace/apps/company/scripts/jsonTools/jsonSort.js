/**
 * 将 json 文件中的 对象排序
 *
 * 首先 value 是非对象非数组的在前面
 * 其次 value 是对象的，递归处理
 * 其次 value 是数组的，递归处理
 *
 * 对于对象中的 简单 value， 根据 key 的 字母顺序 排序
 */

function jsonSort(data) {
  // 如果不是对象或是null，直接返回
  if (typeof data !== 'object' || data === null) {
    return data
  }

  // 处理数组
  if (Array.isArray(data)) {
    return data.map((item) => jsonSort(item))
  }

  // 将对象的键值对分类
  const entries = Object.entries(data)
  const simpleEntries = []
  const objectEntries = []
  const arrayEntries = []

  // 分类所有键值对
  entries.forEach(([key, value]) => {
    if (typeof value !== 'object' || value === null) {
      simpleEntries.push([key, value])
    } else if (Array.isArray(value)) {
      arrayEntries.push([key, value])
    } else {
      objectEntries.push([key, value])
    }
  })

  // 对每种类型的键值对进行排序
  const sortedSimple = simpleEntries.sort(([a], [b]) => a.localeCompare(b))
  const sortedObject = objectEntries.sort(([a], [b]) => a.localeCompare(b))
  const sortedArray = arrayEntries.sort(([a], [b]) => a.localeCompare(b))

  // 构建结果对象
  const result = {}

  // 按顺序合并所有排序后的键值对
  ;[...sortedSimple, ...sortedObject, ...sortedArray].forEach(([key, value]) => {
    result[key] = jsonSort(value)
  })

  return result
}

/**
 * @param {string} path 文件路径或者目录路径
 */
function sortJsonFile(path) {
  const stats = fs.statSync(path)
  if (stats.isDirectory()) {
    const files = fs.readdirSync(path)
    files.forEach((file) => {
      sortJsonFile(`${path}/${file}`)
    })
  } else {
    const jsonData = JSON.parse(fs.readFileSync(path, 'utf8'))
    const sortedData = jsonSort(jsonData)
    fs.writeFileSync(path, JSON.stringify(sortedData, null, 2))
  }
}

// 导出函数
module.exports = jsonSort

// 使用示例：

const fs = require('fs')

const dataPath = 'src/handle/corpModuleCfg/base/HKCorpInfo/cfg' // 可以是目录路径或文件路径

sortJsonFile(dataPath)
