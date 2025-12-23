import { intl, isEn } from 'gel-util/intl'

/**
 * 获取 desc msg ‘报告主体 : 企业名称’
 * @function getDescMsg
 * @param {string} entityName - 实体名称，用于生成消息内容。
 * @returns {string} 返回消息内容。
 */
export const getDescMsgReportSubject = (entityName: string) => {
  return `${intl('438635', '报告主体')} : ${entityName ? entityName : '--'}`
}

/**
 * 获取 desc msg '匹配公司数 : 15'
 * @function getDescMsgMatchCount
 * @param {number} records - 匹配的记录数量，用于生成消息内容。
 * @returns {string} 返回消息内容。
 */
export const getDescMsgMatchCount = (records: number) => {
  return `${intl('438654', '匹配公司数')} : ${records ? records : '--'}`
}

/**
 * 获取 desc msg '导出主体 : 企业名称'
 * @function getDescMsgExportSubject
 * @param {string} entityName - 实体名称，用于生成消息内容。
 * @returns {string} 返回消息内容。
 */
export const getDescMsgExportSubject = (entityName: string) => {
  return `${isEn() ? 'Export Subject' : '导出主体'} : ${entityName ? entityName : '--'}`
}
