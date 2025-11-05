import { Button, Modal } from '@wind/wind-ui'
import React, { FC, useMemo } from 'react'
import { pointBuriedGel } from '../../../../api/configApi'
import intl from '../../../../utils/intl'
import { MyIcon } from '../../../Icon'

import { downloadCompanyReport, downloadCompanySampleReport } from '@/handle/corp/report/handle/handle'
import doc_gqct from '../../../../assets/imgs/doc_gqct.png'
import doc_gqct_en from '../../../../assets/imgs/doc_gqct_en.png'
import doc_gqct_six from '../../../../assets/imgs/doc_gqct_six.png'
import doc_gqct_twelve from '../../../../assets/imgs/doc_gqct_tewlve.png'
import doc_gqct_twelve_en from '../../../../assets/imgs/doc_gqct_tewlve_en.png'
import doc_gqctfx from '../../../../assets/imgs/doc_gqctfx.png'
import doc_gqctfx_en from '../../../../assets/imgs/doc_gqctfx_en.png'
import doc_jzdc from '../../../../assets/imgs/doc_jzdc.png'
import doc_jzdc_en from '../../../../assets/imgs/doc_jzdc_en.png'
import doc_xybg from '../../../../assets/imgs/doc_xybg.png'
import doc_xybg_en from '../../../../assets/imgs/doc_xybg_en.png'
import excel_gqctfx_en from '../../../../assets/imgs/excel_gqctfx_en.png'
import innovationCapability from '../../../../assets/imgs/innovationCapability.png'
import innovationCapabilityEn from '../../../../assets/imgs/innovationCapabilityEn.png'
import investment_penetration_report from '../../../../assets/imgs/investment_penetration_report.png'
import investment_penetration_report_en from '../../../../assets/imgs/investment_penetration_report_en.png'

import { CorpBasicInfo } from '@/api/corp/info/basicInfo.ts'
import { ICorpBasicNumFront } from '@/handle/corp/basicNum/type.ts'
import { handleJumpTerminalCompatibleAndCheckPermission } from '@/handle/link'
import { STATIC_FILE_PATH } from '@/locales/constants'
import { isDev } from '@/utils/env'
import { downloadFile } from '@/utils/utils'
import cn from 'classnames'
import { generateUrlByModule, LinkModule } from 'gel-util/link'
import { pointBuriedByModule } from '../../../../api/pointBuried/bury'
import { CompanyReportConfig, ECorpReport } from '../../../../handle/corp/report/config'
import { checkVIPReportExport, downloadReport, downloadSample } from '../../../../handle/corp/report/handle'
import { downloadTZCTReport } from '../../../../views/Charts/handle'
import { RelatedPartyReport } from './RelatedPartyReport'
import { CheckSampleIntl, CompanyReportExportItem } from './comp'
import { ReportDownBtn } from './comp/DownBtn'
import './index.less'

const StylePrefix = 'company-intro-report-export-modal'

interface ReportCfg {
  enum: ECorpReport
  buttons: React.ReactNode
  imgSrc: string
  ifSvip?: boolean
}

const ReportGroup: FC<{
  className?: string
  companycode: string
  companyid: string
  onClickCallHelp: () => void
  company: {
    baseInfo?: CorpBasicInfo
  }
  basicNum: ICorpBasicNumFront
}> = ({ companycode, onClickCallHelp, company, basicNum }) => {
  function filterRP(item: ReportCfg) {
    try {
      const cfg = CompanyReportConfig[item.enum]
      // 1. 如果 cfg.modelNum 不存在，直接返回 true
      if (!cfg.modelNum) {
        return true
      }

      const rawVal = basicNum[cfg.modelNum]

      // 3. 如果原始值能转为数字并且大于0，则返回 true
      const num = Number(rawVal)
      if (!Number.isNaN(num) && num > 0) {
        return true
      }

      // 4. 否则返回 false
      return false
    } catch (e) {
      console.error(e)
      return false
    }
  }

  const CreditReportData: ReportCfg = {
    enum: ECorpReport.CorpCreditRP,
    buttons: (
      <>
        <ReportDownBtn onClick={() => downloadReport('creditReport', undefined, companycode, company)} />
        <Button onClick={() => downloadSample('corp')}>{CheckSampleIntl}</Button>
      </>
    ),
    imgSrc: window.en_access_config ? doc_xybg_en : doc_xybg,
  }

  const StockReportData: ReportCfg = {
    enum: ECorpReport.EquityPenetrationAnalysisRP,
    ifSvip: true,
    buttons: (
      <>
        <ReportDownBtn onClick={() => downloadReport('stockReport', 'svip', companycode, company)} />

        <Button onClick={() => downloadSample('stock')}>{CheckSampleIntl}</Button>
      </>
    ),
    imgSrc: window.en_access_config ? doc_gqctfx_en : doc_gqctfx,
  }

  const ShareReportData: ReportCfg = {
    enum: ECorpReport.EquityPenetrationSixLayer,
    ifSvip: true,
    buttons: (
      <>
        <ReportDownBtn onClick={() => downloadReport('share', 'svip', companycode, company)} iconName="doc_excel" />
        <Button onClick={() => downloadSample('share')}>{CheckSampleIntl}</Button>
      </>
    ),
    imgSrc: window.en_access_config ? excel_gqctfx_en : doc_gqct_six,
  }
  const ShareTwelveReportData: ReportCfg = {
    enum: ECorpReport.EquityPenetrationTwelveLayer,
    ifSvip: true,
    buttons: (
      <>
        <ReportDownBtn
          onClick={() => downloadCompanyReport(ECorpReport.EquityPenetrationTwelveLayer, true, companycode)}
          iconName="doc_excel"
        />
        <Button 
          onClick={() => {
            const cfg = CompanyReportConfig[ECorpReport.EquityPenetrationTwelveLayer]
            downloadFile(STATIC_FILE_PATH + cfg.sampleFilePath, cfg.sampleFileName)
          }}
        >
          {CheckSampleIntl}
        </Button>
      </>
    ),
    imgSrc: window.en_access_config ? doc_gqct_twelve_en : doc_gqct_twelve,
  }

  const ClickHelpData: ReportCfg = {
    enum: ECorpReport.EquityPenetrationUnlimited,
    buttons: (
      <Button className="btn-icon" onClick={onClickCallHelp}>
        <span>{window.en_access_config ? intl('234937', '联系客户经理') : intl('', '联系客户经理定制报告')}</span>
      </Button>
    ),
    imgSrc: window.en_access_config ? doc_gqct_en : doc_gqct,
  }

  const LiveEditData: ReportCfg = {
    enum: ECorpReport.DDRP,
    ifSvip: true,
    buttons: (
      <>
        <Button
          className="btn-icon btn-icon-pdf"
          onClick={() => {
            pointBuriedGel('922602100653', '尽职调查报告高级版', 'reportEx')
            pointBuriedByModule(922602101010)

            if (checkVIPReportExport(true)) {
              handleJumpTerminalCompatibleAndCheckPermission(
                generateUrlByModule({
                  module: LinkModule.CREDIT_RP_PREVIEW,
                  params: {
                    companyCode: companycode,
                  },
                  isDev: isDev,
                })
              )
            }
          }}
        >
          <MyIcon name="doc_edit" className={`${StylePrefix}--icon`}></MyIcon>
          <span>{intl('349581', '在线编辑')}</span>
        </Button>
      </>
    ),
    imgSrc: window.en_access_config ? doc_jzdc_en : doc_jzdc,
  }
  const InvestReportData: ReportCfg = {
    enum: ECorpReport.InvestmentPenetrationRP,
    ifSvip: true,
    buttons: (
      <>
        <ReportDownBtn
          onClick={() => downloadTZCTReport(company?.baseInfo?.corp_name, companycode)}
          iconName="doc_excel"
        />
        <Button onClick={() => downloadSample('INVESTMENT_PENETRATION')}>{CheckSampleIntl}</Button>
      </>
    ),
    imgSrc: window.en_access_config ? investment_penetration_report_en : investment_penetration_report,
  }
  const RelatedPartyData: ReportCfg = {
    // 该项特殊处理
    enum: ECorpReport.RelatedPartyRP,
    buttons: null,
    imgSrc: null,
  }
  const InnovationCapabilityReportData: ReportCfg = useMemo(() => {
    const reportEnum = ECorpReport.InnovationCapabilityRP
    const cfg = CompanyReportConfig[reportEnum]
    return {
      enum: reportEnum,
      ifSvip: cfg.ifSvip,
      buttons: (
        <>
          <ReportDownBtn
            onClick={() => downloadCompanyReport(reportEnum, cfg.ifSvip, companycode)}
            iconName="doc_excel"
          />
          <Button onClick={() => downloadCompanySampleReport(reportEnum)}>{CheckSampleIntl}</Button>
        </>
      ),
      imgSrc: window.en_access_config ? innovationCapabilityEn : innovationCapability,
    }
  }, [company, companycode])

  const filteredRPData = [
    CreditReportData,
    LiveEditData,
    ShareReportData,
    ShareTwelveReportData,
    StockReportData,
    ClickHelpData,
    InvestReportData,
    RelatedPartyData,
    InnovationCapabilityReportData,
  ].filter(filterRP)

  const reportItems = filteredRPData.map((item) => {
    if (item.enum === ECorpReport.RelatedPartyRP) {
      // 特殊处理
      return (
        <RelatedPartyReport key={companycode} companyCode={companycode} companyName={company?.baseInfo?.corp_name} />
      )
    }
    const cfg = CompanyReportConfig[item.enum]
    return (
      <CompanyReportExportItem
        key={cfg.title}
        title={cfg.title}
        tips={cfg.tips}
        ifSvip={item.ifSvip}
        buttons={item.buttons}
        imgSrc={item.imgSrc}
      />
    )
  })

  return (
    <div
      className={cn(`${StylePrefix}--group`, {
        [`${StylePrefix}--group-row-2`]: filteredRPData.length > 3 && filteredRPData.length <= 6,
        [`${StylePrefix}--group-row-3`]: filteredRPData.length > 6 && filteredRPData.length <= 9,
      })}
    >
      {reportItems}
    </div>
  )
}

export const CompanyReportModal: FC<{
  open: boolean
  setOpen: (open: boolean) => void
  companycode: string
  companyid: string
  onClickCallHelp: () => void
  company: any
  basicNum: ICorpBasicNumFront
}> = ({ open, setOpen, companycode, companyid, onClickCallHelp, company, basicNum }) => {
  const Footer = (
    <div className={`${StylePrefix}--footer`}>
      *
      {intl(
        '349596',
        'SVIP用户每年可导出10,000份企业报告，VIP用户每年可导出5,000份企业报告（不包仅SVIP可用的报告类型）'
      )}
    </div>
  )
  return (
    // @ts-expect-error ttt
    <Modal
      className={StylePrefix}
      visible={open}
      onCancel={() => setOpen(false)}
      title={intl('265689', '导出报告')}
      footer={Footer}
    >
      <ReportGroup
        companycode={companycode}
        companyid={companyid}
        onClickCallHelp={onClickCallHelp}
        company={company}
        basicNum={basicNum}
      />
    </Modal>
  )
}
