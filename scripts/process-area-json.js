const fs = require('fs')
const path = require('path')

const projectRoot = path.resolve(__dirname, '..')
const inputFilePath = path.join(projectRoot, 'packages/gel-util/src/config/areaTree/areaTreeGlobalForSearch.json')
const outputFilePath = path.join(
  projectRoot,
  'packages/gel-util/src/config/areaTree/areaTreeGlobalForSearchProcessed.json'
)

const processedNodes = new WeakMap()

function processNode(node) {
  if (processedNodes.has(node)) {
    return processedNodes.get(node)
  }
  // 使用浅拷贝创建一个新节点，以避免修改原始对象
  const newNode = { ...node }

  // 遍历 newNode 的字段，如果有 null 或者 空数组
  Object.keys(newNode).forEach((key) => {
    if (newNode[key] === null || (Array.isArray(newNode[key]) && newNode[key].length === 0)) {
      delete newNode[key]
    }
  })
  if (!('nameEn' in newNode)) {
    console.error('nameEn is not in newNode', newNode)
  }

  // 在递归调用之前，将新节点存入缓存，以处理循环引用
  processedNodes.set(node, newNode)

  if (newNode.name && newNode.nameNative && newNode.name !== newNode.nameNative) {
    newNode.name = `${newNode.name} (${newNode.nameNative})`
  }

  if (newNode.nameEn && newNode.nameNative && newNode.nameEn !== newNode.nameNative) {
    newNode.nameEn = `${newNode.nameEn} (${newNode.nameNative})`
  }

  if (newNode.node && newNode.node.length > 0) {
    newNode.node = newNode.node.map((child) => processNode(child))
  }

  return newNode
}

function processJsonFile(inputPath, outputPath) {
  try {
    const rawData = fs.readFileSync(inputPath, 'utf-8')
    const data = JSON.parse(rawData)

    let processedData
    if (Array.isArray(data)) {
      processedData = data.map(processNode)
    } else {
      processedData = processNode(data)
    }

    fs.writeFileSync(outputPath, JSON.stringify(processedData, null, 2), 'utf-8')
    console.log(`Processing complete. Output saved to: ${outputPath}`)
  } catch (error) {
    console.error('An error occurred:', error)
  }
}

processJsonFile(inputFilePath, outputFilePath)
