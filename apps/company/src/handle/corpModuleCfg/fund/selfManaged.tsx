import { Links } from '@/components/common/links'
import { LinksModule } from '@/handle/link'
import { CorpSubModuleCfg } from '@/types/corpDetail'
import { formatCurrency } from '@/utils/common'
import { formatPercent } from 'gel-util/format'
import { t } from 'gel-util/intl'

export const showSelfManagedFund: CorpSubModuleCfg = {
  title: t('', '自管基金'),
  cmd: 'detail/company/getSelfManageFundList',
  modelNum: 'pe_amac_fundmanager_self_managed_fund_num',
  numHide: true,
  extraParams: (param) => {
    param.__primaryKey = param.companycode
    return param
  },
  columns: [
    {
      title: '',
      dataIndex: 'NO.',
      width: '5.2%',
      align: 'center',
    },
    {
      title: t('7996', '基金名称'),
      dataIndex: 'name',
      render: (text: string, row: any) => <Links title={text} id={row.id} module={LinksModule.COMPANY} />,
    },
    {
      title: t('2823', '成立日期'),
      dataIndex: 'establishDate',
      width: 100,
      type: 7, // Date format
    },

    {
      title: t('', '业务基金类型'),
      dataIndex: 'type',
      width: 110,
    },
    {
      title: t('', '基协备案基金类型'),
      dataIndex: 'fundType',
      width: 130,
    },
    {
      title: t('', '基金运作状态'),
      dataIndex: 'status',
      width: 110,
    },

    {
      title: t('', '是否基协备案'),
      dataIndex: 'aMACRegistrationStatus',
      width: 110,
      render: (val: any) => {
        // Assuming 1/true is Registered
        if (val == 1 || val === true || val === '1') {
          return t('261915', '是')
        }
        return t('261902', '否')
      },
    },
    {
      title: t('', '托管人'),
      dataIndex: 'trusteeName',
    },
  ],
}

export const showInvestedFund: CorpSubModuleCfg = {
  title: t('431417', '已投基金'),
  cmd: 'detail/company/getLPInvestedFundList',
  modelNum: 'pe_enterpriselp_invested_fund_num',
  numHide: true,
  extraParams: (param) => {
    param.__primaryKey = param.companycode
    return param
  },
  columns: [
    {
      title: '',
      dataIndex: 'NO.',
      width: '5.2%',
      align: 'center',
    },
    {
      title: t('7996', '基金名称'),
      dataIndex: 'fundName',
      width: 240,
      render: (text: string, row: any) => <Links title={text} id={row.fundCompanyCode} module={LinksModule.COMPANY} />,
    },
    {
      title: t('426096', '所属投资机构'),
      dataIndex: 'institutionName',
      width: 200,
      render: (text: string, row: any) =>
        row.institutionCompanyCode ? (
          <Links title={text} id={row.institutionCompanyCode} module={LinksModule.COMPANY} />
        ) : (
          text
        ),
    },
    {
      title: t('101026', '投资日期'),
      dataIndex: 'investmentDate',
      width: 100,
      type: 7, // Date format
    },
    {
      title: t('', '出资额（万）'),
      dataIndex: 'registerCapital',
      align: 'right',
      width: 100,
      render: (val: number) => formatCurrency(val, 'CNY'),
    },
    {
      title: t('', '出资比例'),
      dataIndex: 'investmentRatio',
      width: 80,
      align: 'right',
      render: (val: number) => formatPercent(val),
    },
  ],
}
