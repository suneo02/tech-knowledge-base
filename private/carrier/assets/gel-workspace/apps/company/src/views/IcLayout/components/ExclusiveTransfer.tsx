import { GetIntegratedCircuitLayoutDetailResponse } from '@/api/paths'
import React from 'react'
import { AlignTypeEnum } from '@/components/configurable/types/emun'
import { Links } from '@/components/common/links'
import { LinksModule } from '@/handle/link'
import { t } from 'gel-util/intl'
import MergedTable from '@/components/table/MergedTable'

const STRINGS = {
  INDEX: t('28846', '序号'),
  ANNOUNCEMENT_DATE: t('32903', '公告日期'),
  CHANGE_TYPE: t('175419', '变更类型'),
  CHANGE_CONTENT: t('354859', '变更内容'),
  CHANGE_BEFORE: t('451202', '变更前'),
  CHANGE_AFTER: t('451203', '变更后'),
  REMARK: t('1919', '备注'),
}

const IcLayoutExclusiveTransfer: React.FC<{
  data: GetIntegratedCircuitLayoutDetailResponse['exclusiveTransferRecords']
}> = ({ data }) => {
  const columns: any = [
    {
      title: STRINGS.INDEX,
      dataIndex: 'index',
      width: 50,
      align: AlignTypeEnum.CENTER,
      render: (_: any, __: any, index: number) => {
        // Find the record for the current row
        let recordIndex = -1
        let count = 0
        for (let i = 0; i < data?.length; i++) {
          const r = data[i]
          const itemCount = r.contentItems?.length || 1
          if (index < count + itemCount) {
            recordIndex = i
            break
          }
          count += itemCount
        }
        return recordIndex + 1
      },
    },
    {
      title: STRINGS.ANNOUNCEMENT_DATE,
      dataIndex: 'announcementDate',
      width: 100,
    },

    {
      title: STRINGS.CHANGE_TYPE,
      dataIndex: 'type',
      width: 120,
    },
    {
      title: STRINGS.CHANGE_CONTENT,
      dataIndex: 'content',
      render: (value: any) => value || '--',
    },
    {
      title: STRINGS.CHANGE_BEFORE,
      dataIndex: 'before',
      render: (value: any[]) =>
        value?.length
          ? value?.map((b, index) => (
              <div key={index}>
                <Links module={LinksModule.COMPANY} id={b.windId} title={b.name || '--'} useUnderline />
              </div>
            ))
          : '--',
    },
    {
      title: STRINGS.CHANGE_AFTER,
      dataIndex: 'after',
      render: (value: any[]) =>
        value?.length
          ? value?.map((a, index) => (
              <div key={index}>
                <Links module={LinksModule.COMPANY} id={a.windId} title={a.name || '--'} useUnderline />
              </div>
            ))
          : '--',
    },
    {
      title: STRINGS.REMARK,
      dataIndex: 'changeEffectiveDate',
      width: 100,
    },
  ]
  return (
    <MergedTable
      dataSource={data}
      columns={columns}
      mergeKey="contentItems"
      mergedColumnDataIndexes={['index', 'announcementDate', 'type', 'changeEffectiveDate']}
      pagination={false}
      bordered="vertical-horizontal"
      striped={false}
      data-uc-id="Yy8WXLT41Fi"
      data-uc-ct="mergedtable"
    />
  )
}

export default IcLayoutExclusiveTransfer
