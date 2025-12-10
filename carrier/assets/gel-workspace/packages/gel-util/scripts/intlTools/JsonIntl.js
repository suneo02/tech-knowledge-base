const fs = require('fs')

const needToAddList = []

// 读取JSON文件
function readJsonFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
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

// 写入JSON文件
function writeJsonFile(filePath, jsonData) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(jsonData, null, 2)
    fs.writeFile(filePath, data, 'utf-8', (err) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}

// 递归遍历对象或数组，处理没有titleId的title
/**
 *
 * @param {*} obj
 * @param {*} intlData
 * @param {*} keys 需要翻译的key
 */
function traverseAndConfigureTitles(obj, intlData, keys = ['title', 'label', 'placeholder', 'desc']) {
  if (Array.isArray(obj)) {
    // 如果是数组，递归遍历数组元素
    return obj.map((item) => traverseAndConfigureTitles(item, intlData, keys))
  } else if (typeof obj === 'object' && obj !== null) {
    Object.keys(obj).forEach((key) => {
      if (keys.includes(key)) {
        const idKey = `${key}Id`

        const intlEntry = Object.entries(intlData).find(([_, value]) => value === obj[key]?.trim())

        if (intlEntry) {
          if (!(idKey in obj)) {
            // 不存在 id 才去替换
            const [id] = intlEntry
            obj[idKey] = id
          }
        } else {
          delete obj[idKey]
          if (!needToAddList.includes(obj[key])) {
            needToAddList.push(obj[key])
          }
        }
      }
    })

    // 递归处理对象中的其他属性
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        obj[key] = traverseAndConfigureTitles(obj[key], intlData, keys)
      }
    }
  }
  return obj // 返回更新后的对象
}

// 获取目录下所有JSON文件
function getJsonFiles(dirPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, files) => {
      if (err) {
        return reject(err)
      }
      // 过滤出.json文件
      const jsonFiles = files.filter(file => file.endsWith('.json'))
      // 返回完整路径
      resolve(jsonFiles.map(file => `${dirPath}/${file}`))
    })
  })
}

// 处理多语言配置的函数
async function configureTitleIds(intlFilePath, dataPath) {
  try {
    // 读取intl文件
    const intlData = await readJsonFile(intlFilePath)
    
    // 判断dataPath是文件还是目录
    const stats = await fs.promises.stat(dataPath)
    const filePaths = stats.isDirectory() 
      ? await getJsonFiles(dataPath)
      : [dataPath]

    // 处理所有文件
    for (const filePath of filePaths) {
      console.log(`Processing file: ${filePath}`)
      const data = await readJsonFile(filePath)
      const updatedData = traverseAndConfigureTitles(data, intlData)
      await writeJsonFile(filePath, updatedData)
    }

    if (needToAddList?.length) {
      console.log('以下是需要产品新增词条目录\n')
      console.log(needToAddList.join('\n'))
      console.log('\n')
    }
    console.log('词条已全部翻译完成.')
  } catch (error) {
    console.error('Error during processing:', error)
  }
}

// 调用函数，传入文件路径
const intlFilePath = 'src/locales/zh.json'
const dataPath = 'src/handle/corpModuleCfg/base/HKCorpInfo/cfg' // 可以是目录路径或文件路径

configureTitleIds(intlFilePath, dataPath)
