import { CorpBasicInfo } from '@/api/corp/info/basicInfo'
import { HorizontalTableColumns } from '@/types/WindUI/horizontalTable'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils'
import { HKrows } from './rowsByCorpTypeId/HK'
import { LSrows } from './rowsByCorpTypeId/LS'
import { getSHrows } from './rowsByCorpTypeId/SH'
import { TWrows } from './rowsByCorpTypeId/TW'
import { corpInfoUsedNamesRow } from './rowsCommon'

export type CorpBasicInfoFront = CorpBasicInfo & {
  state_zh?: CorpBasicInfo['state']
  collect_flag?: string
}

export const getCorpInfoRowsByCorpTypeId = (
  baseInfo: Partial<CorpBasicInfo>
): HorizontalTableColumns<CorpBasicInfoFront> => {
  const SHrows = getSHrows(baseInfo)
  const corptypeid = baseInfo.corp_type_id || '--'
  if (wftCommon.corpState_shList.indexOf(wftCommon.corpFroms[corptypeid]) > -1) {
    return SHrows
  } else if (corptypeid == 912034101) {
    return LSrows
  } else if (corptypeid == 298060000) {
    return HKrows
  } else if (baseInfo.areaCode == '030407') {
    return TWrows
  } else if (corptypeid == '--') {
    // loading 填充 不能用原row填充  会出现table最后一个格子自动补全bug
    return [
      [
        {
          title: intl('138677', '企业名称'),
          dataIndex: 'corp_name',
          colSpan: 3,
          render: (_txt, backData) => {
            return backData.corp_name
          },
        },
        {
          title: intl('138416', '经营状态'),
          dataIndex: 'state',
          colSpan: 1,
          render: (_txt, backData) => {
            return backData.state
          },
        },
      ],
      [
        {
          title: intl('35079', '英文名称'),
          dataIndex: 'eng_name',
          colSpan: 3,
          render: (_txt, backData) => {
            return backData.eng_name
          },
        },
        {
          title: intl('2823', '成立日期'),
          dataIndex: 'reg_date',
          render: (_txt, backData) => {
            return wftCommon.formatTime(backData.reg_date)
          },
        },
      ],
      [
        corpInfoUsedNamesRow(baseInfo),
        {
          title: intl('138157', '核准日期'),
          dataIndex: 'issue_date',
          render: (_txt, backData) => {
            return wftCommon.formatTime(backData.issue_date)
          },
        },
      ],
    ]
  }
}

/**
 * 处理 企业详情工商信息 rows 的默认渲染
 */
export const handleCorpInfoRowsDefaultRender = (rows: HorizontalTableColumns<CorpBasicInfoFront>) => {
  rows.map((row) => {
    row.map((item) => {
      if (!item.render) {
        item.render = (txt) => {
          if (!txt) {
            if (txt === 0 || txt === '0') {
              return 0
            }
            return '--'
          }
          return txt
        }
      }
    })
  })
}
