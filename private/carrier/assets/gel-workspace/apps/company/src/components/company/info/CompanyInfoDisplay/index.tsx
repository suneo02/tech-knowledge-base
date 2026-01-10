/** @format */
import { getCorpInfoDefaultRows } from '@/components/company/info/default.tsx'
import { getCorpAreaByAreaCode } from '@/handle/corp/corpArea'
import { Skeleton, Tabs } from '@wind/wind-ui'
import Table from '@wind/wind-ui-table'
import { useRequest } from 'ahooks'
import { CorpCardInfo } from 'gel-types'
import React, { useMemo } from 'react'
import { getFundInfo, getManagerInfo } from '../../../../api/companyApi'
import intl from '../../../../utils/intl'
import { UpdateTimeButton } from '../../components/UpdateTimeButton'
import { CorpInfoTitle } from '../CorpInfoTitle'
import { CorpBasicInfoWithFund, getFundInfoRows, getManagerInfoRows } from '../FundInfo'
import { CorpBasicInfoFront, getCorpInfoRowsByCorpTypeId, handleCorpInfoRowsDefaultRender } from '../handle'
import { getCorpInfoRowsByArea } from '../rowsByNation/handle'
import { getCorpInfoRowsByOrg } from '../rowsByOrgType/handle'
import styles from './index.module.less'

const { HorizontalTable } = Table
const PREFIX = 'company-info-display'

export interface CompanyInfoDisplayProps {
  baseInfo: Partial<CorpBasicInfoFront>
  corpHeaderInfo?: Partial<CorpCardInfo>
  companycode?: string
  onClickFeedback?: () => void
  isLoading?: boolean
  enCorpInfo?: Partial<CorpBasicInfoFront>
}

const FundInfoTabContent: React.FC<{ corpId: string }> = ({ corpId }) => {
  const { data, loading } = useRequest(() => getFundInfo(corpId))
  console.log('🚀 ~ FundInfoTabContent ~ data:', data)

  const rows = useMemo(() => {
    return getFundInfoRows(data?.Data || {})
  }, [data])

  return (
    <HorizontalTable
      style={{ minHeight: '100px', whiteSpace: 'pre-wrap' }}
      bordered={'default'}
      className={`${styles[`${PREFIX}-show`]} table-custom-module-readyed`}
      loading={loading}
      rows={rows}
      dataSource={data?.Data || {}}
      data-uc-id="fundInfoTable"
      data-uc-ct="horizontaltable"
    />
  )
}

const ManagerInfoTabContent: React.FC<{ corpId: string }> = ({ corpId }) => {
  const { data, loading } = useRequest(() => getManagerInfo(corpId))

  const rows = useMemo(() => getManagerInfoRows(data?.Data || {}), [data])

  return (
    <HorizontalTable
      style={{ minHeight: '100px', whiteSpace: 'pre-wrap' }}
      bordered={'default'}
      className={`${styles[`${PREFIX}-show`]} table-custom-module-readyed`}
      loading={loading}
      rows={rows}
      dataSource={data?.Data || {}}
      data-uc-id="managerInfoTable"
      data-uc-ct="horizontaltable"
    />
  )
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
  console.log('🚀 ~ CompanyInfoDisplay ~ baseInfo:', baseInfo)
  // Show Skeleton if loading and no data
  if (isLoading && (!baseInfo || Object.keys(baseInfo).length === 0)) {
    return (
      <div className={`module-title ${styles[`${PREFIX}-title-overview`]}`} data-custom-id={'showCompanyInfo'}>
        <Skeleton animation rows={5} />
      </div>
    )
  }

  let rows = getCorpInfoDefaultRows(baseInfo, onClickFeedback)

  const rowsByCorpTypeId = getCorpInfoRowsByCorpTypeId(baseInfo)
  if (rowsByCorpTypeId) {
    rows = rowsByCorpTypeId
  }

  let updateDiv = <UpdateTimeButton corpUpdateTime={corpHeaderInfo?.corp_update_time} corpId={baseInfo?.corp_id} />

  const corpArea = getCorpAreaByAreaCode(baseInfo?.areaCode)
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

  const fundInfo = displayData
  console.log('🚀 ~ CompanyInfoDisplay ~ fundInfo:', fundInfo)

  // Correct logic: show if true
  const isFund = fundInfo?.peFundAmacRegistrationStatus === '1'
  const isManager = fundInfo?.peFundManagerRegistrationStatus === '1'

  const renderContent = () => {
    if (corpArea) {
      return (
        <HorizontalTable
          bordered={'default'}
          className={`${styles[`${PREFIX}-show`]} table-custom-module-readyed`}
          title={headDiv}
          rows={rows}
          dataSource={baseInfo || {}}
          data-uc-id="CDH06AEEY"
          data-uc-ct="horizontaltable"
        />
      )
    }

    const defaultTable = (
      <HorizontalTable
        style={{ minHeight: '100px', whiteSpace: 'pre-wrap' }}
        bordered={'default'}
        className={`${styles[`${PREFIX}-show`]} table-custom-module-readyed`}
        loading={isLoading}
        title={!isFund && !isManager ? headDiv : null}
        rows={rows}
        dataSource={displayData}
        data-uc-id="klykSxjC1g"
        data-uc-ct="horizontaltable"
      />
    )

    if (isFund || isManager) {
      const secondTabTitle = isFund ? intl('', '基金备案信息 [基协]') : intl('', '登记基金管理人[基协]')
      const SecondTabContent = isFund ? FundInfoTabContent : ManagerInfoTabContent

      return (
        <div className={`${styles[`${PREFIX}-tabs`]}`}>
          <Tabs defaultActiveKey="1" type="line" className="custom-tabs" tabBarExtraContent={updateDiv}>
            <Tabs.TabPane
              tab={
                <span style={{ color: '#333', fontWeight: 'bold', cursor: 'default' }}>
                  <CorpInfoTitle corpArea={corpArea} orgType={baseInfo?.configType} />
                </span>
              }
              key="title"
              disabled
            />
            <Tabs.TabPane tab="工商信息" key="1">
              {defaultTable}
            </Tabs.TabPane>
            <Tabs.TabPane tab={secondTabTitle} key="2">
              <SecondTabContent corpId={baseInfo?.corp_id} />
            </Tabs.TabPane>
          </Tabs>
        </div>
      )
    }

    return defaultTable
  }

  return (
    <div className={`${styles[`${PREFIX}-container`]}`}>
      <div className={`module-title ${styles[`${PREFIX}-title-overview`]}`} data-custom-id={'showCompanyInfo'}>
        {intl('138663', '基础信息')}
      </div>
      {renderContent()}
    </div>
  )
}
