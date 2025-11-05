import { Card, Col, Collapse, DatePicker, Link, Row, Tag, Timeline } from '@wind/wind-ui'
import { useEffect, useRef, useState } from 'react'
import { useSingleDynamicStore } from '../../store/singleCompanyDynamic'
import intl from '../../utils/intl'
import { wftCommon } from '../../utils/utils'
import './DynamicFilter.less'
import HorizontalCheckBox from './HorizontalCheckBox'

import fold_icon from '../../assets/icons/icon-fold.png'
import RangePickerDialog from './RangePickerDialog'

const { RangePicker } = DatePicker
const Panel = Collapse.Panel

const now = new Date()
let CurrentDate = Number(now.getFullYear() + ('0' + (now.getMonth() + 1)).slice(-2) + ('0' + now.getDate()).slice(-2))

const menus = [
  {
    name: intl('138649', '不限'),
    value: '',
    langkey: '',
    children: [],
    isAll: true,
  },
  {
    name: intl('134852', '基础信息'),
    value: '基础信息',
    langkey: '',
    children: [
      {
        name: intl('352693', '全部基础信息'),
        value: '',
        langkey: '',
        isAll: true,
      },
      {
        name: intl('451218', '股东变更'),
        value: '股东变更',
        langkey: '',
      },
      {
        name: intl('451225', ' 工商变更 '),
        value: '工商变更',
        langkey: '',
      },
      {
        name: intl('260828', '企业公告'),
        value: '企业公告',
        langkey: '',
      },
      {
        name: intl('138724', '对外投资'),
        value: '对外投资',
        langkey: '',
      },
    ],
  },
  {
    name: intl('261899', '金融行为'),
    value: '金融行为',
    langkey: '',
    children: [
      {
        name: intl('352713', '全部金融行为'),
        value: '',
        langkey: '',
        isAll: true,
      },
      {
        name: intl('138924', 'PEVC融资'),
        value: 'PEVC融资',
        langkey: '',
      },
      {
        name: intl('40559', '投资事件'),
        value: '投资事件',
        langkey: '',
      },
      {
        name: intl('2171', '并购事件'),
        value: '并购事件',
        langkey: '',
      },
      {
        name: intl('243422', '动产融资'),
        value: '动产融资',
        langkey: '',
      },
    ],
  },
  {
    name: intl('451255', '经营信息'),
    value: '经营状况',
    langkey: '',
    children: [
      {
        name: intl('370839', '全部经营信息'),
        value: '',
        langkey: '',
        isAll: true,
      },
      {
        name: intl('352695', '招投标信息'),
        langkey: '',
        value: '招投标公告',
      },
      {
        name: intl('138468', '上榜信息'),
        value: '上榜信息',
        langkey: '',
      },
      {
        name: intl('260903', '招聘信息'),
        value: '招聘信息',
        langkey: '',
      },
    ],
  },
  {
    name: intl('138368', '法律诉讼'),
    value: '法律诉讼',
    langkey: '',
    children: [
      {
        name: intl('352696', '全部法律诉讼'),
        value: '',
        langkey: '',
        isAll: true,
      },
      {
        name: intl('138731', '裁判文书'),
        value: '裁判文书',
        langkey: '',
      },
      {
        name: intl('138657', '开庭公告'),
        value: '开庭公告',
        langkey: '',
      },
      {
        name: intl('138226', '法院公告'),
        value: '法院公告',
        langkey: '',
      },
    ],
  },
  {
    name: intl('120665', '知识产权'),
    value: '知识产权',
    langkey: '',
    children: [
      {
        name: intl('352714', '全部知识产权'),
        langkey: '',
        value: '',
        isAll: true,
      },
      {
        name: intl('204102', '商标信息'),
        value: '商标信息',
        langkey: '',
      },
      {
        name: intl('149797', '专利信息'),
        value: '专利信息',
        langkey: '',
      },
      {
        name: intl('138756', '作品著作权'),
        value: '作品著作权',
        langkey: '',
      },
      {
        name: intl('138788', '软件著作权'),
        value: '软件著作权',
        langkey: '',
      },
    ],
  },
]

const dates = [
  {
    name: intl('138649', '不限'),
    langkey: '',
    endDate: '',
    // dateRange:''
  },
  {
    name: intl('8886', '今日'),
    langkey: '',
    endDate: CurrentDate,
    dateRange: 1,
  },
  {
    name: intl('19332', '昨日'),
    langkey: '',
    endDate: CurrentDate - 1,
    dateRange: 1,
  },
  {
    name: intl('437307', '近一周'),
    langkey: '',
    endDate: CurrentDate,
    dateRange: 7,
  },

  {
    name: intl('437325', '近一月'),
    langkey: '',
    endDate: CurrentDate,
    dateRange: 30,
  },
  {
    name: intl('9073', '近三月'),
    langkey: '',
    endDate: CurrentDate,
    dateRange: 90,
  },
  {
    name: intl('237722', '近半年'),
    langkey: '',
    endDate: CurrentDate,
    dateRange: 183,
  },
  {
    name: intl('73399', '近一年'),
    langkey: '',
    endDate: CurrentDate,
    dateRange: 365,
  },
]
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
const DynamicTimeLineItem = ({ data: i, largeBottom = false }) => {
  return (
    <>
      <div
        style={{
          margin: '0 12px',
          fontSize: '14px',
          // margin: isFolded?'12px 0 0':'24px 0 0px',
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
        >
          {i?.event_type || ''}
        </Tag>
        <span style={{ color: '#333', fontWeight: 'bold' }}>{mapText2JSX(i)}</span>
      </div>
      {i?.event_type_raw === '企业公告' ? (
        <>
          <DynamicLink
            text={'>> ' + intl('260769', '点击查看年报详情')}
            icon={null}
            style={{
              margin: '-12px 12px 12px',
            }}
            onClick={() => {
              let url = wftCommon.isDevDebugger()
                ? `Wind.WFC.Enterprise.Web/PC.Front/Company/yearReport.html?companyCode=${i?.corp_id}&year=${i?.event_abstract?.years}`
                : `yearReport.html?companyCode=${i.corp_id}&year=${i?.event_abstract?.years}`
              window.open(url)
            }}
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
          target="_blank"
          href={`${prefix}index.html?nosearch=1#/biddingDetail?detailid=${event_source_id}${suffix}`}
        >
          {text}
        </Link>
      )
    case '招聘信息':
      return (
        <Link
          target="_blank"
          href={`${prefix}index.html#/jobDetail?type=jobs&detailid=${event_source_id}&jobComCode=${corp_id}${suffix}`}
        >
          {text}
        </Link>
      )

    // 法律诉讼
    case '裁判文书':
      return (
        <Link
          target="_blank"
          href={`${prefix}index.html#/lawdetail?reportName=Judgment&id=${event_source_id}${suffix}`}
        >
          {text}
        </Link>
      )
    case '开庭公告':
      return (
        <Link
          target="_blank"
          href={`${prefix}index.html#/lawdetail?reportName=CourtSession&id=${event_source_id}${suffix}`}
        >
          {text}
        </Link>
      )
    case '法院公告':
      return (
        <Link
          target="_blank"
          href={`${prefix}index.html#/lawdetail?reportName=CourtAnnouncement&id=${event_source_id}${suffix}`}
        >
          {text}
        </Link>
      )

    // 知识产权
    case '商标信息':
      return (
        <Link
          target="_blank"
          href={`${prefix}index.html?type=brand&expover=${0}&detailid=${event_source_id}${suffix}#/logoDetail`}
        >
          {text}
        </Link>
      )
    case '专利信息':
      return (
        <Link target="_blank" href={`${prefix}index.html#/patentDetail?nosearch=1&detailId=${event_id}${suffix}`}>
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
      <Timeline.Item color="blue" title={''} dot={<></>}>
        <DynamicLink
          style={CollapseStyle}
          text={text}
          onClick={() => {
            setIsCollapse(false)
          }}
        ></DynamicLink>
      </Timeline.Item>
    </>
  ) : (
    data.map((i, index, arr) => (
      <Timeline.Item color="blue" title={''} dot={<></>}>
        <DynamicTimeLineItem data={i} largeBottom={index === arr.length - 1}></DynamicTimeLineItem>
      </Timeline.Item>
    ))
  )
}

const DynamicFilter = ({ showSubMenu = true, companycode }) => {
  const [dateRaw, setDateRaw] = useState([])
  const [customDate, setCustomDate] = useState({}) // 自定义时间
  const [activeMenu, setActiveMenu] = useState([menus[0]])

  const [activeDate, setActiveDate] = useState(dates[0])
  const [isShowRangePicker, setIsShowRangePicker] = useState(false) // 是否显示时间选择器

  const scrollRef = useRef()

  const { dynamicList: corpeventlist, getDynamicList, addDynamicList, isLoading } = useSingleDynamicStore()

  useEffect(() => {
    const { endDate, dateRange } = activeDate
    let param = {
      companyCode: companycode,
      category: activeMenu.map((i) => i.value).join('|'),
      endDate,
      dateRange,
    }
    getDynamicList(param)
    let isRequest = false
    const loadMore = async (e) => {
      const { offsetHeight, scrollHeight, scrollTop } = e.target

      if (scrollTop + offsetHeight >= scrollHeight - 24) {
        if (isRequest) return
        isRequest = true
        await addDynamicList(param)
        isRequest = false
      }
    }
  }, [activeDate, activeMenu])

  // 自定义时间确定
  const handleConfirm = () => {
    let value = dateRaw
    let dateObj = {}
    if (value && value[0] && value[1]) {
      let date = value[0].format('YYYY-MM-DD') + '~' + value[1].format('YYYY-MM-DD')

      // 定义两个时间字符串
      const date1 = value[1].format('YYYY-MM-DD')
      const date2 = value[0].format('YYYY-MM-DD')

      // 将时间字符串转换为Date对象
      const time1 = new Date(date1)
      const time2 = new Date(date2)

      // 计算两个时间的差值
      const diffTime = Math.abs(time1 - time2) // 得到的是毫秒数
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1 // 将毫秒数转换为天数，并向上取整, 不能为0！，为0时转成1

      dateObj = {
        name: date,
        endDate: value[1].format('YYYYMMDD'),
        dateRange: diffDays,
      }
    }
    setActiveDate(dateObj)
    setCustomDate(dateObj)
    setIsShowRangePicker(false)
  }

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
          >
            {intl('', i.name)}
          </span>
        ))}

        <span
          style={{
            position: 'relative',
          }}
          onClick={(e) => {
            if (e.target.nodeName == 'SPAN') {
              setIsShowRangePicker(true)
            }
          }}
          className={activeDate.name && customDate.name == activeDate.name ? 'activeMenu span' : 'span'}
        >
          {customDate.name || intl('25405', '自定义')}
          <RangePickerDialog
            show={isShowRangePicker}
            onClose={() => setIsShowRangePicker(false)}
            onChoose={(dateObj) => {
              setActiveDate(dateObj)
              setCustomDate(dateObj)
            }}
          />
        </span>
      </Col>
    </Row>
  )

  // 解析动态数据
  const mapCorpeventlist = (i, index, arr) => {
    if (!i?.length) return <></>
    let title = i.length === 1 ? i[0]?.event_date || '' : ''
    let dot = i.length === 1 ? '' : <></>
    if (i.length === 1) {
      return (
        <Timeline.Item color="blue" title={title} dot={dot} key={index}>
          <DynamicTimeLineItem data={i[0] || []} largeBottom></DynamicTimeLineItem>
        </Timeline.Item>
      )
    } else {
      return (
        <>
          <Timeline.Item color="blue" title={i[0]?.event_date} dot={''}>
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
                <Timeline>{corpeventlist.map(mapCorpeventlist)}</Timeline>
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
