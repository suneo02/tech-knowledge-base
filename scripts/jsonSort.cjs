const { processJsonFilesRecursively } = require('./utils/fileProcessor.cjs')

/**
 * 按照指定规则对对象的键值对进行排序
 * 排序规则：
 * 1. 简单值（非对象非数组）在前
 * 2. 对象值在中间
 * 3. 数组值在后
 * 4. 同类型按键名字母顺序排序
 * @param {any} data - 要排序的数据
 * @returns {any} - 排序后的数据
 */
function sortObjectByKeyTypes(data) {
  // 如果不是对象或是null，直接返回
  if (typeof data !== 'object' || data === null) {
    return data
  }

  // 处理数组
  if (Array.isArray(data)) {
    return data.map(sortObjectByKeyTypes)
  }

  // 将对象的键值对按值类型分类
  const entries = Object.entries(data)
  const entriesByType = {
    simple: [], // 简单值（非对象非数组）
    object: [], // 对象值
    array: [], // 数组值
  }

  // 分类所有键值对
  entries.forEach(([key, value]) => {
    if (typeof value !== 'object' || value === null) {
      entriesByType.simple.push([key, value])
    } else if (Array.isArray(value)) {
      entriesByType.array.push([key, value])
    } else {
      entriesByType.object.push([key, value])
    }
  })

  // 对每种类型的键值对按键名排序
  Object.values(entriesByType).forEach((typeEntries) => {
    typeEntries.sort(([a], [b]) => a.localeCompare(b))
  })

  // 构建结果对象，保持类型顺序：简单值 -> 对象 -> 数组
  const result = {}
  Object.values(entriesByType)
    .flat()
    .forEach(([key, value]) => {
      result[key] = sortObjectByKeyTypes(value)
    })

  return result
}

/**
 * 处理进度信息
 * @param {Object} progress - 进度信息
 */
function handleProgress(progress) {
  const { type, path, status, error } = progress
  if (type === 'directory') {
    console.log(`Processing directory: ${path}`)
  } else if (type === 'file') {
    if (status === 'processing') {
      console.log(`Processing JSON file: ${path}`)
    } else if (status === 'success') {
      console.log(`Successfully sorted: ${path}`)
    } else if (status === 'error') {
      console.error(`Error processing file ${path}:`, error.message)
    }
  } else if (type === 'error') {
    console.error(`Error:`, error.message)
  }
}

// 主函数
async function main() {
  const targetPath = process.argv[2] || 'apps/company/src/mock/group/test.json'
  console.log(`Starting to process: ${targetPath}`)

  try {
    await processJsonFilesRecursively(targetPath, sortObjectByKeyTypes, handleProgress)
    console.log('Processing completed!')
  } catch (error) {
    console.error('Processing failed:', error.message)
    process.exit(1)
  }
}

// 导出排序函数供其他模块使用
module.exports = {
  sortObjectByKeyTypes,
}

// 如果直接运行此脚本，则执行主函数
if (require.main === module) {
  main()
}
