import { createRequestByPath } from '@/api/request'
import { CorpBasicNumFront } from '@/types/corpDetail'
import { Modal } from '@wind/wind-ui'
import { useRequest } from 'ahooks'
import cn from 'classnames'
import { CorpBasicInfo, CorpBasicNumStock } from 'gel-types'
import { filterRPByBasicNum } from 'gel-util/corp'
import { t } from 'gel-util/intl'
import React, { FC, useEffect, useMemo } from 'react'
import { CompanyReportConfig, ECorpReport } from '../../../../handle/corp/report/config'
import { CompanyReportExportItem } from './comp'
import './index.less'
import { RelatedPartyReport } from './RelatedPartyReport'
import {
  getClickHelpData,
  getCreditReportData,
  getInnovationCapabilityReportData,
  getInvestReportData,
  getLiveEditData,
  getRelatedPartyData,
  getShareReportData,
  getShareTwelveReportData,
  getStockReportData,
} from './ReportsComp'
import { ReportCompProps } from './type'

const StylePrefix = 'company-intro-report-export-modal'

const ReportGroup: FC<{
  className?: string
  companycode: string
  companyid: string
  onClickCallHelp: () => void
  company: {
    baseInfo?: CorpBasicInfo
  }
  basicNum: CorpBasicNumFront
}> = ({ companycode, onClickCallHelp, company, basicNum }) => {
  const { data: basicNumStockData, run: runBasicNumStock } = useRequest(
    createRequestByPath('detail/company/getentbasicnum'),
    {
      manual: true,
    }
  )
  useEffect(() => {
    runBasicNumStock({
      id: companycode,
      params: {
        type: 'stock',
      },
    })
  }, [])
  const basicNumStock = useMemo(() => basicNumStockData?.Data as CorpBasicNumStock, [basicNumStockData])
  const CreditReportData: ReportCompProps = getCreditReportData(companycode, company)

  const StockReportData: ReportCompProps = getStockReportData(companycode, company)

  const ShareReportData: ReportCompProps = getShareReportData(companycode, company)
  const ShareTwelveReportData: ReportCompProps = getShareTwelveReportData(companycode)

  const ClickHelpData: ReportCompProps = getClickHelpData(onClickCallHelp)

  const LiveEditData: ReportCompProps = getLiveEditData(companycode)
  const InvestReportData: ReportCompProps = getInvestReportData(companycode, company)
  const RelatedPartyData: ReportCompProps = getRelatedPartyData()
  const InnovationCapabilityReportData: ReportCompProps = getInnovationCapabilityReportData(companycode)

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
  ].filter((item) => filterRPByBasicNum(item.enum, basicNum, basicNumStock))

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
        data-uc-id="ziZlOtqO1"
        data-uc-ct="companyreportexportitem"
        data-uc-x={cfg.title}
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
  basicNum: CorpBasicNumFront
}> = ({ open, setOpen, companycode, companyid, onClickCallHelp, company, basicNum }) => {
  const Footer = (
    <div className={`${StylePrefix}--footer`}>
      {t('472574', '*SVIP用户每年可导出10,000份企业报告，VIP用户每年可导出5,000份企业报告（不包仅SVIP可用的报告类型）')}
    </div>
  )
  return (
    <Modal
      className={StylePrefix}
      visible={open}
      onCancel={() => setOpen(false)}
      title={t('440315', '导出报告')}
      footer={Footer}
      data-uc-id="-EvOEcK-G1M"
      data-uc-ct="modal"
    >
      <ReportGroup
        companycode={companycode}
        companyid={companyid}
        onClickCallHelp={onClickCallHelp}
        company={company}
        basicNum={basicNum}
        data-uc-id="zqIQmQod2B"
        data-uc-ct="reportgroup"
      />
    </Modal>
  )
}
