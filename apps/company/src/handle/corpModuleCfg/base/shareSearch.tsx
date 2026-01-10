import { LinkByRowCompatibleCorpPerson } from '@/components/company/link/CorpOrPersonLink.tsx'
import { CorpTableCfg } from '@/types/corpDetail'
import { formatShareRate } from '@/utils/format'
import { intlNoNO as intl } from '@/utils/intl'
import { ShareholderBreakthrough } from 'gel-types'
import { ShowShareSearchLayerByMergeSharePath } from './ShowShareSearch/CombinedStatistics'
import { ShowShareSearchLayerByLayerSharePath } from './ShowShareSearch/showShareSearch'

export const corpShareSearch: CorpTableCfg<ShareholderBreakthrough> = {
  cmd: '/detail/company/getshareholdertrace',
  f9cmd: '/detail/wft/getshareholdertrace',
  modelNum: undefined,
  needNoneTable: true,
  title: intl('228894', '股东穿透'),
  selName: ['shareSearchLev', 'shareSearchRadio'],
  thWidthRadio: ['5.2%', '24%', '11%', '11%', '50%'],
  thName: [
    intl('28846', '序号'),
    intl('138783', '股东名称'),
    intl('451200', '层级'),
    intl('451217', '持股比例(%)'),
    intl('231780', '持股路径'),
  ],
  align: [1, 0, 1, 2, 0],
  fields: ['NO.', 'shareholderName', 'level', 'showShareRate', 'path'],
  extraParams: (param) => {
    return {
      ...param,
      __primaryKey: param.companycode,
      type: 1,
      percent: '',
      level: '6',
    }
  },
  columns: [
    null,
    {
      render: (_txt, row) => {
        /**
         * 1：有企业编码的企业，则第三位是企业编码
         * 2：无企业编码的企业，则第三位是企业名
         * 3：有个人编码的个人，则第三位是个人编码
         * 4：无个人编码的个人，则第三位是个人名
         * 5：有基金编码的基金，则第三位是基金编码
         */
        return (
          <LinkByRowCompatibleCorpPerson
            nameKey={'shareholderName'}
            idKey={'shareholderId'}
            typeKey={'typeName'}
            row={row}
          />
        )
      },
    },
    null,

    {
      render: (txt) => formatShareRate(txt),
    },
    {
      render: (_txt, row) => {
        return <ShowShareSearchLayerByLayerSharePath row={row} />
      },
    },
  ],
  typeMergence: {
    thWidthRadio: ['5.2%', '24%', '11%', '61%'],
    thName: [
      intl('28846', '序号'),
      intl('138783', '股东名称'),
      intl('417625', '合计持股比例'),
      intl('231780', '持股路径'),
    ],
    align: [1, 0, 2, 0],
    fields: ['NO.', 'shareholderName', 'showShareRate', 'path-x'],
    skipTransFieldsInKeyMode: ['shareholderName'],
    columns: [
      null,
      {
        render: (_txt, row) => {
          return (
            <LinkByRowCompatibleCorpPerson
              nameKey={'shareholderName'}
              idKey={'shareholderId'}
              typeKey={'typeName'}
              row={row}
            />
          )
        },
      },

      {
        render: (txt) => formatShareRate(txt),
      },
      {
        render: (_txt, row, _idx) => {
          return <ShowShareSearchLayerByMergeSharePath row={row} />
        },
      },
    ],
  },
  extension: {
    tabs: [
      {
        name: intl('369953', '逐层展示'),
        value: 1,
      },
      {
        name: intl('369973', '合并统计'),
        value: 2,
      },
    ],
  },
}
