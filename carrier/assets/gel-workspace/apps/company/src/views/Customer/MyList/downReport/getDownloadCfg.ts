// 从jquery迁移过来的逻辑
import { DownloadFileResponse } from 'gel-api'
import { getDownloadCfgDepre } from './handle'
import { getDescMsgExportSubject, getDescMsgMatchCount, getDescMsgReportSubject } from './itemDescMsg'

/**
 * @deprecated 需要删除 待后端配置，前端配置即可删除
 */
const downloadItemReportSubjectDescMsg = ['doc_task_investtrack', 'single_report_task_exp_corp']

/**
 * @deprecated 需要删除 待后端配置，前端配置即可删除
 */
const downloadItemExportSubjectDescMsg = [
  'doc_task_ipograph2',
  'doc_task_ipograph3',
  'doc_task_ipograph4',
  'doc_task_ipograph5',
  'doc_task_invest',
]

/**
 * 根据传入的配置生成文件下载的详细信息，包括下载链接、文件名、国际化消息等。
 * @function getConfig
 * @param {Object} config - 配置信息对象。
 * @param {string} config.name - 下载文件的功能标识符，用于确定文件类型。
 * @param {string} config.created - 文件创建日期，将用于格式化文件名。
 * @param {string} [config.downloadFileName] - 可选的下载文件名。
 * @param {string} config.entityName - 实体名称，用于生成文件名和消息内容。
 * @param {string} config.id - 下载任务的唯一标识符，用于生成下载链接。
 * @param {number} [config.records] - 匹配的记录数量，用于生成显示消息。
 * @param {string} [config.params] - 其他参数（通常是 JSON 格式的字符串），用于生成链接参数。
 * @param {string} [config.displayName] - 文件下载显示名称的备用显示名。
 * @returns {Object} 返回文件下载的详细配置信息。
 * @returns {string} downloadFileName - 最终生成的文件名。
 * @returns {string} href - 文件下载链接。
 * @returns {string} itemMsg - 匹配项目的描述消息。
 * @returns {string} downLoadFunName - 文件下载功能的显示名称。
 * @returns {string} downlodingMsg - 下载中显示的提示消息。
 * @returns {string} openPdf - PDF 文件的预览链接（如果文件类型为 PDF）。
 * @returns {string} downFileType - 文件的下载类型（如 'xlsx', 'pdf', 'docx' 等）。
 *
 *
 * console.log(config.downloadFileName); // "股东深度穿透数据-企业名称"
 * console.log(config.href); // "/Wind.WFC.Enterprise.Web/Enterprise/ExcelDownload.aspx?taskId=12345&filename=股东深度穿透数据-企业名称"
 * console.log(config.itemMsg); // "匹配公司数 : 15"
 */
export const getDownloadCfg = (item: DownloadFileResponse) => {
  try {
    let { downloadFileName, href, itemMsg, downLoadFunName, openPdf, downFileType } = getDownloadCfgDepre(item)

    switch (item.descType) {
      case 'reportSubject':
        itemMsg = getDescMsgReportSubject(item.entityName)
        break
      case 'matchCount':
        itemMsg = getDescMsgMatchCount(item.records)
      case 'exportSubject':
        itemMsg = getDescMsgExportSubject(item.entityName)
        break
    }
    if (downloadItemReportSubjectDescMsg.includes(item.name)) {
      itemMsg = getDescMsgReportSubject(item.entityName)
    }
    if (downloadItemExportSubjectDescMsg.includes(item.name)) {
      itemMsg = getDescMsgExportSubject(item.entityName)
    }
    return {
      downloadFileName, // 下载文件名称
      href,
      itemMsg,
      downLoadFunName, // 显示名称
      openPdf,
      downFileType,
    }
  } catch (error) {
    console.error(error)
    return {}
  }
}
