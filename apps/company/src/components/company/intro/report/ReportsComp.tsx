import { Button } from '@wind/wind-ui'
import React from 'react'
import { pointBuriedGel } from '../../../../api/configApi'
import intl from '../../../../utils/intl'

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
import { DocEditIcon } from '@/components/common/Icon/DocEdit'
import { handleJumpTerminalCompatibleAndCheckPermission } from '@/handle/link'
import { STATIC_FILE_PATH } from '@/locales/constants'
import { isDev } from '@/utils/env'
import { downloadFile } from '@/utils/utils'
import { isEn } from 'gel-util/intl'
import { generateUrlByModule, LinkModule } from 'gel-util/link'
import { pointBuriedByModule } from '../../../../api/pointBuried/bury'
import { CompanyReportConfig, ECorpReport } from '../../../../handle/corp/report/config'
import {
  checkVIPReportExport,
  downloadCompanyReport,
  downloadCompanySampleReport,
  downloadReport,
  downloadSample,
} from '../../../../handle/corp/report/handle'
import { downloadTZCTReport } from '../../../../views/Charts/handle'
import { CheckSampleIntl } from './comp'
import { ReportDownBtn, ReportExcelDownBtn } from './comp/DownBtn'
import './index.less'
import { ReportCompProps } from './type'

const StylePrefix = 'company-intro-report-export-modal'

type CompanyForReport = {
  baseInfo?: Pick<CorpBasicInfo, 'corp_name' | 'eng_name'>
}
export const getCreditReportData = (companycode: string, company: CompanyForReport): ReportCompProps => ({
  enum: ECorpReport.CorpCreditRP,
  buttons: (
    <>
      <ReportDownBtn
        onClick={() => downloadReport('creditReport', undefined, companycode, company)}
        data-uc-id="ypvG9-l9a4"
        data-uc-ct="reportdownbtn"
      />
      <Button onClick={() => downloadSample('corp')} data-uc-id="SAIXP3zhxW" data-uc-ct="button">
        {CheckSampleIntl}
      </Button>
    </>
  ),
  imgSrc: isEn() ? doc_xybg_en : doc_xybg,
})

export const getStockReportData = (companycode: string, company: CompanyForReport): ReportCompProps => ({
  enum: ECorpReport.EquityPenetrationAnalysisRP,
  ifSvip: true,
  buttons: (
    <>
      <ReportDownBtn
        onClick={() => downloadReport('stockReport', 'svip', companycode, company)}
        data-uc-id="v_9yhVUiZt"
        data-uc-ct="reportdownbtn"
      />

      <Button onClick={() => downloadSample('stock')} data-uc-id="F6XF7_17oN" data-uc-ct="button">
        {CheckSampleIntl}
      </Button>
    </>
  ),
  imgSrc: isEn() ? doc_gqctfx_en : doc_gqctfx,
})

export const getShareReportData = (companycode: string, company: CompanyForReport): ReportCompProps => ({
  enum: ECorpReport.EquityPenetrationSixLayer,
  ifSvip: true,
  buttons: (
    <>
      <ReportExcelDownBtn
        onClick={() => downloadReport('share', 'svip', companycode, company)}
        data-uc-id="nT_sLIHxtk"
        data-uc-ct="reportexceldownbtn"
      />
      <Button
        onClick={() => downloadCompanySampleReport(ECorpReport.EquityPenetrationSixLayer)}
        data-uc-id="ts1Qp3tobN"
        data-uc-ct="button"
      >
        {CheckSampleIntl}
      </Button>
    </>
  ),
  imgSrc: isEn() ? excel_gqctfx_en : doc_gqct_six,
})
export const getShareTwelveReportData = (companycode: string): ReportCompProps => ({
  enum: ECorpReport.EquityPenetrationTwelveLayer,
  ifSvip: true,
  buttons: (
    <>
      <ReportExcelDownBtn
        onClick={() => downloadCompanyReport(ECorpReport.EquityPenetrationTwelveLayer, true, companycode)}
        data-uc-id="jjHyViaTZ1B"
        data-uc-ct="reportexceldownbtn"
      />
      <Button
        onClick={() => {
          const cfg = CompanyReportConfig[ECorpReport.EquityPenetrationTwelveLayer]
          downloadFile(STATIC_FILE_PATH + cfg.sampleFilePath, cfg.sampleFileName)
        }}
        data-uc-id="uVUaB1rQO8"
        data-uc-ct="button"
      >
        {CheckSampleIntl}
      </Button>
    </>
  ),
  imgSrc: isEn() ? doc_gqct_twelve_en : doc_gqct_twelve,
})

export const getClickHelpData = (onClickCallHelp: () => void): ReportCompProps => ({
  enum: ECorpReport.EquityPenetrationUnlimited,
  buttons: (
    <Button className="btn-icon" onClick={onClickCallHelp} data-uc-id="pzXDRzUj-J" data-uc-ct="button">
      <span>{isEn() ? intl('234937', '联系客户经理') : intl('', '联系客户经理定制报告')}</span>
    </Button>
  ),
  imgSrc: isEn() ? doc_gqct_en : doc_gqct,
})

export const getLiveEditData = (companycode: string): ReportCompProps => ({
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
        data-uc-id="P3TYdFTfJh"
        data-uc-ct="button"
      >
        <DocEditIcon className={`${StylePrefix}--icon`} />
        <span>{intl('472575', '在线编辑')}</span>
      </Button>
    </>
  ),
  imgSrc: isEn() ? doc_jzdc_en : doc_jzdc,
})
export const getInvestReportData = (companycode: string, company: CompanyForReport): ReportCompProps => ({
  enum: ECorpReport.InvestmentPenetrationRP,
  ifSvip: true,
  buttons: (
    <>
      <ReportExcelDownBtn
        onClick={() => downloadTZCTReport(company.baseInfo?.corp_name, companycode)}
        data-uc-id="O_foEqfIRl2"
        data-uc-ct="reportexceldownbtn"
      />
      <Button onClick={() => downloadSample('INVESTMENT_PENETRATION')} data-uc-id="awvEGvAppp" data-uc-ct="button">
        {CheckSampleIntl}
      </Button>
    </>
  ),
  imgSrc: isEn() ? investment_penetration_report_en : investment_penetration_report,
})
export const getRelatedPartyData = (): ReportCompProps => ({
  // 该项特殊处理
  enum: ECorpReport.RelatedPartyRP,
  buttons: null,
  imgSrc: null,
})
export const getInnovationCapabilityReportData = (companycode: string): ReportCompProps => {
  const reportEnum = ECorpReport.InnovationCapabilityRP
  const cfg = CompanyReportConfig[reportEnum]
  return {
    enum: reportEnum,
    ifSvip: cfg.ifSvip,
    buttons: (
      <>
        <ReportExcelDownBtn
          onClick={() => downloadCompanyReport(reportEnum, cfg.ifSvip, companycode)}
          data-uc-id="QVQEhAW1hVv"
          data-uc-ct="reportexceldownbtn"
        />
        <Button onClick={() => downloadCompanySampleReport(reportEnum)} data-uc-id="glHaYJDDdA" data-uc-ct="button">
          {CheckSampleIntl}
        </Button>
      </>
    ),
    imgSrc: isEn() ? innovationCapabilityEn : innovationCapability,
  }
}
