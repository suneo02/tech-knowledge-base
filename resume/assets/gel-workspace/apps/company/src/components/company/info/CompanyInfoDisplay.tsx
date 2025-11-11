/** @format */
import { getCorpInfoDefaultRows } from '@/components/company/info/default.tsx'
import { getOverSea } from '@/handle/corp/corpArea'
import Table from '@wind/wind-ui-table'
import React from 'react'
import intl from '../../../utils/intl'
import { UpdateTimeButton } from '../components/UpdateTimeButton'
import './CompanyInfo.less'
import { CorpInfoTitle } from './CorpInfoTitle'
import { getCorpInfoRowsByCorpTypeId, handleCorpInfoRowsDefaultRender, ICorpBasicInfoFront } from './handle'
import { getCorpInfoRowsByArea } from './rowsByNation/handle'
import { getCorpInfoRowsByOrg } from './rowsByOrgType/handle'

const { HorizontalTable } = Table

export interface CompanyInfoDisplayProps {
  baseInfo: ICorpBasicInfoFront
  corpHeaderInfo?: {
    corp_update_time?: string
  }
  companycode?: string
  onClickFeedback?: () => void
  isLoading?: boolean
  enCorpInfo?: any
}

/**
 * CompanyInfoDisplay - A functional component for displaying company information
 * @param props - Component properties including company information and display settings
 */
export const CompanyInfoDisplay: React.FC<CompanyInfoDisplayProps> = ({
  baseInfo,
  corpHeaderInfo,
  onClickFeedback,
  isLoading = false,
  enCorpInfo = {},
}) => {

  let rows = getCorpInfoDefaultRows(baseInfo, onClickFeedback)

  const rowsByCorpTypeId = getCorpInfoRowsByCorpTypeId(baseInfo)
  if (rowsByCorpTypeId) {
    rows = rowsByCorpTypeId
  }

  let updateDiv = <UpdateTimeButton corpUpdateTime={corpHeaderInfo?.corp_update_time} corpId={baseInfo.corp_id} />

  const corpArea = getOverSea(baseInfo.areaCode)
  if (corpArea) {
    let newUpdateDiv, newRows
    ;({ updateDiv: newUpdateDiv, rows: newRows } = getCorpInfoRowsByArea(corpArea))
    updateDiv = newUpdateDiv
    rows = newRows
  }

  const rowsByOrg = getCorpInfoRowsByOrg(baseInfo, onClickFeedback)
  if (rowsByOrg) {
    rows = rowsByOrg
  }

  handleCorpInfoRowsDefaultRender(rows)

  const headDiv = (
    <>
      <CorpInfoTitle corpArea={corpArea} orgType={baseInfo?.configType} />
      {updateDiv}
    </>
  )

  const displayData = Object.keys(enCorpInfo).length ? enCorpInfo : baseInfo || {}

  return (
    <>
      <div className="module-title module-title-overview" data-custom-id={'showCompanyInfo'}>
        {intl('138663', '基础信息')}
      </div>
      {corpArea ? (
        <HorizontalTable
          bordered={'default'}
          className="showCompanyInfo table-custom-module-readyed"
          title={headDiv}
          rows={rows}
          dataSource={baseInfo || {}}
          data-uc-id="CDH06AEEY"
          data-uc-ct="horizontaltable"
        />
      ) : (
        <HorizontalTable
          style={{ minHeight: '100px', whiteSpace: 'pre-wrap' }}
          bordered={'default'}
          className="showCompanyInfo table-custom-module-readyed"
          loading={isLoading}
          title={headDiv}
          rows={rows}
          dataSource={displayData}
          data-uc-id="klykSxjC1g"
          data-uc-ct="horizontaltable"
        />
      )}
    </>
  )
}
