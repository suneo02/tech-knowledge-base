/**
 * 处理报告节点数据翻译的一些特殊处理
 */

import { CorpBasicInfo, TCorpDetailNodeKey, TCorpDetailSectionKey } from 'gel-types'

export const processReportNodeDataTranslation = (
  rawData: any | CorpBasicInfo,
  translatedData: any | CorpBasicInfo,
  key: TCorpDetailNodeKey | TCorpDetailSectionKey
) => {
  // 如果是公司基本信息
  if (key === 'BussInfo') {
    // 保留公司名称不做翻译
    translatedData.corp_name = rawData.corp_name
  }
  return translatedData
}
