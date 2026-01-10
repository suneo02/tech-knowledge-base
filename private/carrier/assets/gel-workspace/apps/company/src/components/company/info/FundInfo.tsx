import { CorpBasicInfoFront } from './handle'
import { HorizontalTableColumns } from '@/types/WindUI/horizontalTable'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils'

export interface CorpBasicInfoWithFund extends CorpBasicInfoFront {
  aMACRegistrationStatus?: boolean
  managerName?: string

  // Fund Fields
  productType?: string
  fundType?: string
  operatingState?: string
  specialNotice?: string
  recordPassedOn?: string
  recordStage?: string
  currency?: string
  trusteeName?: string
  lastestUpdateTime?: string
  manageType?: string

  // Manager Fields
  organizationType?: string
  managementScaleRange?: string
  numberOfRecordFund?: number
  numberOfEmployees?: number
  registrationStatus?: string
  currentMemberType?: string
  numberOfLiquidatedFund?: number
  numberOfFundQualificationEmployees?: number
  registeredOn?: string
  businessType?: string
  numberOfTerminatedFund?: number
  latestUpdatedAt?: string
  institutionIntegrityContent?: string
  institutionAlertContent?: string
}

export const getFundInfoRows = (
  baseInfo: Partial<CorpBasicInfoWithFund>
): HorizontalTableColumns<CorpBasicInfoWithFund> => [
  [
    {
      title: intl('2483', '产品类型'),
      dataIndex: 'productType',
      render: (txt) => (txt || txt === 0 ? txt : '--'),
    },
    {
      title: intl('', '基协备案日期'),
      dataIndex: 'recordPassedOn',
      render: (txt) => (txt || txt === 0 ? txt : '--'),
    },
    {
      title: intl('425847', '备案阶段'),
      dataIndex: 'recordStage',
      render: (txt) => (txt || txt === 0 ? txt : '--'),
    },
  ],
  [
    {
      title: intl('33222', '基金类型'),
      dataIndex: 'fundType',
      render: (txt) => (txt || txt === 0 ? txt : '--'),
    },
    {
      title: intl('2045', '币种'),
      dataIndex: 'currency',
      render: (txt) => (txt || txt === 0 ? txt : '--'),
    },
  ],
  [
    {
      title: intl('', '基金管理人'),
      dataIndex: 'managerName',
      render: (txt) => {
        // TODO: Maybe link to manager?
        return txt || txt === 0 ? txt : '--'
      },
    },
    {
      title: intl('', '管理类型'),
      dataIndex: 'manageType',
      render: (txt) => (txt || txt === 0 ? txt : '--'),
    },
    {
      title: intl('', '基金托管人'),
      dataIndex: 'trusteeName',
      render: (txt) => (txt || txt === 0 ? txt : '--'),
    },
  ],
  [
    {
      title: intl('', '运作状态'),
      dataIndex: 'operatingState',
      render: (txt) => (txt || txt === 0 ? txt : '--'),
    },
    {
      title: intl('425864', '基金信息更新时间'),
      dataIndex: 'lastestUpdateTime',
      render: (txt) => (txt || txt === 0 ? txt : '--'),
    },
  ],
  [
    {
      title: intl('', '基协特别提示'),
      dataIndex: 'specialNotice',
      colSpan: 5,
      render: (txt) => (txt || txt === 0 ? txt : '--'),
    },
  ],
]

export const getManagerInfoRows = (
  baseInfo: Partial<CorpBasicInfoWithFund>
): HorizontalTableColumns<CorpBasicInfoWithFund> => [
  [
    {
      title: intl('31990', '机构类型'),
      dataIndex: 'organizationType',
      render: (txt) => (txt || txt === 0 ? txt : '--'),
    },
    {
      title: intl('425868', '管理人登记状态'),
      dataIndex: 'registrationStatus',
      render: (txt) => (txt || txt === 0 ? txt : '--'),
    },
    {
      title: intl('', '基协登记日期'),
      dataIndex: 'registeredOn',
      render: (txt) => (txt || txt === 0 ? txt : '--'),
    },
  ],
  [
    {
      title: intl('', '管理规模区间'),
      dataIndex: 'managementScaleRange',
      render: (txt) => (txt || txt === 0 ? txt : '--'),
    },
    {
      title: intl('425873', '基协会员类型'),
      dataIndex: 'currentMemberType',
      render: (txt) => (txt || txt === 0 ? txt : '--'),
    },
    {
      title: intl('198469', '业务类型'),
      dataIndex: 'businessType',
      render: (txt) => (txt || txt === 0 ? txt : '--'),
    },
  ],
  [
    {
      title: intl('', '备案产品数量（未清算）'),
      dataIndex: 'numberOfRecordFund',
      render: (txt) => (txt || txt === 0 ? wftCommon.formatMoneyComma(txt) : '--'),
    },
    {
      title: intl('425871', '清算产品数量'),
      dataIndex: 'numberOfLiquidatedFund',
      render: (txt) => (txt || txt === 0 ? wftCommon.formatMoneyComma(txt) : '--'),
    },
    {
      title: intl('', '已终止、作废基金数'),
      dataIndex: 'numberOfTerminatedFund',
      render: (txt) => (txt || txt === 0 ? wftCommon.formatMoneyComma(txt) : '--'),
    },
  ],
  [
    {
      title: intl('', '全职员工人数'),
      dataIndex: 'numberOfEmployees',
      render: (txt) => (txt || txt === 0 ? wftCommon.formatMoneyComma(txt) : '--'),
    },
    {
      title: intl('425894', '基金从业人数'),
      dataIndex: 'numberOfFundQualificationEmployees',
      render: (txt) => (txt || txt === 0 ? wftCommon.formatMoneyComma(txt) : '--'),
    },
    {
      title: intl('', '管理人信息更新时间'),
      dataIndex: 'latestUpdatedAt',
      render: (txt) => (txt || txt === 0 ? txt : '--'),
    },
  ],
  [
    {
      title: intl('425874', '机构提示信息'),
      dataIndex: 'institutionAlertContent',
      colSpan: 5,
      render: (txt) => (txt || txt === 0 ? txt : '--'),
    },
  ],
  [
    {
      title: intl('', '机构诚信信息'),
      dataIndex: 'institutionIntegrityContent',
      colSpan: 5,
      render: (txt) => (txt || txt === 0 ? txt : '--'),
    },
  ],
]
