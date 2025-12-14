const fs = require('fs')
const path = require('path')

/**
 * 检查文件是否为 JSON 文件
 * @param {string} filePath
 * @returns {boolean}
 */
function isJsonFile(filePath) {
  return path.extname(filePath).toLowerCase() === '.json'
}

/**
 * 检查是否为隐藏文件
 * @param {string} fileName
 * @returns {boolean}
 */
function isHiddenFile(fileName) {
  return fileName.startsWith('.')
}

/**
 * 读取 JSON 文件
 * @param {string} filePath
 * @returns {Promise<any>}
 */
async function readJsonFile(filePath) {
  const content = await fs.promises.readFile(filePath, 'utf-8')
  return JSON.parse(content)
}

/**
 * 写入 JSON 文件
 * @param {string} filePath
 * @param {any} data
 */
async function writeJsonFile(filePath, data) {
  const content = JSON.stringify(data, null, 2)
  await fs.promises.writeFile(filePath, content, 'utf-8')
}

/**
 * 递归处理目录中的所有 JSON 文件
 * @param {string} dirPath - 目录路径
 * @param {function} processFile - 处理单个文件的函数
 * @param {function} [onProgress] - 进度回调函数
 */
async function processJsonFilesRecursively(dirPath, processFile, onProgress = () => {}) {
  try {
    const stats = await fs.promises.stat(dirPath)

    if (stats.isDirectory()) {
      onProgress({ type: 'directory', path: dirPath, status: 'processing' })
      const files = await fs.promises.readdir(dirPath, { withFileTypes: true })

      for (const file of files) {
        if (!isHiddenFile(file.name)) {
          const fullPath = path.join(dirPath, file.name)
          await processJsonFilesRecursively(fullPath, processFile, onProgress)
        }
      }
    } else if (isJsonFile(dirPath)) {
      onProgress({ type: 'file', path: dirPath, status: 'processing' })
      try {
        const data = await readJsonFile(dirPath)
        const processedData = await processFile(data, dirPath)
        await writeJsonFile(dirPath, processedData)
        onProgress({ type: 'file', path: dirPath, status: 'success' })
      } catch (error) {
        onProgress({ type: 'file', path: dirPath, status: 'error', error })
        throw error
      }
    }
  } catch (error) {
    onProgress({ type: 'error', path: dirPath, error })
    throw error
  }
}

module.exports = {
  isJsonFile,
  isHiddenFile,
  readJsonFile,
  writeJsonFile,
  processJsonFilesRecursively,
}
