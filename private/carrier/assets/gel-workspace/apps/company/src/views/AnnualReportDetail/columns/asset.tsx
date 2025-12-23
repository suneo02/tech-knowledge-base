import { TableProps } from '@wind/wind-ui-table'
import { IAnnualReportDetail } from '@/views/AnnualReportDetail/useAnnualReportDetail.ts'
import { wftCommonType } from '@/utils/WFTCommonWithType'
import intl from '@/utils/intl'

const assetRender = (text: string) =>
  wftCommonType.formatMoney(text, {
    showUnit: true,
    unit: ` ${intl('286695', '万元')}`,
  })

export const corpAnnualReportAssetCfg: TableProps<IAnnualReportDetail['asset']> & {
  [key: string]: any
} = {
  columns: [
    [
      {
        title: '资产总额',
        dataIndex: 'total_asset',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: assetRender,
      },
      {
        title: '所有者权益合计',
        dataIndex: 'total_owner_equity',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: assetRender,
      },
    ],
    [
      {
        title: '营业总收入',
        dataIndex: 'gross_revenue',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: assetRender,
      },
      {
        title: '利润总额',
        dataIndex: 'total_profit',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: assetRender,
      },
    ],
    [
      {
        title: '营业总收入中主营业务收入',
        dataIndex: 'main_business_income',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: assetRender,
      },
      {
        title: '净利润',
        dataIndex: 'net_profit',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: assetRender,
      },
    ],
    [
      {
        title: '纳税总额',
        dataIndex: 'total_tax_payment',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: assetRender,
      },
      {
        title: '负债总额',
        dataIndex: 'total_indebtedness',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: assetRender,
      },
    ],
  ],
  horizontal: true,
  name: '企业资产状况信息',
}
