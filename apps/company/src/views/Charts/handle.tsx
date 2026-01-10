import {
  getCompanyReportDownPage,
  getUrlByLinkModule,
  handleJumpTerminalCompatibleAndCheckPermission,
  LinksModule,
} from '@/handle/link'
import { getRimeOrganizationUrl, RimeTargetType } from '@/handle/link/out/rime'
import { message } from '@wind/wind-ui'
import { myWfcAjax } from '../../api/companyApi'
import { pointBuriedGel } from '../../api/configApi'
import { pointBuriedByModule } from '../../api/pointBuried/bury'
import { CompanyReportConfig, ECorpReport } from '../../handle/corp/report/config'
import { getVipInfo } from '../../lib/utils'
import intl from '../../utils/intl'
import { wftCommon } from '../../utils/utils'

const exportSuccessHandler = () => {
  message.success(intl('420140', '正在为您导出...'))
  setTimeout(function () {
    window.open(getCompanyReportDownPage())
  }, 500)
}

/**
 * 投资穿透报告
 * @param {*} corpName
 * @returns
 */
export const downloadTZCTReport = (corpName, companycode) => {
  const params = {
    entityId: companycode,
    entityName: corpName,
    type: 'investtrack',
    depth: '6',
  }

  const userVipInfo = getVipInfo()
  if (!userVipInfo.isVip) {
    message.info('很抱歉，该功能仅VIP/SVIP用户可用。')
    return
  }

  const reportCfg = CompanyReportConfig[ECorpReport.InvestmentPenetrationRP]
  if (reportCfg && reportCfg.downModuleId != null) {
    pointBuriedByModule(reportCfg.downModuleId)
  }

  myWfcAjax('createtrackdoctask', params).then((data) => {
    if (data.ErrorCode == '0') {
      exportSuccessHandler()
    }
  })
}

/**
 * 跳转企业 or 人物
 * @param {*} id
 * @param {*} isCompany
 * @param {*} isPerson
 * @param {*} linkSourceRIME
 */
export const linkToCompany = (id, isCompany, isPerson, linkSourceRIME) => {
  if (isCompany) {
    if (linkSourceRIME) {
      handleJumpTerminalCompatibleAndCheckPermission(getRimeOrganizationUrl({ id }))
      return
    }
    handleJumpTerminalCompatibleAndCheckPermission(
      getUrlByLinkModule(LinksModule.COMPANY, {
        id,
      })
    )
  } else if (isPerson) {
    if (linkSourceRIME) {
      handleJumpTerminalCompatibleAndCheckPermission(getRimeOrganizationUrl({ id, type: RimeTargetType.PERSON }))
      return
    }
    handleJumpTerminalCompatibleAndCheckPermission(
      getUrlByLinkModule(LinksModule.CHARACTER, {
        id,
      })
    )
  }
}

/**
 * 下载报告
 * @param {string} id - 报告ID
 * @param {boolean} onlysvip - 是否仅SVIP可用
 * @param {string} corpName - 公司名称
 * @param {string} companycode - 公司代码
 */
export const downloadReport = ({ id, onlysvip, corpName, companycode }) => {
  const userVipInfo = getVipInfo()

  if (onlysvip) {
    if (!userVipInfo.isSvip) {
      if (wftCommon.is_overseas_config) {
        message.info(intl('478600', '该功能暂未开放'))
      } else {
        message.info('很抱歉，该功能仅SVIP用户可用。')
      }
      return
    }
  } else if (!userVipInfo.isVip) {
    if (wftCommon.is_overseas_config) {
      message.info(intl('478600', '该功能暂未开放'))
      return
    }
    message.info('很抱歉，该功能仅VIP/SVIP用户可用。')
    return
  }

  var downType = ''
  var entityName = corpName
  var entityId = companycode
  var downUrl = ''
  var pdfCmd = ''
  var selVal = ''
  switch (id) {
    case 'share':
      pdfCmd = 'createtrackdoctask'
      selVal = '6'
      downType = 'stocktrack'
      downUrl = ''

      pointBuriedGel('922602100653', '股东深度穿透报告', 'reportEx')
      break
    case 'stockReport':
      pdfCmd = 'createsharepdf'
      downType = 'share'
      downUrl =
        'http://host/Wind.WFC.Enterprise.Web/PC.Front/Company/GQCTRP.html?companycode=' +
        companycode +
        '&from=openBu3&lang=cn&sssss=1230'

      pointBuriedGel('922602100653', '股权穿透分析报告', 'reportEx')
      break
    default:
      return
  }
  var params: {
    url: string
    entityName: string
    entityId: string
    depth?: string
    type?: string
  } = {
    url: downUrl,
    entityName: entityName,
    entityId: entityId,
  }
  if (pdfCmd == 'createtrackdoctask') {
    params.depth = selVal
  }
  if (downType == 'stocktrack') {
    params.type = downType
  }
  myWfcAjax(pdfCmd, params).then((res) => {
    if (res.ErrorCode == '0') {
      exportSuccessHandler()
    }
  })
}

/**
 * 下载样例报告
 * @param {string} type - 报告类型
 */
export const downloadSampleReport = (type) => {
  var downType = 'corp'
  var ajaxType = 'exp_' + type
  var downTypeName = ''
  var entityName = window.en_access_config ? 'Xiaomi Inc.' : '华为公司'
  var entityId = '0A1047934153793'
  var downUrl = ''
  var pdfCmd = ''
  switch (type) {
    case 'share':
      pdfCmd = 'createtrackdoctask'
      downType = ''
      downTypeName = '股东深度穿透报告'
      downUrl = ''

      break
    case 'stock':
      pdfCmd = 'createsharepdf'
      downType = 'share'
      downTypeName = intl('224217', '股权穿透分析报告')
      downUrl =
        'http://host/Wind.WFC.Enterprise.Web/PC.Front/Company/GQCTRP.html?companycode=' +
        entityId +
        '&from=openBu3&lang=cn&sssss=1230'

      break
    default:
      return
  }
  var params = {
    url: downUrl,
    email: '',
    entityName: entityName,
    entityId: entityId,
    type: ajaxType,
  }
  myWfcAjax(pdfCmd, params).then((res) => {
    if (res.ErrorCode == '0') {
      exportSuccessHandler()
    }
  })
}

/**
 * 显示导出报告弹窗
 * @param {Object} params 参数对象
 * @param {string} params.companycode 公司代码
 * @param {string} params.corpName 公司名称
 * @param {boolean} params.onlyInvestTree 是否仅投资树
 * @param {boolean} params.linkSourceRIME 是否来自RIME
 * @param {Function} params.downloadReport 下载报告的方法
 * @param {Function} params.downloadSample 下载样例的方法
 */
export const showExportReportModal = ({
  companycode,
  corpName,
  onlyInvestTree = false,
  linkSourceRIME = false,
  openModal,
}: {
  companycode: string
  corpName: string
  onlyInvestTree?: boolean
  linkSourceRIME?: boolean
  openModal: () => void
}) => {
  if (onlyInvestTree) {
    // 投资穿透报告
    downloadTZCTReport(corpName, companycode)
    return
  }

  if (linkSourceRIME) {
    const rimeMsg = { name: 'gel-click', type: 'gqctChartExport', id: companycode }
    window.parent.postMessage(JSON.stringify(rimeMsg), '*')
    return
  }

  openModal()
}

export const exportRelateChart = ({ companyCode, selType, companyName, linkSourceRIME = false }) => {
  pointBuriedByModule(922602100957)
  if (linkSourceRIME) {
    const rimeMsg = { name: 'gel-click', type: 'glgxChartExport', id: wftCommon.formatCompanyCode(companyCode) }
    window.parent.postMessage(JSON.stringify(rimeMsg), '*')
    return
  }

  return myWfcAjax('createiporelationdoc', {
    entityId: wftCommon.formatCompanyCode(companyCode),
    refresh: selType,
    entityName: companyName,
  }).then(
    (data) => {
      if (data.ErrorCode == '0') {
        exportSuccessHandler()
      }
      return data
    },
    () => {
      message.error('导出失败, 请稍后重试')
      return null
    }
  )
}
