import { Tree } from '@wind/wind-ui'
import React from 'react'
import { makeTree } from '@/components/company/info/comp/misc.tsx'

export const industry_gb_render = (txt, backData) => {
  const data = backData.industryGbFold //industryWindFold;
  const dataList = backData.gbIndustryList
  if (!data) return '--'
  const list = data.split('-')
  const treeStr = [{ title: list[0], key: '0-0' }]
  let tmp: any = treeStr[0]
  if (list.length > 1) {
    for (let i = 1; i < list.length; i++) {
      const k = '-0'
      tmp.children = []
      let item = null
      if (i == list.length - 1) {
        item = {
          title: dataList[dataList.length - 1].industryName + '(' + dataList[dataList.length - 1].industryCode + ')',
          key: tmp.key + k,
        }
      } else {
        item = { title: list[i], key: tmp.key + k }
      }
      makeTree(tmp, item)
      tmp = item
    }
  }
  return (
    <Tree
      className="corp-industry-tree"
      showLine={true}
      defaultExpandedKeys={[tmp.key]}
      treeData={treeStr}
      data-uc-id="lApcm7HkME"
      data-uc-ct="tree"
    />
  )
}
export const industry_name_wind_render = (txt, backData) => {
  const data = backData.industryWindFold
  if (!data) return '--'
  const list = data.split('-')
  const treeStr = [{ title: list[0], key: '0-0' }]
  let tmp: any = treeStr[0]
  if (list.length > 1) {
    for (let i = 1; i < list.length; i++) {
      const k = '-0'
      tmp.children = []
      const item = { title: list[i], key: tmp.key + k }
      makeTree(tmp, item)
      tmp = item
    }
  }
  return (
    <Tree
      className="corp-industry-tree"
      showLine={true}
      defaultExpandedKeys={[tmp.key]}
      treeData={treeStr}
      data-uc-id="HGVBYq_aBH"
      data-uc-ct="tree"
    />
  )
}
export const industry_oversea_render = (txt, backData) => {
  const overseasCorpIndustryList = backData.overseasCorpIndustryList
  if (overseasCorpIndustryList?.length) {
    let val = ''
    overseasCorpIndustryList.map((t) => {
      val = val ? val + ', ' + t.industryName : t.industryName
    })
    return val
  }
  return '--'
}
