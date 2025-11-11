import { wftCommon } from '@/utils/utils'
import { DownloadFileResponse } from 'gel-api'
import { t } from 'gel-util/intl'
import intl from '../../../../utils/intl'
import { getDownloadUrl, getDownloadUrlWithTaskId } from './downUrl'
import { handleBatchDocTaskFeature } from './handleBatchDocTaskFeature'
import { getDescMsgMatchCount, getDescMsgReportSubject } from './itemDescMsg'
import { getOpenPdfUrl } from './misc'

type DownFileType = 'pdf' | 'word' | 'xlsx'

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
export const getDownloadCfgDepre = ({
  name: downLoadFun,
  created,
  downloadFileName,
  entityName,
  id,
  records,
  params,
  displayName,
}: DownloadFileResponse) => {
  try {
    const date = wftCommon.format(created)

    let downFileNameParsed = `${t('417167', '我的批量导出数据文件')}-${date}`,
      href = '',
      descMsg = getDescMsgMatchCount(records),
      displayNameParsed = `${t('417167', '我的批量导出数据文件')}-${date}`,
      openPdf

    let downFileType: DownFileType = downloadFileName?.endsWith('.pdf')
      ? 'pdf'
      : downloadFileName?.endsWith('.doc') || downloadFileName?.endsWith('.docx')
        ? 'word'
        : 'xlsx'

    if (downLoadFun == 'doc_task_stocktrack') {
      downFileNameParsed = '股东深度穿透数据-' + entityName
      downFileNameParsed = downloadFileName || downFileNameParsed
      href = getDownloadUrl(id, downFileNameParsed)
    } else if (downLoadFun == 'corp_list_and_rank') {
      downFileNameParsed = intl('360953', '榜单名录导出-') + entityName || ''
      downFileNameParsed = downloadFileName || downFileNameParsed
      href = getDownloadUrl(id, downFileNameParsed)
    } else if (downLoadFun == 'batch_report_task') {
      downFileNameParsed = '企业深度信用报告导出-' + date
      downFileNameParsed = downloadFileName || downFileNameParsed
      href = getDownloadUrl(id, downFileNameParsed, 'zip')
    } else if (downLoadFun == 'doc_task_track') {
      downFileNameParsed = '股东深度穿透报告_' + entityName
      downFileNameParsed = downloadFileName || downFileNameParsed
      href = getDownloadUrl(id, downFileNameParsed)
    } else if (downLoadFun == 'doc_task_ipodoc') {
      downFileNameParsed = 'IPO股东核查报告(' + entityName.replace(/,/, '-') + ')'
      downFileNameParsed = downloadFileName || downFileNameParsed
      href = getDownloadUrl(id, downFileNameParsed)
    } else if (downLoadFun == 'doc_task_investpromise_corp') {
      downFileNameParsed = '间接机构股东调查表&承诺函'
      downFileNameParsed = downloadFileName || downFileNameParsed
      href = getDownloadUrl(id, downFileNameParsed, 'docx')
    } else if (downLoadFun == 'doc_task_investpromise_person') {
      downFileNameParsed = '间接自然人股东调查表&承诺函'
      downFileNameParsed = downloadFileName || downFileNameParsed
      href = getDownloadUrl(id, downFileNameParsed, 'docx')
    } else {
      href = getDownloadUrl(id, downloadFileName || downFileNameParsed)
    }
    const fileType = [intl('204685', '企业数据导出'), intl('204686', '企业名单导出'), '企业深度信用导出']
    if (downLoadFun.indexOf('batch_doc_task_feature_') == 0) {
      displayNameParsed = handleBatchDocTaskFeature(downLoadFun, displayNameParsed)
    } else {
      switch (downLoadFun) {
        case 'technological_score': {
          displayNameParsed = intl('391713', '企业科创能力报告')
          descMsg = getDescMsgReportSubject(entityName)
          const wordFileDown = entityName ? displayNameParsed + '-' + entityName : displayNameParsed
          href = getDownloadUrlWithTaskId(id, wordFileDown, 'docx')
          break
        }
        case 'cross_filter_doc_task':
          displayNameParsed = intl('204686', '企业名单导出') + '(企业数据浏览器)'
          break
        case 'doc_task_investpromise_corp':
          displayNameParsed = '间接机构股东调查表&承诺函'
          descMsg = getDescMsgReportSubject(entityName)
          break
        case 'doc_task_investpromise_person':
          displayNameParsed = '间接自然人股东调查表&承诺函'
          descMsg = getDescMsgReportSubject(entityName)
          break
        case 'paid_doc_task_deepfilter':
          displayNameParsed =
            intl('204686', '企业名单导出') + '(' + intl('222402', '超级名单') + '-' + intl('224232', '深度筛选') + ')'
          break
        case 'batch_doc_task_corpsearch':
          displayNameParsed = intl('204686', '企业名单导出') + '(' + intl('233322', '公司搜索') + ')'
          break
        case 'batch_doc_task_corplist':
          displayNameParsed = intl('252965', '榜单名录') + '(' + intl('138216', '企业列表') + ')'
          break
        case 'batch_doc_task':
          displayNameParsed = fileType[0] + '(' + intl('141998', '批量查询') + ')'
          break
        case 'batch_doc_task_advancesearch':
          displayNameParsed = fileType[1] + intl('223900', '企业筛选')
          break
        case 'batch_doc_task_patent':
          displayNameParsed = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('138749', '专利')
          break
        case 'batch_doc_task_trademark':
          displayNameParsed = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('138799', '商标')
          break
        case 'batch_doc_task_software':
          displayNameParsed = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('138788', '软件著作权')
          break
        case 'batch_doc_task_production':
          displayNameParsed = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('138756', '作品著作权')
          break
        case 'batch_doc_task_judgeinfo':
          displayNameParsed = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('138731', '裁判文书')
          break
        case 'batch_doc_task_court':
          displayNameParsed = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('138226', '法院公告')
          break
        case 'batch_doc_task_trial':
          displayNameParsed = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('138657', '开庭公告')
          break
        case 'batch_doc_task_shareholder':
          displayNameParsed = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('32959', '股东')
          break
        case 'batch_doc_task_invest':
          displayNameParsed = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('138724', '对外投资')
          break
        case 'batch_doc_task_benefit':
          displayNameParsed = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('138180', '最终受益人')
          break
        case 'batch_doc_task_beneficialOwner':
          displayNameParsed = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + '最终受益人(受益所有人)'
          break
        case 'batch_doc_task_beneficialNaturalPerson':
          displayNameParsed = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + '最终受益人(受益自然人)'
          break
        case 'batch_doc_task_beneficialOrg':
          displayNameParsed = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + '最终受益人(受益机构)'
          break
        case 'batch_doc_task_ctrl':
          displayNameParsed = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('451208', '控股企业')
          break
        case 'batch_doc_task_mistrust':
          displayNameParsed = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('138591', '失信信息')
          break
        case 'batch_doc_task_inspection':
          displayNameParsed = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('138467', '抽查检查')
          break
        case 'batch_doc_task_execution':
          displayNameParsed = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('138592', '被执行人')
          break
        case 'batch_doc_task_punish':
          displayNameParsed = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('138647', '行政处罚')
          break
        case 'batch_doc_task_member':
          displayNameParsed = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('138503', '主要人员')
          break
        case 'batch_doc_task_hisshareholder':
          displayNameParsed = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('138326', '历史股东')
          break
        case 'batch_doc_task_hismanager':
          displayNameParsed = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('138323', '历史法人高管')
          break
        case 'batch_doc_task_groupsystem':
          displayNameParsed = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('148609', '所属集团系')
          break
        case 'batch_doc_task_branch':
          displayNameParsed = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('138183', '分支机构')
          break
        case 'batch_doc_task_sharedbonds':
          displayNameParsed = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + '最新发债'
          break
        case 'batch_doc_task_standinfo':
          displayNameParsed = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('326113', '标准信息')
          break
        case 'batch_doc_task_aml_benefit': //反洗钱核查
          displayNameParsed = '反洗钱核查 - 最终受益人'
          break
        case 'batch_doc_task_aml_shareholder':
          displayNameParsed = '反洗钱核查 - 股东穿透'
          break
        case 'batch_doc_task_aml_invest':
          displayNameParsed = '反洗钱核查 - 对外投资穿透'
          break
        case 'batch_doc_task_aml_ctrl':
          displayNameParsed = '反洗钱核查 - 控股企业'
          break
        case 'batch_report_task':
          displayNameParsed = fileType[2] + '(' + intl('145880', '批量导出') + ')'
          break
        case 'doc_task_chain_corp':
          displayNameParsed = intl('236634', '产业链企业名单')
          break
        case 'doc_task_ipodoc':
          displayNameParsed = 'IPO股东核查报告'
          descMsg = getDescMsgReportSubject(entityName)
          break
        case 'doc_task_track':
        case 'doc_task_stocktrack':
          displayNameParsed = '股东深度穿透报告'
          descMsg = getDescMsgReportSubject(entityName)

          break
        case 'doc_task_exp_share':
          displayNameParsed = '股东深度穿透报告-样例报告'
          descMsg = getDescMsgReportSubject(entityName)

          break
        case 'single_report_task_corp':
        case 'singlecreditreport': {
          displayNameParsed = intl('338873', '企业深度信用报告')
          descMsg = getDescMsgReportSubject(entityName)

          downFileType = 'pdf'
          let pdfFileDown = entityName ? displayNameParsed + '-' + entityName : displayNameParsed
          pdfFileDown = downloadFileName || pdfFileDown
          href = getDownloadUrlWithTaskId(id, pdfFileDown, 'pdf')
          break
        }
        case 'corp_list_and_rank':
          displayNameParsed = intl('360953', '榜单名录导出') + '-' + (entityName || '')
          break
        case 'single_report_task_exp_stock': {
          displayNameParsed = '股权穿透报告-样例报告'
          descMsg = getDescMsgReportSubject(entityName)

          downFileType = 'pdf'
          let pdfFileDown = entityName ? displayNameParsed + '-' + entityName : displayNameParsed
          pdfFileDown = downloadFileName || pdfFileDown
          href = getDownloadUrlWithTaskId(id, pdfFileDown, 'pdf')
          break
        }
        case 'single_report_task_kyc':
        case 'dueDiligenceReport': {
          displayNameParsed = intl('421605', '尽职调查报告')
          descMsg = getDescMsgReportSubject(entityName)

          downFileType = 'pdf'
          let pdfFileDown = entityName != null ? displayNameParsed + '-' + entityName : displayNameParsed
          pdfFileDown = downloadFileName || pdfFileDown
          href = getDownloadUrlWithTaskId(id, pdfFileDown, 'pdf')
          break
        }
        case 'single_report_task_share': {
          displayNameParsed = intl('222470', '股权穿透报告')
          descMsg = getDescMsgReportSubject(entityName)

          downFileType = 'pdf'
          let pdfFileDown = entityName ? displayNameParsed + '-' + entityName : displayNameParsed
          pdfFileDown = downloadFileName || pdfFileDown
          href = getDownloadUrlWithTaskId(id, pdfFileDown, 'pdf')
          break
        }
        case 'single_report_task_senior': {
          displayNameParsed = intl('222469', '董监高对外投资与任职报告')

          descMsg = getDescMsgReportSubject(entityName)

          downFileType = 'pdf'
          let pdfFileDown = entityName ? displayNameParsed + '-' + entityName : displayNameParsed
          pdfFileDown = downloadFileName || pdfFileDown
          href = getDownloadUrlWithTaskId(id, pdfFileDown, 'pdf')
          break
        }
        case 'single_report_task_exp_per': {
          displayNameParsed = '董监高对外投资与任职报告-样例报告'
          descMsg = getDescMsgReportSubject(entityName)

          downFileType = 'pdf'
          let pdfFileDown = entityName ? displayNameParsed + '-' + entityName : displayNameParsed
          pdfFileDown = downloadFileName || pdfFileDown
          href = getDownloadUrlWithTaskId(id, pdfFileDown, 'pdf')
          break
        }
        case 'single_report_task_annualreport': {
          params = JSON.parse(params).url.split('?')[1].split('&')
          const paramObj = {}
          if (params) {
            for (let k1 = 0; k1 < params.length; k1++) {
              paramObj[params[k1].split('=')[0]] = params[k1].split('=')[1]
            }
          }
          const yearRp = paramObj['year'] ? paramObj['year'] + '年' : ''
          displayNameParsed = yearRp + '工商年度报告'
          descMsg = getDescMsgReportSubject(entityName)

          downFileType = 'pdf'
          let pdfFileDown = entityName ? displayNameParsed + '-' + entityName : displayNameParsed
          pdfFileDown = downloadFileName || pdfFileDown
          href = getDownloadUrlWithTaskId(id, pdfFileDown, 'pdf')
          break
        }
        case 'market_guide': {
          displayNameParsed = intl('265710', '企业KYC报告')
          descMsg = getDescMsgReportSubject(entityName)

          downFileType = 'word'
          let pdfFileDown = entityName ? displayNameParsed + '-' + entityName : displayNameParsed
          pdfFileDown = downloadFileName || pdfFileDown
          href = getDownloadUrlWithTaskId(id, pdfFileDown, 'doc')
          break
        }
        case 'market_guideexp_guide': {
          displayNameParsed = intl('364473', '企业KYC报告-样例报告')
          descMsg = getDescMsgReportSubject(entityName)

          downFileType = 'word'
          let pdfFileDown = entityName ? displayNameParsed + '-' + entityName : displayNameParsed
          pdfFileDown = downloadFileName || pdfFileDown
          href = getDownloadUrlWithTaskId(id, pdfFileDown, 'doc')
          break
        }
        case 'batch_doc_task_bidsearch':
          displayNameParsed = '招投标公告批量导出'
          descMsg = getDescMsgMatchCount(records)
          break
      }
    }
    downFileNameParsed = downloadFileName || downFileNameParsed
    displayNameParsed = displayName || displayNameParsed
    // 查看pdf url
    if (downFileType == 'pdf') {
      openPdf = getOpenPdfUrl(String(id), downFileNameParsed)
    }
    return {
      downloadFileName: downFileNameParsed, // 下载文件名称
      href,
      itemMsg: descMsg,
      downLoadFunName: displayNameParsed, // 显示名称
      openPdf,
      downFileType,
    }
  } catch (error) {
    console.error(error)
    return {}
  }
}
