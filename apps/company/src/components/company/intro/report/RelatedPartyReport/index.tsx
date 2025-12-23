import { pointBuriedNew } from '@/api/configApi'
import { commonBuryList } from '@/api/pointBuried/config'
import { ECorpReport } from '@/handle/corp/report/config'
import { downloadCompanySampleReport } from '@/handle/corp/report/handle/handle'
import { Button, Radio } from '@wind/wind-ui'
import React, { FC, useEffect, useMemo, useState } from 'react'
import RelatedPartyReportImg from '../../../../../assets/imgs/RelatedPartyReportImg.png'
import RelatedPartyReportImgEn from '../../../../../assets/imgs/RelatedPartyReportImgEn.png'
import intl from '../../../../../utils/intl'
import { CheckSampleIntl, CompanyReportExportItem } from '../comp'
import { ReportExcelDownBtn } from '../comp/DownBtn'
import {
  downloadRelatedPartyReport,
  getIfCorpFinancial,
  RelatedPartyReportRule,
  RelatedPartyReportRuleCode,
  RelatedPartyReportRuleTitle,
} from './handle'
import './index.less'

export * from './handle'

const StylePrefix = 'related-report-export'
export const RelatedPartyReport: FC<{
  companyCode: string
  companyName: string
}> = ({ companyCode, companyName }) => {
  const [exchangeRule, setExchangeRule] = useState(RelatedPartyReportRule.CorpAccount)
  const [isFinancial, setIsFinancial] = useState(false)
  useEffect(() => {
    getIfCorpFinancial(companyCode)
      .then((res) => {
        setIsFinancial(Boolean(res))
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])
  const RelatedPartyReportRuleOptions = useMemo(() => {
    return [
      {
        value: RelatedPartyReportRule.CorpAccount,
        title: RelatedPartyReportRuleTitle[RelatedPartyReportRule.CorpAccount],
      },
      {
        value: RelatedPartyReportRule.Shanghai,
        title: RelatedPartyReportRuleTitle[RelatedPartyReportRule.Shanghai],
      },
      {
        value: RelatedPartyReportRule.Shenzhen,
        title: RelatedPartyReportRuleTitle[RelatedPartyReportRule.Shenzhen],
      },
      {
        value: RelatedPartyReportRule.Bank,
        title: RelatedPartyReportRuleTitle[RelatedPartyReportRule.Bank],
        disabled: !isFinancial, // 不是银保监是disable
      },
    ]
  }, [RelatedPartyReportRule, RelatedPartyReportRuleTitle, isFinancial])

  const handleChange = (e) => {
    try {
      const { moduleId: buryModuleId, opActive, describe } = commonBuryList.find((res) => res.moduleId === 922602101019)
      pointBuriedNew(buryModuleId, {
        opActive,
        opEntity: describe,
        ruleName: RelatedPartyReportRuleTitle[e.target.value],
      })
    } catch (e) {
      console.error(e)
    }
    setExchangeRule(e.target.value)
  }
  return (
    <CompanyReportExportItem
      className={StylePrefix}
      title={intl('390334', '关联方认定报告')}
      tips={intl('390336', '依据最新法律法规，深度探查企业关联关系')}
      ifSvip={true}
      buttons={
        <>
          <Radio.Group onChange={handleChange} value={exchangeRule} data-uc-id="nBWY6Ud4-" data-uc-ct="radio">
            {RelatedPartyReportRuleOptions.map((item) => (
              <Radio
                key={item.value}
                value={item.value}
                disabled={item.disabled}
                data-uc-id="FWLTAgAoOo"
                data-uc-ct="radio"
                data-uc-x={item.value}
              >
                {item.title}
              </Radio>
            ))}
          </Radio.Group>
          <div className={`${StylePrefix}--footer-btns`}>
            <ReportExcelDownBtn
              onClick={() =>
                downloadRelatedPartyReport(companyCode, companyName, RelatedPartyReportRuleCode[exchangeRule])
              }
              data-uc-id="EArv40FGeW"
              data-uc-ct="reportexceldownbtn"
            />
            <Button
              onClick={() => downloadCompanySampleReport(ECorpReport.RelatedPartyRP)}
              data-uc-id="MRRsDGVN2G"
              data-uc-ct="button"
            >
              {CheckSampleIntl}
            </Button>
          </div>
        </>
      }
      imgSrc={window.en_access_config ? RelatedPartyReportImgEn : RelatedPartyReportImg}
      data-uc-id="Jfl5ytWKGH"
      data-uc-ct="companyreportexportitem"
    />
  )
}
