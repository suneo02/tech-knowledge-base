import { createRequestByPath } from '@/api/request'
import { CompanyReportExportItem } from '@/components/company/intro/report/comp'
import { getShareReportData, getStockReportData } from '@/components/company/intro/report/ReportsComp'
import { CompanyReportConfig } from '@/handle/corp/report/config'
import { Modal } from '@wind/wind-ui'
import { useRequest } from 'ahooks'
import { CorpBasicNumStock } from 'gel-types'
import { filterRPByBasicNum } from 'gel-util/corp'
import { t } from 'gel-util/intl'
import React, { FC, useEffect, useMemo, useState } from 'react'
import './index.less'

export const GraphReportExport: FC<{
  companycode: string
  corpName: string
  open: boolean
  setOpen: (open: boolean) => void
}> = ({ companycode, corpName, open, setOpen }) => {
  const [hasFetched, setHasFetched] = useState(false)

  const { data: basicNumStockData, run: runBasicNumStock } = useRequest(
    createRequestByPath('detail/company/getentbasicnum'),
    {
      manual: true,
      onFinally: () => {
        setHasFetched(true)
      },
    }
  )
  useEffect(() => {
    // 如果打开弹窗，并且没有获取过数据，则获取数据
    if (open && !hasFetched) {
      runBasicNumStock({
        id: companycode,
        params: {
          type: 'stock',
        },
      })
    }
  }, [open])

  const basicNumStock = useMemo(() => basicNumStockData?.Data as CorpBasicNumStock, [basicNumStockData])

  const filteredReportProps = [
    getShareReportData(companycode, { baseInfo: { corp_name: corpName } }),
    getStockReportData(companycode, { baseInfo: { corp_name: corpName } }),
  ].filter((item) => filterRPByBasicNum(item.enum, undefined, basicNumStock))

  const Reports = filteredReportProps.map((item) => {
    const cfg = CompanyReportConfig[item.enum]
    return (
      <CompanyReportExportItem
        key={cfg.title}
        title={cfg.title}
        tips={cfg.tips}
        ifSvip={item.ifSvip}
        buttons={item.buttons}
        imgSrc={item.imgSrc}
        data-uc-id="g0Uy3TQWite"
        data-uc-ct="companyreportexportitem"
        data-uc-x={cfg.title}
      />
    )
  })
  return (
    <Modal
      className="share-invest-report-modal"
      title={t('440315', '导出报告')}
      visible={open}
      onCancel={() => setOpen(false)}
      footer={null}
      data-uc-id="gZ3S4yyLo82"
      data-uc-ct="modal"
    >
      <div className="share-invest-report-modal--group">{Reports}</div>
    </Modal>
  )
}
