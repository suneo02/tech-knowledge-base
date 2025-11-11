import intl from '@/utils/intl'
import { FilePdfO } from '@wind/icons'
import { message } from 'antd'
import queryString from 'qs'
import React from 'react'
import { downloadPdf } from '../../api/singleDetail'
import CompanyLink from '../../components/company/CompanyLink'
import { wftCommon } from '../../utils/utils'

import { LinkByRowCompatibleCorpPerson } from '../../components/company/link/CorpOrPersonLink'
import { corpAnnualReportAssetCfg } from './columns/asset'

const downPdf = ({ companyName = '' }) => {
  let location = window.location
  let param = queryString.parse(location.search, { ignoreQueryPrefix: true })
  let year = param['year']
  var entityId = param['companyCode']
  var downUrl =
    'http://host/Wind.WFC.Enterprise.Web/PC.Front/Company/yearReport.html?companyCode=' +
    entityId +
    '&year=' +
    year +
    '&companyName=' +
    companyName

  var params = {
    url: downUrl,
    email: null,
    entityName: companyName,
    entityId: entityId,
    year: year,
  }

  var noMoreAccessTips = ['您本年度导出企业报告的额度已用完', '本年度额度已用完']
  downloadPdf(params).then((res) => {
    var data = res
    if (data.ErrorCode == '0') {
      wftCommon.jumpJqueryPage('index.html#/customer?type=mylist')
    } else if (data.ErrorCode == '-10') {
    } else if (data.ErrorCode == '-9') {
      //超限
      message.info(noMoreAccessTips[0], noMoreAccessTips[1])
    } else {
    }
  })
}

const rows = {
  baseinfo: {
    columns: [
      [
        {
          title: '统一社会信用代码',
          dataIndex: 'credit_code',
          colSpan: 2,
          contentAlign: 'left',
          titleAlign: 'left',
          render: (text) => {
            return wftCommon.formatCont(text)
          },
        },
        {
          title: '企业名称',
          dataIndex: 'company_name',
          colSpan: 2,
          contentAlign: 'left',
          titleAlign: 'left',
          render: (text) => {
            return wftCommon.formatCont(text)
          },
        },
      ],
      [
        {
          title: '企业通信地址',
          dataIndex: 'address',
          colSpan: 2,
          contentAlign: 'left',
          titleAlign: 'left',
          render: (text) => {
            return wftCommon.formatCont(text)
          },
        },
        {
          title: '邮政编码',
          dataIndex: 'post_code',
          colSpan: 2,
          contentAlign: 'left',
          titleAlign: 'left',
          render: (text) => {
            return wftCommon.formatCont(text)
          },
        },
      ],
      [
        {
          title: '企业联系电话',
          dataIndex: 'tel',
          colSpan: 2,
          contentAlign: 'left',
          titleAlign: 'left',
          render: (text) => {
            return wftCommon.formatCont(text)
          },
        },
        {
          title: '企业电子邮箱',
          dataIndex: 'email_address',
          colSpan: 2,
          contentAlign: 'left',
          titleAlign: 'left',
          render: (text) => {
            return wftCommon.formatCont(text)
          },
        },
      ],
      [
        {
          title: '从业人数',
          dataIndex: 'employee_number',
          colSpan: 2,
          contentAlign: 'left',
          titleAlign: 'left',
          render: (text) => {
            return text ? wftCommon.formatCont(text) : '--'
          },
        },
        {
          title: '其中女性从业人数',
          dataIndex: 'women_employee_number',
          colSpan: 2,
          contentAlign: 'left',
          titleAlign: 'left',
          render: (text) => {
            return text ? wftCommon.formatCont(text) : '--'
          },
        },
      ],
      [
        {
          title: '企业经营状态',
          dataIndex: 'bus_status',
          colSpan: 2,
          contentAlign: 'left',
          titleAlign: 'left',
          render: (text) => {
            return wftCommon.formatCont(text)
          },
        },
        {
          title: '企业控股情况',
          dataIndex: 'holding_situation',
          colSpan: 2,
          contentAlign: 'left',
          titleAlign: 'left',
          render: (text) => {
            return wftCommon.formatTime(text)
          },
        },
      ],
      [
        {
          title: '是否有投资公司或购买其他公司股权',
          dataIndex: 'is_invested',
          colSpan: 2,
          contentAlign: 'left',
          titleAlign: 'left',
          render: (text) => {
            return wftCommon.formatCont(text)
          },
        },
        {
          title: '是否有网站或网点',
          dataIndex: 'has_website',
          colSpan: 2,
          contentAlign: 'left',
          titleAlign: 'left',
          render: (text) => {
            return wftCommon.formatCont(text)
          },
        },
      ],
      [
        {
          title: '是否有对外提供的担保信息',
          dataIndex: 'is_guaranted',
          colSpan: 2,
          render: (text) => {
            return wftCommon.formatCont(text)
          },
          contentAlign: 'left',
          titleAlign: 'left',
        },
        {
          title: '有限责任公司本年度是否发生股东股权转让',
          dataIndex: 'has_share_transfer',
          colSpan: 2,
          contentAlign: 'left',
          titleAlign: 'left',
          render: (text) => {
            return wftCommon.formatCont(text)
          },
        },
      ],
      [
        {
          title: '企业主营业务活动',
          dataIndex: 'main_business',
          colSpan: 5,
          render: (text) => {
            return wftCommon.formatCont(text)
          },
          contentAlign: 'left',
          titleAlign: 'left',
        },
      ],
    ],
    horizontal: true,
    name: (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {intl('205468', '基本信息')}
        <FilePdfO
          style={{ fontSize: 18 }}
          onClick={() => downPdf({ companyName: window.company_name })}
          data-uc-id="EjSZ_eKb2l"
          data-uc-ct="filepdfo"
        />
      </div>
    ),
  },
  website: {
    columns: [
      {
        title: '序号',
        dataIndex: 'companyName',
        align: 'left',
        width: '5%',
        render: (text, row, index) => {
          return index + 1
        },
      },
      {
        title: '名称',
        dataIndex: 'web_name',
        align: 'left',
        render: (text, row, index) => {
          return wftCommon.formatCont(text)
        },
      },
      {
        title: '类型',
        dataIndex: 'web_type',
        align: 'left',
        render: (text, row, index) => {
          return wftCommon.formatCont(text)
        },
      },
      {
        title: '网址',
        dataIndex: 'web_url',
        align: 'left',
        render: (text, row, index) => {
          return wftCommon.formatWebsite(text)
        },
      },
    ],
    horizontal: false,
    name: '网站或网店信息',
  },
  shareholder: {
    columns: [
      {
        title: '序号',
        dataIndex: 'companyName',
        align: 'left',
        width: '5%',
        render: (text, row, index) => {
          return index + 1
        },
      },
      {
        title: '股东',
        dataIndex: 'shareholder_name',
        align: 'left',
        render: (text, row) => (
          <LinkByRowCompatibleCorpPerson nameKey={'shareholder_name'} idKey={'shareholder_id'} row={row} />
        ),
      },
      {
        title: '认缴出资额（万元）',
        dataIndex: 'promiseMoneyAmount',
        align: 'right',
        render: (text, row, index) => {
          return wftCommon.formatMoneyComma(text)
        },
      },
      {
        title: '认缴出资时间',
        dataIndex: 'promiseMoneyTime',
        align: 'left',
        render: (text, row, index) => {
          return wftCommon.formatTime(text)
        },
      },
      {
        title: '实缴出资额（万元）',
        dataIndex: 'realMoneyAmount',
        align: 'right',
        render: (text, row, index) => {
          return wftCommon.formatMoneyComma(text)
        },
      },
      {
        title: '实缴出资时间',
        dataIndex: 'realMoneyTime',
        align: 'left',
        render: (text, row, index) => {
          return wftCommon.formatTime(text)
        },
      },
      {
        title: '实缴出资方式',
        dataIndex: 'realMoneyMethod',
        align: 'left',
        render: (text, row, index) => {
          return wftCommon.formatCont(text)
        },
      },
    ],
    horizontal: false,
    name: '股东及出资信息',
  },
  investment: {
    columns: [
      {
        title: '序号',
        align: 'left',
        render: (text, row, index) => {
          return index + 1
        },
      },
      {
        title: '公司名称',
        dataIndex: 'invest_corp_name',
        align: 'left',
        render: (text, row, index) => {
          return <CompanyLink name={text} id={row.invest_corp_id} />
        },
      },
      {
        title: '统一社会信用代码',
        dataIndex: 'invest_corp_credit_code',
        align: 'left',
        render: (text, row, index) => {
          return wftCommon.formatCont(row.invest_corp_credit_code)
        },
      },
    ],
    horizontal: false,
    name: '对外投资信息',
  },
  asset: corpAnnualReportAssetCfg,
  guarantee: {
    columns: [
      {
        title: '序号',
        dataIndex: 'companyName',
        align: 'left',
        render: (text, row, index) => {
          return index + 1
        },
      },
      {
        title: '债权人',
        dataIndex: 'creditor',
        align: 'left',
        render: (text, row, index) => {
          return <CompanyLink name={text} id={row.creditor_id} />
        },
      },
      {
        title: '债务人',
        dataIndex: 'debtor',
        align: 'left',
        render: (text, row, index) => {
          return <CompanyLink name={text} id={row.debtor_id} />
        },
      },
      {
        title: '主债券种类',
        dataIndex: 'obligatory_right_type',
        align: 'left',
        render: (text, row, index) => {
          return wftCommon.formatCont(text)
        },
      },
      {
        title: '主债券数额',
        dataIndex: 'credit_amount',
        align: 'left',
        render: (text, row, index) => {
          return wftCommon.formatMoney(text)
        },
      },
      {
        title: '履行债务的期限',
        dataIndex: 'debt_maturity',
        align: 'left',
        render: (text, row, index) => {
          return wftCommon.formatCont(text)
        },
      },
      {
        title: '保证的期间',
        dataIndex: 'guaranty_period',
        align: 'left',
        render: (text, row, index) => {
          return wftCommon.formatCont(text)
        },
      },
      {
        title: '保证的方式',
        dataIndex: 'guarantee_mode',
        align: 'left',
        render: (text, row, index) => {
          return wftCommon.formatCont(text)
        },
      },
    ],
    horizontal: false,
    name: '对外提供保证担保信息',
  },
  changesOfShareholder: {
    columns: [
      {
        title: '序号',
        align: 'left',
        render: (text, row, index) => {
          return index + 1
        },
      },
      {
        title: '股东',
        dataIndex: 'shareholder',
        align: 'left',
        render: (text, row, index) => {
          return <CompanyLink name={text} id={row.shareholder_id} />
        },
      },
      {
        title: '变更前股权比例',
        dataIndex: 'change_before_rate',
        align: 'left',
        render: (text, row, index) => {
          return text + '%'
        },
      },
      {
        title: '变更后股权比例',
        dataIndex: 'change_after_rate',
        align: 'left',
        render: (text, row, index) => {
          return text + '%'
        },
      },
      {
        title: '股权变更日期',
        dataIndex: 'change_date',
        align: 'left',
        render: (text, row, index) => {
          return wftCommon.formatTime(text)
        },
      },
    ],
    horizontal: false,
    name: '股权变更信息',
  },
  socialsecurity: {
    columns: [
      [
        {
          title: '城镇职工基本养老保险',
          dataIndex: 'endowment_num',
          colSpan: 2,
          contentAlign: 'left',
          titleAlign: 'left',
          render: (text) => {
            return wftCommon.formatMoneyComma(text) + '人'
          },
        },
        {
          title: '失业保险',
          dataIndex: 'unemployment_num',
          colSpan: 2,
          contentAlign: 'left',
          titleAlign: 'left',
          render: (text) => {
            return wftCommon.formatMoneyComma(text) + '人'
          },
        },
      ],
      [
        {
          title: '职业基本医疗保险',
          dataIndex: 'medical_num',
          colSpan: 2,
          contentAlign: 'left',
          titleAlign: 'left',
          render: (text) => {
            return wftCommon.formatMoneyComma(text) + '人'
          },
        },
        {
          title: '工伤保险',
          dataIndex: 'employment_injury_num',
          colSpan: 2,
          contentAlign: 'left',
          titleAlign: 'left',
          render: (text) => {
            return wftCommon.formatMoneyComma(text) + '人'
          },
        },
      ],
      [
        {
          title: '生育保险',
          dataIndex: 'maternity_num',
          colSpan: 5,
          contentAlign: 'left',
          titleAlign: 'left',
          render: (text) => {
            return wftCommon.formatCont(text) + '人'
          },
        },
      ],
      [
        {
          title: '单位缴费基数',
          colSpan: 5,
          contentAlign: 'left',
          titleAlign: 'left',
          render: (text, row, index) => {
            var flag = row.ifFlag_cost_base == '1' ? true : false
            return (
              <table style={{ borderBottom: 'none' }}>
                <tbody className="wind-ui-table-tbody" style={{ backgroundColor: 'transparent' }}>
                  <tr className="wind-ui-table-row">
                    <td colSpan="2" className="wind-ui-table-item-content">
                      单位参加城镇职工基本养老保险缴费基数（元）
                    </td>
                    <td colSpan="3" className="wind-ui-table-item-content">
                      {flag ? wftCommon.formatMoneyComma(row.endowment_cost_base) : '企业选择不公示'}
                    </td>
                  </tr>
                  <tr className="wind-ui-table-row">
                    <td colSpan="2" className="wind-ui-table-item-content">
                      单位参加失业保险缴费基数 （元）
                    </td>
                    <td colSpan="3" className="wind-ui-table-item-content">
                      {flag ? wftCommon.formatMoneyComma(row.unemployment_cost_base) : '企业选择不公示'}
                    </td>
                  </tr>
                  <tr className="wind-ui-table-row">
                    <td colSpan="2" className="wind-ui-table-item-content">
                      单位参加职工基本医疗保险缴费基数 （元）
                    </td>
                    <td colSpan="3" className="wind-ui-table-item-content">
                      {flag ? wftCommon.formatMoneyComma(row.medical_cost_base) : '企业选择不公示'}
                    </td>
                  </tr>
                  <tr className="wind-ui-table-row">
                    <td colSpan="2" className="wind-ui-table-item-content">
                      单位参加生育保险缴费基数 （元）
                    </td>
                    <td colSpan="3" className="wind-ui-table-item-content">
                      {flag ? wftCommon.formatMoneyComma(row.maternity_cost_base) : '企业选择不公示'}
                    </td>
                  </tr>
                </tbody>
              </table>
            )
          },
        },
      ],
      [
        {
          title: '本期实际缴费金额',
          colSpan: 5,
          contentAlign: 'left',
          titleAlign: 'left',
          render: (text, row, index) => {
            var flag = row.ifFlag_realCost_base == '1' ? true : false
            return (
              <table style={{ borderBottom: 'none' }}>
                <tbody className="wind-ui-table-tbody" style={{ backgroundColor: 'transparent' }}>
                  <tr className="wind-ui-table-row">
                    <td colSpan="2" className="wind-ui-table-item-content">
                      参加城镇职工基本养老保险本期实际缴费金额（万元）
                    </td>
                    <td colSpan="3" className="wind-ui-table-item-content">
                      {flag ? wftCommon.formatMoneyComma(row.endowment_real_cost_base) : '企业选择不公示'}
                    </td>
                  </tr>
                  <tr className="wind-ui-table-row">
                    <td colSpan="2" className="wind-ui-table-item-content">
                      参加失业保险本期实际缴费金额 （万元）
                    </td>
                    <td colSpan="3" className="wind-ui-table-item-content">
                      {flag ? wftCommon.formatMoneyComma(row.unemployment_real_cost_base) : '企业选择不公示'}
                    </td>
                  </tr>
                  <tr className="wind-ui-table-row">
                    <td colSpan="2" className="wind-ui-table-item-content">
                      参加职工基本医疗保险本期实际缴费金额（万元）
                    </td>
                    <td colSpan="3" className="wind-ui-table-item-content">
                      {flag ? wftCommon.formatMoneyComma(row.medical_real_cost_base) : '企业选择不公示'}
                    </td>
                  </tr>
                  <tr className="wind-ui-table-row">
                    <td colSpan="2" className="wind-ui-table-item-content">
                      参加工伤保险本期实际缴费金额 （万元）
                    </td>
                    <td colSpan="3" className="wind-ui-table-item-content">
                      {flag ? wftCommon.formatMoneyComma(row.employment_injury_real_cost_base) : '企业选择不公示'}
                    </td>
                  </tr>
                  <tr className="wind-ui-table-row">
                    <td colSpan="2" className="wind-ui-table-item-content">
                      参加生育保险本期实际缴费金额 （万元）
                    </td>
                    <td colSpan="3" className="wind-ui-table-item-content">
                      {flag ? wftCommon.formatMoneyComma(row.maternity_real_cost_base) : '企业选择不公示'}
                    </td>
                  </tr>
                </tbody>
              </table>
            )
          },
        },
      ],
      [
        {
          title: intl('142498', '单位累计欠缴金额'),
          colSpan: 5,
          contentAlign: 'left',
          titleAlign: 'left',
          render: (text, row, index) => {
            var flag = row.ifFlag_Amount_Owed == '1' ? true : false
            return (
              <table style={{ borderBottom: 'none' }}>
                <tbody className="wind-ui-table-tbody" style={{ backgroundColor: 'transparent' }}>
                  <tr className="wind-ui-table-row">
                    <td colSpan="2" className="wind-ui-table-item-content">
                      {intl('142498', '单位累计欠缴金额')}
                    </td>
                    <td colSpan="3" className="wind-ui-table-item-content">
                      {flag ? wftCommon.formatMoneyComma(row.endowment_amount_owed) : '企业选择不公示'}
                    </td>
                  </tr>
                  <tr className="wind-ui-table-row">
                    <td colSpan="2" className="wind-ui-table-item-content">
                      {intl('142500', '单位参加失业保险累计欠缴金额')}
                    </td>
                    <td colSpan="3" className="wind-ui-table-item-content">
                      {flag ? wftCommon.formatMoneyComma(row.unemployment_amount_owed) : '企业选择不公示'}
                    </td>
                  </tr>
                  <tr className="wind-ui-table-row">
                    <td colSpan="2" className="wind-ui-table-item-content">
                      {intl('142501', '单位参加职工基本医疗保险累计欠缴金额')}
                    </td>
                    <td colSpan="3" className="wind-ui-table-item-content">
                      {flag ? wftCommon.formatMoneyComma(row.medical_amount_owed) : '企业选择不公示'}
                    </td>
                  </tr>
                  <tr className="wind-ui-table-row">
                    <td colSpan="2" className="wind-ui-table-item-content">
                      {intl('142502', '单位参加工伤保险累计欠缴金额')}
                    </td>
                    <td colSpan="3" className="wind-ui-table-item-content">
                      {flag ? wftCommon.formatMoneyComma(row.employment_injury_amount_owed) : '企业选择不公示'}
                    </td>
                  </tr>
                  <tr className="wind-ui-table-row">
                    <td colSpan="2" className="wind-ui-table-item-content">
                      {intl('142503', '单位参加生育保险累计欠缴金额')}
                    </td>
                    <td colSpan="3" className="wind-ui-table-item-content">
                      {flag ? wftCommon.formatMoneyComma(row.maternity_amount_owed) : '企业选择不公示'}
                    </td>
                  </tr>
                </tbody>
              </table>
            )
          },
        },
      ],
    ],
    horizontal: true,
    name: '社保信息',
  },
}

export default rows
