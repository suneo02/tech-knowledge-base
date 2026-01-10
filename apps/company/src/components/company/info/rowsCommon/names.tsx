// Row for "曾用名"
import { HorizontalTableCol } from '@/types/WindUI/horizontalTable.ts'
import intl from '@/utils/intl'
import { CorpAnotherName } from 'gel-ui'
import { isEn } from 'gel-util/intl'
import { CorpBasicInfoFront } from '../handle'

export const corpInfoUsedNamesRow = (
  baseInfo: Partial<CorpBasicInfoFront>
): HorizontalTableCol<CorpBasicInfoFront> => ({
  title: intl('451194', '曾用名'),
  dataIndex: 'usednames',
  colSpan: 3,
  render: () => {
    return baseInfo.usednames && baseInfo.usednames.length
      ? baseInfo.usednames.map((t) => {
          return (
            <>
              {t.used_name}
              <br />
            </>
          )
        })
      : '--'
  },
})
export const corpInfoHKUsedNames: HorizontalTableCol<CorpBasicInfoFront> = {
  title: intl('451194', '曾用名'),
  dataIndex: 'usednames',
  colSpan: 3,
  render: (_, record) => {
    return record.usednames && record.usednames.length
      ? record.usednames.map((t, i) => {
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ marginInlineEnd: 8 }}>
                {t.used_name}
                {t.used_name && t.usedEnName && <br />}
                {t.usedEnName}
              </div>
              {t.useFrom || t.useTo ? (
                <div style={{ color: '#999' }}>
                  （{t.useFrom} ~ {t.useTo}）
                </div>
              ) : null}
            </div>
          )
        })
      : '--'
  },
}
export const corpInfoEngNameRow: HorizontalTableCol<CorpBasicInfoFront> = {
  title: intl(35079, '英文名称'),
  dataIndex: 'eng_name',
  colSpan: 3,
}

export const corpInfoAnotherNameRow: HorizontalTableCol<CorpBasicInfoFront> = {
  title: isEn() ? 'Name' : '别名',
  dataIndex: 'eng_name',
  colSpan: 5,
  render: (_txt, backData: CorpBasicInfoFront) => <CorpAnotherName anotherNames={backData?.anotherNames} />,
}
