import CompanyLink from '@/components/company/CompanyLink'
import { wftCommon } from '@/utils/utils'
import { BrandDetail } from 'gel-api'
import placeHolderPic from '../../assets/imgs/logo/other.png'

export const getLogoDetailRows = (data: Partial<BrandDetail>) => ({
  info: {
    columns: [
      [
        {
          title: '商标名称',
          dataIndex: 'brand_name',
          colSpan: 5,
          contentAlign: 'left',
          titleAlign: 'left',
        },
      ],
      [
        {
          title: '注册号',
          dataIndex: 'brand_reg_no',
          colSpan: 2,
          contentAlign: 'left',
          titleAlign: 'left',
        },
        {
          title: '流转状态',
          dataIndex: 'brand_state',
          colSpan: 2,
          contentAlign: 'left',
          titleAlign: 'left',
        },
      ],
      [
        {
          title: '国际类别',
          dataIndex: 'inner_type',
          colSpan: 2,
          contentAlign: 'left',
          titleAlign: 'left',
        },
        {
          title: '申请日期',
          dataIndex: 'apply_date',
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
          title: '专用期限',
          dataIndex: 'special_term',
          colSpan: 2,
          contentAlign: 'left',
          titleAlign: 'left',
          render: (text) => {
            return wftCommon.formatCont(text)
          },
        },
        {
          title: '商标类型',
          dataIndex: 'brand_type',
          colSpan: 2,
          contentAlign: 'left',
          titleAlign: 'left',
        },
      ],
      [
        {
          title: '初审公告号',
          dataIndex: 'brand_audit_report_no',
          colSpan: 2,
          contentAlign: 'left',
          titleAlign: 'left',
          render: (text) => {
            return wftCommon.formatCont(text)
          },
        },
        {
          title: '初审公告日期',
          dataIndex: 'brand_audit_report_time',
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
          title: '注册公告号',
          dataIndex: 'brand_reg_report_no',
          colSpan: 2,
          contentAlign: 'left',
          titleAlign: 'left',
          render: (text) => {
            return wftCommon.formatCont(text)
          },
        },
        {
          title: '注册公告日期',
          dataIndex: 'brand_reg_report_time',
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
          title: '国际注册日期',
          dataIndex: 'inter_reg_date',
          colSpan: 2,
          render: (text) => {
            return wftCommon.formatTime(text)
          },
          contentAlign: 'left',
          titleAlign: 'left',
        },
        {
          title: '后期指定日期',
          dataIndex: 'later_specified_date',
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
          title: '优先权日期',
          dataIndex: 'priority_date',
          colSpan: 2,
          render: (text) => {
            return wftCommon.formatTime(text)
          },
          contentAlign: 'left',
          titleAlign: 'left',
        },
        {
          title: '颜色组合',
          dataIndex: 'color_combination',
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
          title: '申请人名称（中文）',
          dataIndex: 'applicant_chinese_name',
          colSpan: 2,
          render: (text) => {
            return wftCommon.formatCont(text)
          },
          contentAlign: 'left',
          titleAlign: 'left',
        },
        {
          title: '申请人地址（中文）',
          dataIndex: 'applicant_chinese_adress',
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
          title: '申请人名称（英文）',
          dataIndex: 'applicant_english_name',
          colSpan: 2,
          render: (text) => {
            return wftCommon.formatCont(text)
          },
          contentAlign: 'left',
          titleAlign: 'left',
        },
        {
          title: '申请人地址（英文）',
          dataIndex: 'applicant_english_adress',
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
          title: '是否有共有商标',
          dataIndex: 'is_common_brand',
          colSpan: 2,
          render: (text) => {
            return text == 0 ? '否' : '是'
          },
          contentAlign: 'left',
          titleAlign: 'left',
        },
        {
          title: '代理机构',
          dataIndex: 'brand_agent_org_id',
          colSpan: 2,
          contentAlign: 'left',
          titleAlign: 'left',
          render: (_text, rows) => {
            //     console.log('rows',rows)
            //   return wftCommon.formatCont(text);
            var agentId = rows.brand_agent_org_id ? rows.brand_agent_org_id : ''
            console.log('agentId', agentId, agentId.length)
            if (agentId && agentId.length < 16) {
              return <CompanyLink name={rows.brand_agent_org} id={agentId} />
            } else {
              return wftCommon.formatCont(rows.brand_agent_org)
            }
          },
        },
      ],
      [
        {
          title: '商标图片',
          dataIndex: 'brand_graphic_link',
          colSpan: 2,
          render: (_text) => {
            return data.brand_graphic_link ? (
              <img
                className="logo-pic"
                width="170"
                src={wftCommon.addWsidForImg(data.brand_graphic_link)}
                onError={(e) => {
                  const img = e.currentTarget
                  img.src = placeHolderPic
                  img.onerror = null
                }}
                alt=""
                data-uc-id="CYH7XPyWbX"
                data-uc-ct="img"
              />
            ) : (
              <img className="logo-pic" width="170" src={placeHolderPic} alt="" />
            )
          },
          contentAlign: 'left',
          titleAlign: 'left',
        },
        {
          title: '商品/服务项目',
          dataIndex: 'brand_item',
          colSpan: 2,
          contentAlign: 'left',
          titleAlign: 'left',
          render: (text) => {
            return wftCommon.formatCont(text)
          },
        },
      ],
    ],
    horizontal: true,
    name: '商标详细信息',
  },
})
