import { Card, Col, Link, Row, Tag, Timeline } from '@wind/wind-ui'
import React, { FC, useEffect, useState } from 'react'
import { useSingleDynamicStore } from '../../store/singleCompanyDynamic'
import intl from '../../utils/intl'
import { wftCommon } from '../../utils/utils'
import './DynamicFilter.less'
import HorizontalCheckBox from './HorizontalCheckBox'

import { getUrlByLinkModule, handleJumpTerminalCompatibleAndCheckPermission, LinksModule } from '@/handle/link'
import fold_icon from '../../assets/icons/icon-fold.png'
import RangePickerDialog from './RangePickerDialog'
import { dates } from './dates'
import { menus } from './menus'

// 加载中
const Loading = () => (
  <div
    style={{
      height: '300',
      lineHeight: '300px',
      textAlign: 'center',
      color: '#333',
      fontSize: '14px',
    }}
  >
    Loading…
  </div>
)

// 数据为空
const Empty = () => (
  <div
    style={{
      height: '300',
      lineHeight: '300px',
      textAlign: 'center',
      color: '#333',
      fontSize: '14px',
    }}
  >
    {intl('17235', '暂无数据')}
  </div>
)

// 动态时间轴内容
const DynamicTimeLineItem: FC<{ data: any; largeBottom?: boolean }> = ({ data: i, largeBottom = false }) => {
  return (
    <>
      <div
        style={{
          margin: '0 12px',
          fontSize: '14px',
          paddingBottom: largeBottom ? '36px' : '12px',
          paddingRight: '20px',
          display: 'flex',
        }}
      >
        <Tag
          size="small"
          style={{
            fontSize: '14px',
            color: '#6D78A5',
            cursor: 'default',
            borderColor: 'rgba(109, 120, 165, 0.5)',
            backgroundColor: 'transparent',
          }}
          data-uc-id="9xb7Zng1mN"
          data-uc-ct="tag"
        >
          {i?.event_type || ''}
        </Tag>
        <span style={{ color: '#333', fontWeight: 'bold' }}>{mapText2JSX(i)}</span>
      </div>
      {i?.event_type_raw === '企业公告' ? (
        <>
          <DynamicLink
            text={'>> ' + intl('478700', '点击查看年报详情')}
            icon={null}
            style={{
              margin: '-12px 12px 12px',
            }}
            onClick={() => {
              if (i.corp_id && i.event_abstract?.years) {
                const url = getUrlByLinkModule(LinksModule.ANNUAL_REPORT, {
                  id: i.corp_id,
                  params: {
                    year: i.event_abstract.years,
                    companyCode: i.corp_id,
                  },
                })
                handleJumpTerminalCompatibleAndCheckPermission(url)
              }
            }}
            data-uc-id="tW3-z8XaCx"
            data-uc-ct="dynamiclink"
          ></DynamicLink>
        </>
      ) : (
        <></>
      )}
    </>
  )
}

//
const mapText2JSX = ({ event_type_raw, text, event_id, event_source_id, corp_id }) => {
  let prefix = wftCommon.isDevDebugger() ? 'Wind.WFC.Enterprise.Web/PC.Front/Company/' : '' //前缀
  let suffix = wftCommon.isDevDebugger() ? `&wind.sessionid=${wftCommon.getwsd()}` : '' //后缀
  switch (event_type_raw) {
    case '招投标公告':
      return (
        <Link
          // @ts-expect-error
          target="_blank"
          href={`${prefix}index.html?nosearch=1#/biddingDetail?detailid=${event_source_id}${suffix}`}
          data-uc-id="_4xEsXUFmK"
          data-uc-ct="link"
        >
          {text}
        </Link>
      )
    case '招聘信息':
      return (
        <Link
          // @ts-expect-error
          target="_blank"
          href={`${prefix}index.html#/jobDetail?type=jobs&detailid=${event_source_id}&jobComCode=${corp_id}${suffix}`}
          data-uc-id="UiE9q1qdLc"
          data-uc-ct="link"
        >
          {text}
        </Link>
      )

    // 法律诉讼
    case '裁判文书':
      return (
        <Link
          // @ts-expect-error
          target="_blank"
          href={`${prefix}index.html#/lawdetail?reportName=Judgment&id=${event_source_id}${suffix}`}
          data-uc-id="2NkOH259mG"
          data-uc-ct="link"
        >
          {text}
        </Link>
      )
    case '开庭公告':
      return (
        <Link
          // @ts-expect-error
          target="_blank"
          href={`${prefix}index.html#/lawdetail?reportName=CourtSession&id=${event_source_id}${suffix}`}
          data-uc-id="rNlsD6q56i"
          data-uc-ct="link"
        >
          {text}
        </Link>
      )
    case '法院公告':
      return (
        <Link
          // @ts-expect-error
          target="_blank"
          href={`${prefix}index.html#/lawdetail?reportName=CourtAnnouncement&id=${event_source_id}${suffix}`}
          data-uc-id="hdLYBrh2R7"
          data-uc-ct="link"
        >
          {text}
        </Link>
      )

    // 知识产权
    case '商标信息':
      return (
        <Link
          // @ts-expect-error
          target="_blank"
          href={`${prefix}index.html?type=brand&expover=${0}&detailid=${event_source_id}${suffix}#/logoDetail`}
          data-uc-id="QUFC4yyxW7"
          data-uc-ct="link"
        >
          {text}
        </Link>
      )
    case '专利信息':
      return (
        <Link
          // @ts-expect-error
          target="_blank"
          href={`${prefix}index.html#/patentDetail?nosearch=1&detailId=${event_id}${suffix}`}
          data-uc-id="ay0eL9opre"
          data-uc-ct="link"
        >
          {text}
        </Link>
      )

    default:
      return text
  }
}

const Icon = ({ url, ...rest }) => (
  <span {...rest}>
    <img src={url} alt="" style={{ verticalAlign: 'text-bottom' }} width={18} height={18} />
  </span>
)

// 动态跳转
const DynamicLink = ({ style, text, onClick, icon = <Icon url={fold_icon} style={{ marginRight: '4px' }}></Icon> }) => {
  const defaultStyle = {
    color: '#007892',
    lineHeight: '22px',
    cursor: 'pointer',
  }
  return (
    <div
      style={{ ...defaultStyle, ...style }}
      onClick={() => {
        onClick()
      }}
      data-uc-id="pyQ7AGmdDK"
      data-uc-ct="div"
    >
      {icon}
      {text}
    </div>
  )
}

const CollapseStyle = {
  margin: '0 12px',
  marginTop: '-32px',
  padding: '20px 0',
}

// 时间轴一次性折叠组件
const DynamicCollapse = ({ data }) => {
  const [isCollapse, setIsCollapse] = useState(true)

  const text = (window.en_access_config ? '% records folded!' : '共有%条&动态被折叠')
    .replace('%', data.length)
    .replace('&', data[0]?.event_type)

  return isCollapse ? (
    <>
      <Timeline.Item color="blue" title={''} dot={<></>} data-uc-id="rTq0bcjE6Z" data-uc-ct="timeline">
        <DynamicLink
          style={CollapseStyle}
          text={text}
          onClick={() => {
            setIsCollapse(false)
          }}
          data-uc-id="F56YKiwJlK"
          data-uc-ct="dynamiclink"
        ></DynamicLink>
      </Timeline.Item>
    </>
  ) : (
    data.map((i, index, arr) => (
      <Timeline.Item color="blue" title={''} dot={<></>} data-uc-id="2OKBcWYQHh" data-uc-ct="timeline">
        <DynamicTimeLineItem data={i} largeBottom={index === arr.length - 1}></DynamicTimeLineItem>
      </Timeline.Item>
    ))
  )
}

const DynamicFilter = ({ companycode }) => {
  const [dateRaw, setDateRaw] = useState([])
  const [customDate, setCustomDate] = useState({}) // 自定义时间
  const [activeMenu, setActiveMenu] = useState([menus[0]])

  const [activeDate, setActiveDate] = useState(dates[0])
  const [isShowRangePicker, setIsShowRangePicker] = useState(false) // 是否显示时间选择器

  const { dynamicList: corpeventlist, getDynamicList, isLoading } = useSingleDynamicStore()

  useEffect(() => {
    const { endDate, dateRange } = activeDate
    let param = {
      companyCode: companycode,
      category: activeMenu.map((i) => i.value).join('|'),
      endDate,
      dateRange,
    }
    // @ts-expect-error
    getDynamicList(param)
  }, [activeDate, activeMenu])

  // 自定义时间确定

  // 动态时间
  const DynamicDateCheckBox = (
    <Row className="dynamicDate">
      <Col
        span={2}
        style={{
          color: '#666',
        }}
      >
        {intl('437308', '动态时间')}
      </Col>
      <Col span={22}>
        {dates.map((i, index) => (
          <span
            key={index}
            className={activeDate.name == i.name ? 'activeMenu span' : 'span'}
            onClick={() => {
              setActiveDate(i)
              setIsShowRangePicker(false)
            }}
            data-uc-id="4OzIG9uRUf"
            data-uc-ct="span"
            data-uc-x={index}
          >
            {intl('', i.name)}
          </span>
        ))}

        <span
          style={{
            position: 'relative',
          }}
          onClick={(e) => {
            // @ts-expect-error
            if (e.target.nodeName == 'SPAN') {
              setIsShowRangePicker(true)
            }
          }}
          // @ts-expect-error
          className={activeDate.name && customDate.name == activeDate.name ? 'activeMenu span' : 'span'}
          data-uc-id="kExfyvQeYI"
          data-uc-ct="span"
        >
          {/* @ts-expect-error */}
          {customDate.name || intl('25405', '自定义')}
          <RangePickerDialog
            show={isShowRangePicker}
            onClose={() => setIsShowRangePicker(false)}
            onChoose={(dateObj) => {
              // @ts-expect-error
              setActiveDate(dateObj)
              setCustomDate(dateObj)
            }}
            data-uc-id="Vh01LLdjwh"
            data-uc-ct="rangepickerdialog"
          />
        </span>
      </Col>
    </Row>
  )

  // 解析动态数据
  const mapCorpeventlist = (i, index) => {
    if (!i?.length) return <></>
    let title = i.length === 1 ? i[0]?.event_date || '' : ''
    let dot = i.length === 1 ? '' : <></>
    if (i.length === 1) {
      return (
        <Timeline.Item
          color="blue"
          title={title}
          dot={dot}
          key={index}
          data-uc-id="pqYVWpQtiS"
          data-uc-ct="timeline"
          data-uc-x={index}
        >
          <DynamicTimeLineItem data={i[0] || []} largeBottom></DynamicTimeLineItem>
        </Timeline.Item>
      )
    } else {
      return (
        <>
          <Timeline.Item color="blue" title={i[0]?.event_date} dot={''} data-uc-id="bmqfOVZrhi" data-uc-ct="timeline">
            <DynamicTimeLineItem data={i[0] || []}></DynamicTimeLineItem>
          </Timeline.Item>
          <DynamicCollapse data={i.slice(1)}></DynamicCollapse>
        </>
      )
    }
  }

  return (
    <>
      <Card className="dynamicFilter">
        {/* 动态类型 */}
        <HorizontalCheckBox
          isMultiple
          selected={activeMenu}
          options={menus}
          onSelect={(selected) => {
            setActiveMenu(selected)
          }}
          label={intl('432248', '动态类型')}
          data-uc-id="-QPprIHuxO"
          data-uc-ct="horizontalcheckbox"
        ></HorizontalCheckBox>

        {/* 动态时间 */}
        {DynamicDateCheckBox}

        {/* 动态时间轴 */}
        <div className="timelineBox">
          {isLoading ? (
            <Loading></Loading>
          ) : (
            <>
              {corpeventlist && corpeventlist.length ? (
                <Timeline data-uc-id="TjityyKyG" data-uc-ct="timeline">
                  {corpeventlist.map(mapCorpeventlist)}
                </Timeline>
              ) : (
                <Empty></Empty>
              )}
            </>
          )}
        </div>
      </Card>
    </>
  )
}

export default DynamicFilter
