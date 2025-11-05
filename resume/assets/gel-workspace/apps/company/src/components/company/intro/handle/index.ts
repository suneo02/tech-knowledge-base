export const parseCompanyTagStr = (tagStr) => {
  let type = tagStr.split('_')[0]
  let name = tagStr.split('_')[1]
  let id = tagStr.split('_')[2]
  return {
    type,
    name,
    id,
  }
}
/**
 * 根据以前的逻辑抽象出来的
 * @param {*} corpListTags
 * @param {*} corporationTags
 */
export const organizeCorpListAndCorporationTag = (corpListTags, corporationTags) => {
  const corpTagList = []
  const featureCompanyTagList = []
  corporationTags.forEach((item) => {
    const { type } = parseCompanyTagStr(item)
    switch (type) {
      case '名录标签':
      case '特殊名录': {
        featureCompanyTagList.push(item)
        break
      }
      default: {
        corpTagList.push(item)
      }
    }
  })
  featureCompanyTagList.push(...corpListTags)

  // 暂时屏蔽科技型初创企业
  let indexDl = -1
  for (let i = 0; i < featureCompanyTagList.length; i++) {
    const { name, id } = parseCompanyTagStr(featureCompanyTagList[i])
    if (name == '科技型初创企业' || id == '2010202482') {
      indexDl = i
    }
  }
  if (indexDl > -1) {
    featureCompanyTagList.splice(indexDl, 1)
  }
  return {
    corpTagList,
    featureCompanyTagList,
  }
}
