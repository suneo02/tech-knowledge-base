import { message } from '@wind/wind-ui'
import { myWfcAjax } from '../../api/companyApi'
import { getVipInfo } from '../../lib/utils'
import { getCompanyReportDownPage } from '@/handle/link'
import { CompanyReportConfig, ECorpReport } from '../../handle/corp/report/config'
import { pointBuriedByModule } from '../../api/pointBuried/bury'
import { getRimeOrganizationUrl, RimeTargetType } from '@/handle/link/out/rime'
import { getUrlByLinkModule, handleJumpTerminalCompatibleAndCheckPermission, LinksModule } from '@/handle/link'
import * as globalActions from '../../actions/global'
import store from '../../store/store'
import { CompanyReportExportItem } from '../../components/company/intro/report/comp'
import { ReportDownBtn } from '../../components/company/intro/report/comp/DownBtn'
import { Button } from '@wind/wind-ui'
import { downloadCompanySampleReport } from '../../handle/corp/report/handle'
import intl from '../../utils/intl'
import doc_gqctfx from '../../assets/imgs/doc_gqctfx.png'
import excel_gqctfx from '../../assets/imgs/excel_gqctfx.png'
import doc_gqctfx_en from '../../assets/imgs/doc_gqctfx_en.png'
import excel_gqctfx_en from '../../assets/imgs/excel_gqctfx_en.png'
import { pointBuriedGel } from '../../api/configApi'
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
        message.info(intl('245503', '该功能暂未开放'))
      } else {
        message.info('很抱歉，该功能仅SVIP用户可用。')
      }
      return
    }
  } else if (!userVipInfo.isVip) {
    if (wftCommon.is_overseas_config) {
      message.info(intl('245503', '该功能暂未开放'))
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
  var params = {
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
  var noAccessTips = ''
  var noMoreAccessTips = ''
  var downUrl = ''
  var pdfCmd = ''
  switch (type) {
    case 'share':
      pdfCmd = 'createtrackdoctask'
      downType = ''
      downTypeName = '股东深度穿透报告'
      downUrl = ''
      noAccessTips = [
        '购买SVIP，每年可导出10000家企业的股东深度穿透报告',
        '购买SVIP，每年可导出10000家企业的股东深度穿透报告',
        '购买SVIP，每年可导出10000家企业的股东深度穿透报告',
      ]
      noMoreAccessTips = ['您本年度导出企业股东深度穿透报告的额度已用完。', '本年度额度已用完']
      break
    case 'stock':
      pdfCmd = 'createsharepdf'
      downType = 'share'
      downTypeName = intl('224217', '股权穿透分析报告')
      downUrl =
        'http://host/Wind.WFC.Enterprise.Web/PC.Front/Company/GQCTRP.html?companycode=' +
        entityId +
        '&from=openBu3&lang=cn&sssss=1230'
      noAccessTips = [
        intl('224219', '购买VIP，每年可导出5000家企业的股权穿透分析报告'),
        intl('224222', '购买SVIP，每年可导出10000家企业的股权穿透分析报告'),
        intl('224225', '购买VIP/SVIP企业套餐，每年可导出5000/10000家企业的股权穿透分析报告'),
      ]
      noMoreAccessTips = [intl('24268', '您本年度导出企业报告的额度已用完。'), intl('224262', '本年度额度已用完')]
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
export const showExportReportModal = ({ companycode, corpName, onlyInvestTree = false, linkSourceRIME = false }) => {
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

  const ReportsCfg = [
    {
      title: window.en_access_config ? intl('224217', '股权穿透分析报告') + ' - Excel' : '股东深度穿透报告Excel版',
      tips: intl('397318', '深度核查股东结构，表格展示层级和链路更清晰，默认6层股东穿透'),
      ifSvip: true,
      buttons: (
        <>
          <ReportDownBtn
            onClick={() =>
              downloadReport({
                id: 'share',
                onlysvip: 'svip',
                corpName,
                companycode,
              })
            }
            iconName="doc_excel"
          />
          <Button onClick={() => downloadCompanySampleReport(ECorpReport.EquityPenetrationSixLayer)}>
            {intl('265681', '查看样例')}
          </Button>
        </>
      ),
      imgSrc: window.en_access_config ? excel_gqctfx_en : excel_gqctfx,
    },
    {
      title: intl('224217', '股权穿透分析报告'),
      tips: intl('438535', '层层挖掘企业股东信息，默认6层股东穿透'),
      ifSvip: true,
      buttons: (
        <>
          <ReportDownBtn
            onClick={() =>
              downloadReport({
                id: 'stockReport',
                onlysvip: 'svip',
                corpName,
                companycode,
              })
            }
          />
          <Button onClick={() => downloadSampleReport('stock')}>{intl('265681', '查看样例')}</Button>
        </>
      ),
      imgSrc: window.en_access_config ? doc_gqctfx_en : doc_gqctfx,
    },
  ]

  const Reports = ReportsCfg.map((cfg) => (
    <CompanyReportExportItem
      key={cfg.title}
      title={cfg.title}
      tips={cfg.tips}
      ifSvip={cfg.ifSvip}
      buttons={cfg.buttons}
      imgSrc={cfg.imgSrc}
    />
  ))

  store.dispatch(
    globalActions.setGolbalModal({
      className: 'share-invest-report-modal',
      visible: true,
      onCancel: () => store.dispatch(globalActions.clearGolbalModal()),
      title: intl('265689', '导出报告'),
      content: <div className="share-invest-report-modal--group">{Reports}</div>,
      footer: null,
    })
  )
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
