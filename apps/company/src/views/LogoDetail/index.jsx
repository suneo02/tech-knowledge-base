import { Card, Steps, Tag } from '@wind/wind-ui'
import queryString from 'qs'
import React, { useEffect, useMemo, useState } from 'react'
import { pointBuriedGel } from '../../api/configApi'
import { geLogoDetail } from '../../api/singleDetail'
import placeHolderPic from '../../assets/imgs/logo/other.png'
import CompanyLink from '../../components/company/CompanyLink'
import Tables from '../../components/detail/table'
import intl from '../../utils/intl'
import { wftCommon } from '../../utils/utils'
import './index.less'
import { usePageTitle } from '../../handle/siteTitle'
import { useTranslateService } from '../../hook'
import { getUrlByLinkModule, LinksModule } from '@/handle/link'

const Step = Steps.Step
const StylePrefix = 'logo-detail'
const LogoDetail = () => {
  const [dataRaw, setDataRaw] = useState({
    info: {},
  })
  const [data] = useTranslateService(dataRaw, true, true)
  usePageTitle('TrademarkDetail', data?.info?.brand_name)
  const [loading, setLoading] = useState(true)

  const breadCrumb = (
    <div className="bread-crumb">
      <div className="bread-crumb-content">
        <span className="last-rank" onClick={() => window.open(getUrlByLinkModule(LinksModule.HOME))}>
          {intl('19475', '首页')}
        </span>
        <i></i>
        <span>{intl('138799', '商标')}</span>
      </div>
    </div>
  )

  const rows = {
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
            render: (text, rows) => {
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
            render: (text) => {
              return data.info.brand_graphic_link ? (
                <img
                  className="logo-pic"
                  width="170"
                  src={data.info.brand_graphic_link}
                  onError={(e) => {
                    const img = e.currentTarget
                    img.src = placeHolderPic
                    img.onerror = null
                  }}
                  alt=""
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
  }

  useEffect(() => {
    let location = window.location
    let params = queryString.parse(location.search, {
      ignoreQueryPrefix: true,
    })
    setLoading(true)
    geLogoDetail({
      detailid: params['detailid'],
    })
      .then((res) => {
        if (res && Number(res.ErrorCode) === 0) {
          setDataRaw({
            info: res.Data || {},
          })
        }
      })
      .finally(() => {
        setLoading(false)
      })
    pointBuriedGel('922602100851', '商标', 'brandDetail')
  }, [])

  const dotStatus = useMemo(() => {
    var end_time = data.info.special_term?.split('~')[1]
    var today = new Date()
    var y = today.getFullYear().toString()
    var m = today.getMonth() < 10 ? '0' + (today.getMonth() + 1) : today.getMonth()
    var d = today.getDate().toString()
    var date = Number(y + m + d)

    const processState = 'process' // 过程中
    const waitState = 'wait' // 等待中
    const finishState = 'finish' // 已完成

    // 有终止时间
    if (end_time) {
      let end_time_num = Number(end_time.replace(/-/g, ''))
      if (date > end_time_num) {
        return [finishState, finishState, finishState, finishState]
      } else {
        return [finishState, finishState, finishState, processState]
      }
    } else {
      // 有已注册时间
      if (data.info.brand_reg_report_time) {
        return [finishState, finishState, finishState, waitState]
      } else {
        // 有初审公告时间
        if (data.info.brand_audit_report_time) {
          return [finishState, finishState, waitState, waitState]
        } else {
          // 有商标申请时间
          if (data.info.apply_date) {
            return [finishState, waitState, waitState, waitState]
          } else {
            return [waitState, waitState, waitState, waitState]
          }
        }
      }
    }
  }, [data])

  return (
    <div className="logo-detail">
      {breadCrumb}
      <div className="each-div single-module" id="brandDetail">
        <div className="each-module">
          <div className="module-brand-header">
            <div className="module-brand-header-img">
              {data.info.brand_graphic_link ? (
                <img
                  className="logo-pic"
                  width="170"
                  src={data.info.brand_graphic_link}
                  onError={(e) => {
                    const img = e.currentTarget
                    img.src = placeHolderPic
                    img.onerror = null
                  }}
                  alt=""
                />
              ) : (
                <img className="logo-pic" width="170" src={placeHolderPic} alt="" />
              )}
            </div>
            <div className="module-brand-header-content">
              <div style={{ marginBottom: '12px' }}>
                <h5 id="header-brand-name">{wftCommon.formatCont(data.info.brand_name)}</h5>
                <Tag color="color-7" type="primary" id="header-brand-state">
                  {wftCommon.formatCont(data.info.brand_state)}
                </Tag>
              </div>
              <div className="header-brand-message">
                <span>
                  <span langkey="138660">申请时间</span>：
                  <span id="header-brand-applydate">{wftCommon.formatTime(data.info.apply_date)}</span>
                </span>
                <span className="second-message">
                  <span langkey="58656">申请人</span>：
                  <span id="header-brand-person">{wftCommon.formatCont(data.info.applicant_chinese_name)}</span>
                </span>
              </div>
              <div className="header-brand-message">
                <span>
                  <span langkey="138476">注册号</span>：
                  <span id="header-brand-number">{wftCommon.formatCont(data.info.brand_reg_no)}</span>
                </span>
                <span className="second-message">
                  <span langkey="138349">国际类别</span>：
                  <span id="header-brand-type">{wftCommon.formatCont(data.info.inner_type)}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="each-div logo__steps">
        <Card title={'商标申请进度'} styleType="block">
          <Steps className={`${StylePrefix}--steps`} size="small" progressDot style={{ margin: '0 120px' }}>
            <Step
              // icon={<span className={currentStep >= 0 ? 'step__icon--finished' : 'step__icon--unfinished'} />}
              status={dotStatus[0]}
              title="商标申请"
              description={data.info.apply_date && wftCommon.formatTime(data.info.apply_date)}
            />
            <Step
              // icon={<span className={currentStep >= 1 ? 'step__icon--finished' : 'step__icon--unfinished'} />}
              status={dotStatus[1]}
              title="初审公告"
              description={data.info.brand_audit_report_time && wftCommon.formatTime(data.info.brand_audit_report_time)}
            />
            <Step
              // icon={<span className={currentStep >= 2 ? 'step__icon--finished' : 'step__icon--unfinished'} />}
              status={dotStatus[2]}
              title="已注册"
              description={data.info.brand_reg_report_time && wftCommon.formatTime(data.info.brand_reg_report_time)}
            />
            <Step
              // icon={<span className={currentStep >= 3 ? 'step__icon--finished' : 'step__icon--unfinished'} />}
              status={dotStatus[3]}
              title="终止"
              description={
                data.info.special_term && wftCommon.formatTime(data.info.special_term?.split('~')[1] || '--')
              }
            />
          </Steps>
        </Card>
      </div>
      <div className="each-div">{<Tables info={data} isLoading={loading} rows={rows} />}</div>
    </div>
  )
}

export default LogoDetail
