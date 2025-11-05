const { processJsonFilesRecursively, readJsonFile } = require('./utils/fileProcessor.cjs')
const { sortObjectByKeyTypes } = require('./jsonSort.cjs')

/**
 * 需要进行国际化处理的字段列表
 */
const I18N_FIELDS = [
  'title',
  'label',
  'placeholder',
  'desc',
  'default',
  'emptyText',
  'comment',
  'commentPrefix',
  'commentSuffix',
  'unitPrefix',
]

const I18N_SUFFIX = 'Id'

/**
 * 收集需要添加的国际化词条
 */
const newTranslationEntries = new Set()

/**
 * 检查翻译ID是否与实际值匹配
 * @param {string} translationId - 翻译ID
 * @param {string} actualValue - 实际值
 * @param {Object} translations - 翻译映射
 * @returns {boolean} - 是否匹配
 */
function isTranslationMatching(translationId, actualValue, translations) {
  const translatedText = translations[translationId]
  return translatedText === actualValue.trim()
}

/**
 * 查找匹配的翻译ID
 * @param {string} value - 要查找翻译的值
 * @param {Object} translations - 翻译映射
 * @returns {string|null} - 找到的翻译ID，如果没找到则返回null
 */
function findMatchingTranslationId(value, translations) {
  const trimmedValue = value.trim()
  const entry = Object.entries(translations).find(([_, translatedText]) => translatedText === trimmedValue)
  return entry ? entry[0] : null
}

/**
 * 处理对象的国际化，将文本值替换为对应的国际化 ID
 * @param {any} data - 要处理的数据
 * @param {Object} translations - 已有的翻译映射
 * @returns {any} - 处理后的数据
 */
function processI18n(data, translations) {
  if (typeof data !== 'object' || data === null) {
    return data
  }

  if (Array.isArray(data)) {
    return data.map((item) => processI18n(item, translations))
  }

  const result = { ...data }

  // 处理需要国际化的字段
  I18N_FIELDS.forEach((field) => {
    if (field in result) {
      const value = result[field]
      const idField = `${field}${I18N_SUFFIX}`

      // 确保只对字符串类型的值进行处理
      if (typeof value === 'string' && value.trim()) {
        const existingId = result[idField]

        // 检查现有的翻译ID是否匹配
        if (existingId && translations[existingId]) {
          if (!isTranslationMatching(existingId, value, translations)) {
            // 如果现有ID的翻译与实际值不匹配，尝试找到正确的翻译
            const correctId = findMatchingTranslationId(value, translations)
            if (correctId) {
              // 如果找到匹配的翻译，更新ID
              result[idField] = correctId
            } else {
              // 如果没找到匹配的翻译，删除ID并记录需要添加的词条
              delete result[idField]
              newTranslationEntries.add(value.trim())
            }
          }
          // 如果匹配，保持现有ID不变
        } else {
          // 如果没有现有ID或ID无效，尝试找到匹配的翻译
          const newId = findMatchingTranslationId(value, translations)
          if (newId) {
            result[idField] = newId
          } else {
            // 如果没找到匹配的翻译，记录需要添加的词条
            delete result[idField]
            newTranslationEntries.add(value.trim())
          }
        }
      }
    }
  })

  // 递归处理对象的其他属性
  Object.entries(result).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      result[key] = processI18n(value, translations)
    }
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
      console.log(`Successfully processed: ${path}`)
    } else if (status === 'error') {
      console.error(`Error processing file ${path}:`, error.message)
    }
  } else if (type === 'error') {
    console.error(`Error:`, error.message)
  }
}

/**
 * 显示需要添加的翻译词条
 */
function displayNewTranslationEntries() {
  if (newTranslationEntries.size > 0) {
    console.log('\n以下是需要产品新增词条目录\n')
    console.log([...newTranslationEntries].join('\n'))
    console.log('\n')
  }
}

/**
 * 组合处理函数：先进行国际化处理，然后进行排序
 * @param {any} data - 要处理的数据
 * @param {Object} translations - 翻译映射
 * @returns {any} - 处理后的数据
 */
function processAndSort(data, translations) {
  // 先进行国际化处理
  const i18nProcessed = processI18n(data, translations)
  // 然后进行排序
  return sortObjectByKeyTypes(i18nProcessed)
}

// 主函数
async function main() {
  const intlFilePath = './packages/gel-util/src/intl/locales/iml_cn.json'
  const targetPath = process.argv[2] || 'apps/company/src/mock/group/test.json'

  try {
    // 读取翻译文件
    const translations = await readJsonFile(intlFilePath)
    console.log(`Starting to process: ${targetPath}`)

    // 处理所有 JSON 文件
    await processJsonFilesRecursively(targetPath, async (data) => processAndSort(data, translations), handleProgress)

    // 显示需要添加的翻译词条
    displayNewTranslationEntries()
    console.log('词条已全部翻译完成并排序.')
  } catch (error) {
    console.error('Processing failed:', error.message)
    process.exit(1)
  }
}

// 运行主函数
main()
