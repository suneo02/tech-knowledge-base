import React from 'react'
import SimpleHorizontalTable, { SimpleRowItem } from '@/components/table/horizontal/Simple'
import { GetIntegratedCircuitLayoutDetailResponse } from '@/api/paths'
import { t } from 'gel-util/intl'
import { LinksModule } from '@/handle/link'

// const PREFIX = 'ic-layout-basic-info'
const STRINGS = {
  IC_LAYOUT_NAME: t('452496', '布图设计名称'),
  IC_LAYOUT_REGISTER_NUMBER: t('452497', '布图设计登记号'),
  IC_LAYOUT_APPLICATION_DATE: t('452498', '布图设计申请日'),
  IC_LAYOUT_ANNOUNCEMENT_NUMBER: t('452499', '公告号'),
  IC_LAYOUT_ANNOUNCEMENT_DATE: t('32903', '公告日期'),
  IC_LAYOUT_CREATION_COMPLETION_DATE: t('452479', '布图设计创作完成日'),
  IC_LAYOUT_FIRST_BUSINESS_APPLICATION_DATE: t('452480', '布图设计首次商业利用日'),
  IC_LAYOUT_PROTECTION_END_DATE: t('452500', '布图设计保护期届满日'),
  IC_LAYOUT_WAIVER_EFFECTIVE_DATE: t('452501', '主动放弃生效日'),
  IC_LAYOUT_RIGHTS_HOLDER: t('452502', '布图设计权利人'),
  IC_LAYOUT_CREATOR: t('452481', '布图设计创作人'),
  IC_LAYOUT_AGENCY: t('138136', '代理机构'),
  IC_LAYOUT_AGENT: t('452503', '代理人'),
}

const ROWS: SimpleRowItem[][] = [
  [{ title: STRINGS.IC_LAYOUT_NAME, dataIndex: 'name', colSpan: 3 }],
  [
    { title: STRINGS.IC_LAYOUT_REGISTER_NUMBER, dataIndex: 'registerNumber' },
    { title: STRINGS.IC_LAYOUT_APPLICATION_DATE, dataIndex: 'applicationDate', renderParams: { type: 'date' } },
  ],
  [
    { title: STRINGS.IC_LAYOUT_ANNOUNCEMENT_NUMBER, dataIndex: 'announcementNumber' },
    { title: STRINGS.IC_LAYOUT_ANNOUNCEMENT_DATE, dataIndex: 'announcementDate', renderParams: { type: 'date' } },
  ],
  [
    {
      title: STRINGS.IC_LAYOUT_CREATION_COMPLETION_DATE,
      dataIndex: 'creationCompletionDate',
      renderParams: { type: 'date' },
    },
    {
      title: STRINGS.IC_LAYOUT_FIRST_BUSINESS_APPLICATION_DATE,
      dataIndex: 'firstBusinessApplicationDate',
      renderParams: { type: 'date' },
    },
  ],
  [
    { title: STRINGS.IC_LAYOUT_PROTECTION_END_DATE, dataIndex: 'protectionEndDate', renderParams: { type: 'date' } },
    {
      title: STRINGS.IC_LAYOUT_WAIVER_EFFECTIVE_DATE,
      dataIndex: 'waiverEffectiveDate',
      renderParams: { type: 'date' },
    },
  ],
  [
    {
      title: STRINGS.IC_LAYOUT_RIGHTS_HOLDER,
      dataIndex: 'rightsHolder',
      renderParams: { type: 'link', linksModule: LinksModule.COMPANY },
    },
    {
      title: STRINGS.IC_LAYOUT_CREATOR,
      dataIndex: 'creator',
      renderParams: { type: 'link', linksModule: LinksModule.COMPANY },
    },
  ],
  [
    {
      title: STRINGS.IC_LAYOUT_AGENCY,
      dataIndex: 'agency',
      renderParams: { type: 'link', linksModule: LinksModule.COMPANY },
    },
    {
      title: STRINGS.IC_LAYOUT_AGENT,
      dataIndex: 'agent',
      renderParams: { type: 'link', linksModule: LinksModule.COMPANY },
    },
  ],
]
const IcLayoutBasicInfo: React.FC<{ data: GetIntegratedCircuitLayoutDetailResponse['baseInfo'] }> = ({ data }) => {
  return <SimpleHorizontalTable rows={ROWS} dataSource={data} />
}

export default IcLayoutBasicInfo
