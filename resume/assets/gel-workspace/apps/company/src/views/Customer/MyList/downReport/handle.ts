// 从jquery迁移过来的逻辑
import { getWsid } from '@/utils/env'
import { wftCommon } from '@/utils/utils.tsx'
import qs from 'qs'
import intl from '../../../../utils/intl'
import { handleBatchDocTaskFeature } from './handleBatchDocTaskFeature'

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
export const getConfig = ({
  name: downLoadFun,
  created,
  downloadFileName,
  entityName,
  id,
  records,
  params,
  displayName,
}) => {
  const date = wftCommon.format(created)

  let name = '我的批量导出数据文件-' + date,
    href = '',
    itemMsg = intl('142024', '匹配公司数') + ' : ' + (records ? records : '--'),
    downLoadFunName = '',
    downloadingMsg = intl('233324', '文件生成中，请稍后'),
    openPdf,
    downFileType = 'xlsx'

  if (downLoadFun == 'doc_task_stocktrack') {
    name = '股东深度穿透数据-' + entityName
    name = downloadFileName || name
    href = '/Wind.WFC.Enterprise.Web/Enterprise/ExcelDownload.aspx?taskId=' + id + '&filename=' + name
  } else if (downLoadFun == 'doc_task_investtrack') {
    name = downloadFileName || '投资穿透数据-' + entityName
    name = downloadFileName || name
    href = '/Wind.WFC.Enterprise.Web/Enterprise/ExcelDownload.aspx?taskId=' + id + '&filename=' + name
  } else if (downLoadFun == 'corp_list_and_rank') {
    name = intl('360953', '榜单名录导出-') + entityName || ''
    name = downloadFileName || name
    href = '/Wind.WFC.Enterprise.Web/Enterprise/ExcelDownload.aspx?taskId=' + id + '&filename=' + name
  } else if (downLoadFun == 'batch_report_task') {
    name = '企业深度信用报告导出-' + date
    name = downloadFileName || name
    href = '/Wind.WFC.Enterprise.Web/Enterprise/ExcelDownload.aspx?taskId=' + id + '&filename=' + name + '&suffix=zip'
  } else if (downLoadFun == 'doc_task_track') {
    name = '股东深度穿透报告_' + entityName
    name = downloadFileName || name
    href = '/Wind.WFC.Enterprise.Web/Enterprise/ExcelDownload.aspx?taskId=' + id + '&filename=' + name
  } else if (downLoadFun == 'doc_task_ipodoc') {
    name = 'IPO股东核查报告(' + entityName.replace(/,/, '-') + ')'
    name = downloadFileName || name
    href = '/Wind.WFC.Enterprise.Web/Enterprise/ExcelDownload.aspx?taskId=' + id + '&filename=' + name
  } else if (downLoadFun == 'doc_task_investpromise_corp') {
    name = '间接机构股东调查表&承诺函'
    name = downloadFileName || name
    href = '/Wind.WFC.Enterprise.Web/Enterprise/ExcelDownload.aspx?taskId=' + id + '&filename=' + name + '&suffix=docx'
  } else if (downLoadFun == 'doc_task_investpromise_person') {
    name = '间接自然人股东调查表&承诺函'
    name = downloadFileName || name
    href = '/Wind.WFC.Enterprise.Web/Enterprise/ExcelDownload.aspx?taskId=' + id + '&filename=' + name + '&suffix=docx'
  } else {
    if (
      downLoadFun == 'doc_task_ipograph2' ||
      downLoadFun == 'doc_task_ipograph3' ||
      downLoadFun == 'doc_task_ipograph4' ||
      downLoadFun == 'doc_task_ipograph5'
    ) {
      name = '关联方图谱导出_' + entityName
      name = downloadFileName || name
    }
    if (downLoadFun === 'tracing_stock_level') {
      name = downloadFileName || name
    }
    href = '/Wind.WFC.Enterprise.Web/Enterprise/ExcelDownload.aspx?taskId=' + id + '&filename=' + name
  }
  const fileType = [intl('204685', '企业数据导出'), intl('204686', '企业名单导出'), '企业深度信用导出']
  if (downLoadFun.indexOf('batch_doc_task_feature_') == 0) {
    downLoadFunName = handleBatchDocTaskFeature(downLoadFun, downLoadFunName)
  } else {
    switch (downLoadFun) {
      case 'technological_score': {
        downLoadFunName = intl('391713', '企业科创能力报告')
        itemMsg = intl('222468', '报告主体') + ' : ' + (entityName ? entityName : '--')
        const wordFileDown = entityName ? downLoadFunName + '-' + entityName : downLoadFunName
        href =
          '/Wind.WFC.Enterprise.Web/Enterprise//gel/download/getfile/downloadfilewithtaskid?taskId=' +
          id +
          '&filename=' +
          wordFileDown +
          '&suffix=docx'
        break
      }
      case 'doc_task_ipograph5':
        downLoadFunName = '关联方图谱导出(银保监规则)'
        itemMsg =
          (window.en_access_config ? 'Export Subject' : window.en_access_config ? 'Export Subject' : '导出主体') +
          ' : ' +
          (entityName ? entityName : '--')
        break
      case 'doc_task_ipograph4':
        downLoadFunName = '关联方图谱导出(企业会计准则)'
        itemMsg = (window.en_access_config ? 'Export Subject' : '导出主体') + ' : ' + (entityName ? entityName : '--')
        break
      case 'doc_task_ipograph3':
        downLoadFunName = '关联方图谱导出(深交所规则)'
        itemMsg = (window.en_access_config ? 'Export Subject' : '导出主体') + ' : ' + (entityName ? entityName : '--')
        break
      case 'doc_task_ipograph2':
        downLoadFunName = '关联方图谱导出(上交所规则)'
        itemMsg = (window.en_access_config ? 'Export Subject' : '导出主体') + ' : ' + (entityName ? entityName : '--')
        break
      case 'cross_filter_doc_task':
        downLoadFunName = intl('204686', '企业名单导出') + '(企业数据浏览器)'
        break
      case 'doc_task_invest':
        downLoadFunName = '控股企业导出'
        itemMsg = (window.en_access_config ? 'Export Subject' : '导出主体') + ' : ' + (entityName ? entityName : '--')
        break
      case 'doc_task_investpromise_corp':
        downLoadFunName = '间接机构股东调查表&承诺函'
        itemMsg = intl('222468', '报告主体') + ' : ' + (entityName ? entityName : '--')
        break
      case 'doc_task_investpromise_person':
        downLoadFunName = '间接自然人股东调查表&承诺函'
        itemMsg = intl('222468', '报告主体') + ' : ' + (entityName ? entityName : '--')
        break
      case 'paid_doc_task_deepfilter':
        downLoadFunName =
          intl('204686', '企业名单导出') + '(' + intl('222402', '超级名单') + '-' + intl('224232', '深度筛选') + ')'
        break
      case 'batch_doc_task_corpsearch':
        downLoadFunName = intl('204686', '企业名单导出') + '(' + intl('233322', '公司搜索') + ')'
        break
      case 'batch_doc_task_corplist':
        downLoadFunName = intl('252965', '榜单名录') + '(' + intl('138216', '企业列表') + ')'
        break
      case 'batch_doc_task':
        downLoadFunName = fileType[0] + '(' + intl('141998', '批量查询') + ')'
        break
      case 'batch_doc_task_advancesearch':
        downLoadFunName = fileType[1] + intl('223900', '企业筛选')
        break
      case 'batch_doc_task_patent':
        downLoadFunName = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('138749', '专利')
        break
      case 'batch_doc_task_trademark':
        downLoadFunName = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('138799', '商标')
        break
      case 'batch_doc_task_software':
        downLoadFunName = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('138788', '软件著作权')
        break
      case 'batch_doc_task_production':
        downLoadFunName = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('138756', '作品著作权')
        break
      case 'batch_doc_task_judgeinfo':
        downLoadFunName = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('138731', '裁判文书')
        break
      case 'batch_doc_task_court':
        downLoadFunName = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('138226', '法院公告')
        break
      case 'batch_doc_task_trial':
        downLoadFunName = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('138657', '开庭公告')
        break
      case 'batch_doc_task_shareholder':
        downLoadFunName = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('32959', '股东')
        break
      case 'batch_doc_task_invest':
        downLoadFunName = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('138724', '对外投资')
        break
      case 'batch_doc_task_benefit':
        downLoadFunName = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('138180', '最终受益人')
        break
      case 'batch_doc_task_beneficialOwner':
        downLoadFunName = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + '最终受益人(受益所有人)'
        break
      case 'batch_doc_task_beneficialNaturalPerson':
        downLoadFunName = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + '最终受益人(受益自然人)'
        break
      case 'batch_doc_task_beneficialOrg':
        downLoadFunName = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + '最终受益人(受益机构)'
        break
      case 'batch_doc_task_ctrl':
        downLoadFunName = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('451208', '控股企业')
        break
      case 'batch_doc_task_mistrust':
        downLoadFunName = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('138591', '失信信息')
        break
      case 'batch_doc_task_inspection':
        downLoadFunName = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('138467', '抽查检查')
        break
      case 'batch_doc_task_execution':
        downLoadFunName = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('138592', '被执行人')
        break
      case 'batch_doc_task_punish':
        downLoadFunName = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('138647', '行政处罚')
        break
      case 'batch_doc_task_member':
        downLoadFunName = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('138503', '主要人员')
        break
      case 'batch_doc_task_hisshareholder':
        downLoadFunName = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('138326', '历史股东')
        break
      case 'batch_doc_task_hismanager':
        downLoadFunName = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('138323', '历史法人高管')
        break
      case 'batch_doc_task_groupsystem':
        downLoadFunName = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('148609', '所属集团系')
        break
      case 'batch_doc_task_branch':
        downLoadFunName = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('138183', '分支机构')
        break
      case 'batch_doc_task_sharedbonds':
        downLoadFunName = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + '最新发债'
        break
      case 'batch_doc_task_standinfo':
        downLoadFunName = fileType[0] + '(' + intl('145880', '批量导出') + ') - ' + intl('326113', '标准信息')
        break
      case 'batch_doc_task_aml_benefit': //反洗钱核查
        downLoadFunName = '反洗钱核查 - 最终受益人'
        break
      case 'batch_doc_task_aml_shareholder':
        downLoadFunName = '反洗钱核查 - 股东穿透'
        break
      case 'batch_doc_task_aml_invest':
        downLoadFunName = '反洗钱核查 - 对外投资穿透'
        break
      case 'batch_doc_task_aml_ctrl':
        downLoadFunName = '反洗钱核查 - 控股企业'
        break
      case 'batch_report_task':
        downLoadFunName = fileType[2] + '(' + intl('145880', '批量导出') + ')'
        break
      case 'doc_task_chain_corp':
        downLoadFunName = intl('236634', '产业链企业名单')
        break
      case 'doc_task_ipodoc':
        downLoadFunName = 'IPO股东核查报告'
        itemMsg = intl('222468', '报告主体') + ' : ' + (entityName || '--')
        break
      case 'doc_task_investtrack':
        downLoadFunName = '投资穿透报告'
        itemMsg = intl('222468', '报告主体') + ' : ' + (entityName || '--')
        downloadingMsg = intl('233330', '报告生成中，请稍后')
        break
      case 'doc_task_track':
      case 'doc_task_stocktrack':
        downLoadFunName = '股东深度穿透报告'
        itemMsg = intl('222468', '报告主体') + ' : ' + (entityName || '--')
        downloadingMsg = intl('233330', '报告生成中，请稍后')
        break
      case 'doc_task_exp_share':
        downLoadFunName = '股东深度穿透报告-样例报告'
        itemMsg = intl('222468', '报告主体') + ' : ' + (entityName || '--')
        downloadingMsg = intl('233330', '报告生成中，请稍后')
        break
      case 'single_report_task_corp':
      case 'singlecreditreport': {
        downLoadFunName = intl('338873', '企业深度信用报告')
        itemMsg = intl('222468', '报告主体') + ' : ' + (entityName || '--')
        downloadingMsg = intl('233330', '报告生成中，请稍后')
        downFileType = 'pdf'
        let pdfFileDown = entityName ? downLoadFunName + '-' + entityName : downLoadFunName
        pdfFileDown = downloadFileName || pdfFileDown
        href =
          '/Wind.WFC.Enterprise.Web/Enterprise/ExcelDownload.aspx?taskId=' +
          id +
          '&filename=' +
          pdfFileDown +
          '&suffix=pdf'
        break
      }
      case 'corp_list_and_rank':
        downLoadFunName = intl('360953', '榜单名录导出') + '-' + (entityName || '')
        break
      case 'single_report_task_exp_corp': {
        downLoadFunName = intl('357613', '企业深度信用报告-样例报告')
        itemMsg = intl('222468', '报告主体') + ' : ' + (entityName || '--')
        downloadingMsg = intl('233330', '报告生成中，请稍后')
        downFileType = 'pdf'
        let pdfFileDown = entityName ? downLoadFunName + '-' + entityName : downLoadFunName
        pdfFileDown = downloadFileName || pdfFileDown
        href =
          '/Wind.WFC.Enterprise.Web/Enterprise/ExcelDownload.aspx?taskId=' +
          id +
          '&filename=' +
          pdfFileDown +
          '&suffix=pdf'
        break
      }
      case 'single_report_task_exp_stock': {
        downLoadFunName = '股权穿透报告-样例报告'
        itemMsg = intl('222468', '报告主体') + ' : ' + (entityName || '--')
        downloadingMsg = intl('233330', '报告生成中，请稍后')
        downFileType = 'pdf'
        let pdfFileDown = entityName ? downLoadFunName + '-' + entityName : downLoadFunName
        pdfFileDown = downloadFileName || pdfFileDown
        href =
          '/Wind.WFC.Enterprise.Web/Enterprise/ExcelDownload.aspx?taskId=' +
          id +
          '&filename=' +
          pdfFileDown +
          '&suffix=pdf'
        break
      }
      case 'single_report_task_kyc':
      case 'dueDiligenceReport': {
        downLoadFunName = intl('421605', '尽职调查报告')
        itemMsg = intl('222468', '报告主体') + ' : ' + (entityName || '--')
        downloadingMsg = intl('233330', '报告生成中，请稍后')
        downFileType = 'pdf'
        let pdfFileDown = entityName != null ? downLoadFunName + '-' + entityName : downLoadFunName
        pdfFileDown = downloadFileName || pdfFileDown
        href =
          '/Wind.WFC.Enterprise.Web/Enterprise/ExcelDownload.aspx?taskId=' +
          id +
          '&filename=' +
          pdfFileDown +
          '&suffix=pdf'
        break
      }
      case 'single_report_task_share': {
        downLoadFunName = intl('222470', '股权穿透报告')
        itemMsg = intl('222468', '报告主体') + ' : ' + (entityName || '--')
        downloadingMsg = intl('233330', '报告生成中，请稍后')
        downFileType = 'pdf'
        let pdfFileDown = entityName ? downLoadFunName + '-' + entityName : downLoadFunName
        pdfFileDown = downloadFileName || pdfFileDown
        href =
          '/Wind.WFC.Enterprise.Web/Enterprise/ExcelDownload.aspx?taskId=' +
          id +
          '&filename=' +
          pdfFileDown +
          '&suffix=pdf'
        break
      }
      case 'single_report_task_senior': {
        downLoadFunName = intl('222469', '董监高对外投资与任职报告')

        itemMsg = intl('222468', '报告主体') + ' : ' + (entityName || '--')
        downloadingMsg = intl('233330', '报告生成中，请稍后')
        downFileType = 'pdf'
        let pdfFileDown = entityName ? downLoadFunName + '-' + entityName : downLoadFunName
        pdfFileDown = downloadFileName || pdfFileDown
        href =
          '/Wind.WFC.Enterprise.Web/Enterprise/ExcelDownload.aspx?taskId=' +
          id +
          '&filename=' +
          pdfFileDown +
          '&suffix=pdf'
        break
      }
      case 'single_report_task_exp_per': {
        downLoadFunName = '董监高对外投资与任职报告-样例报告'
        itemMsg = intl('222468', '报告主体') + ' : ' + (entityName || '--')
        downloadingMsg = intl('233330', '报告生成中，请稍后')
        downFileType = 'pdf'
        let pdfFileDown = entityName ? downLoadFunName + '-' + entityName : downLoadFunName
        pdfFileDown = downloadFileName || pdfFileDown
        href =
          '/Wind.WFC.Enterprise.Web/Enterprise/ExcelDownload.aspx?taskId=' +
          id +
          '&filename=' +
          pdfFileDown +
          '&suffix=pdf'
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
        downLoadFunName = yearRp + '工商年度报告'
        itemMsg = intl('222468', '报告主体') + ' : ' + (entityName || '--')
        downloadingMsg = intl('233330', '报告生成中，请稍后')
        downFileType = 'pdf'
        let pdfFileDown = entityName ? downLoadFunName + '-' + entityName : downLoadFunName
        pdfFileDown = downloadFileName || pdfFileDown
        href =
          '/Wind.WFC.Enterprise.Web/Enterprise/ExcelDownload.aspx?taskId=' +
          id +
          '&filename=' +
          pdfFileDown +
          '&suffix=pdf'
        break
      }
      case 'market_guide': {
        downLoadFunName = intl('265710', '企业KYC报告')
        itemMsg = intl('222468', '报告主体') + ' : ' + (entityName || '--')
        downloadingMsg = intl('233330', '报告生成中，请稍后')
        downFileType = 'word'
        let pdfFileDown = entityName ? downLoadFunName + '-' + entityName : downLoadFunName
        pdfFileDown = downloadFileName || pdfFileDown
        href =
          '/Wind.WFC.Enterprise.Web/Enterprise/ExcelDownload.aspx?taskId=' +
          id +
          '&filename=' +
          pdfFileDown +
          '&suffix=doc'
        break
      }
      case 'market_guideexp_guide': {
        downLoadFunName = intl('364473', '企业KYC报告-样例报告')
        itemMsg = intl('222468', '报告主体') + ' : ' + (entityName || '--')
        downloadingMsg = intl('233330', '报告生成中，请稍后')
        downFileType = 'word'
        let pdfFileDown = entityName ? downLoadFunName + '-' + entityName : downLoadFunName
        pdfFileDown = downloadFileName || pdfFileDown
        href =
          '/Wind.WFC.Enterprise.Web/Enterprise/ExcelDownload.aspx?taskId=' +
          id +
          '&filename=' +
          pdfFileDown +
          '&suffix=doc'
        break
      }
      case 'batch_doc_task_bidsearch':
        downLoadFunName = '招投标公告批量导出'
        itemMsg = '匹配公告数 : ' + (records ? records : '--')
        break
    }
  }
  name = downloadFileName || name
  downLoadFunName = displayName || downLoadFunName
  // 查看pdf url
  if (downFileType == 'pdf') {
    openPdf =
      '/Wind.WFC.Enterprise.Web/Enterprise/WindSecureApi.aspx?' +
      qs.stringify({ gelmodule: 'gelpc', cmd: 'previewfile', taskId: id, fileName: name })
    // openPdf =
    //   'http://gel.wind.com.cn/export/previewpdf/' + entityName + '.pdf?' + qs.stringify({ taskId: id, fileName: name })
    if (wftCommon.isDevDebugger()) {
      const wsd = getWsid()
      openPdf = 'http://wx.wind.com.cn' + openPdf + '&' + qs.stringify({ 'wind.sessionid': wsd })
    } else {
      try {
        let tmp: any = document.cookie
        if (tmp) {
          tmp = tmp.split(';')
          if (tmp && tmp.length) {
            tmp.forEach(function (t) {
              if (t.indexOf('wind.sessionid') > -1) {
                openPdf = openPdf + '&' + t.trim()
              }
            })
          }
        }
      } catch (e) {}
    }
  }
  return {
    downloadFileName: name, // 下载文件名称
    href,
    itemMsg,
    downLoadFunName, // 显示名称
    downlodingMsg: downloadingMsg,
    openPdf,
    downFileType,
  }
}
