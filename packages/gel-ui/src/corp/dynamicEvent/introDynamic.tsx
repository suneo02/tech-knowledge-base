import { CorpEvent } from 'gel-types'
import { formatPevcMoney, formatText } from 'gel-util/format'

export const DynamicEventAbstract = ({ content }) => <span className="dynamic-event-abstract">{content}</span>

export const getDynamicEventInnerContent = (
  type: CorpEvent['event_type'],
  status: CorpEvent['event_status'],
  role: CorpEvent['role'],
  eachList: CorpEvent
) => {
  var abstract = eachList.event_abstract || {}
  var describe = eachList.event_describe || {}
  var source_id = eachList.event_source_id
  var companycode = eachList.corp_id

  if (type == '股东变更' && (status == '新增' || status == '持股变更' || status == '变动')) {
    return <DynamicEventAbstract content={`${formatText(abstract.shareholdername)} 持股变更`} />
  }
  if (type == '股东变更' && status == '退出') {
    return <DynamicEventAbstract content={`${formatText(abstract.shareholdername)} 退出`} />
  }

  if (type == '工商变更') {
    return <span className="dynamic-event-abstract ">发生{formatText(abstract.changeitem)}变更</span>
  } else if (type == '企业公告') {
    return <span className="dynamic-event-abstract ">发布{formatText(abstract.years)}年度报告</span>
  } else if (type == '对外投资') {
    return <span className="dynamic-event-abstract ">新增投资{formatText(abstract.investname)}</span>
  } else if (type == 'PEVC融资') {
    return (
      <span className="dynamic-event-abstract ">
        进行{formatText(abstract.round)}融资，金额
        {formatPevcMoney(abstract, describe)}
      </span>
    )
  } else if (type == '投资事件') {
    return (
      <span className="dynamic-event-abstract ">
        参与{formatText(abstract.invest_to)}的{formatText(abstract.round)}融资
        {abstract.unit ? abstract.unit : ''}
      </span>
    )
  } else if (type == '并购事件') {
    return <span className="dynamic-event-abstract ">新增并购，角色为{formatText(abstract.role)}</span>
  } else if (type == '动产抵押' && role == '抵押人') {
    return <span className="dynamic-event-abstract ">新增{formatText(abstract.amount)}的动产抵押</span>
  } else if (type == '动产抵押' && role == '抵押权人') {
    return <span className="dynamic-event-abstract ">新增{formatText(abstract.amount)}的动产抵押</span>
  } else if (type == '动产融资' && status == '初始登记') {
    return <span className="dynamic-event-abstract ">发生动产融资{formatText(status)}</span>
  } else if (type == '动产融资' && status == '变更登记') {
    return <span className="dynamic-event-abstract ">发生动产融资{formatText(status)}</span>
  } else if (type == '动产融资') {
    return `发生${type || ''}${status || ''}`
  } else if (type == '招投标公告' && role == '投标单位') {
    return (
      <a
        className="w-link wi-link-color"
        target="_blank"
        href={`index.html?nosearch=1#/biddingDetail?detailid=${formatText(source_id)}`}
        rel="noreferrer"
      >
        <span className="dynamic-event-abstract underline-n">投标 "{formatText(abstract.projectname)}"</span>
      </a>
    )
  } else if (type == '招投标公告' && role == '代理机构') {
    return (
      <a
        className="w-link wi-link-color"
        target="_blank"
        href={`index.html?nosearch=1#/biddingDetail?detailid=${formatText(source_id)}`}
        rel="noreferrer"
      >
        <span className="dynamic-event-abstract underline-n">代理项目发布新公告</span>
      </a>
    )
  } else if (type == '招投标公告' && role == '中标人/供应商') {
    return (
      <span className="dynamic-event-abstract underline-n">
        <a
          className="w-link wi-link-color"
          target="_blank"
          href={`index.html?nosearch=1#/biddingDetail?detailid=${formatText(source_id)}`}
          rel="noreferrer"
        >
          中标 "{formatText(abstract.projectname)}"
        </a>
      </span>
    )
  } else if (type == '招投标公告' && role == '中标候选人') {
    return (
      <a
        className="w-link wi-link-color"
        target="_blank"
        href={`index.html?nosearch=1#/biddingDetail?detailid=${formatText(source_id)}`}
        rel="noreferrer"
      >
        <span className="dynamic-event-abstract underline-n">成为 "{formatText(abstract.projectname)}" 候选人</span>
      </a>
    )
  } else if (type == '招投标公告' && role == '拟定供应商') {
    return (
      <a
        className="w-link wi-link-color"
        target="_blank"
        href={`index.html?nosearch=1#/biddingDetail?detailid=${formatText(source_id)}`}
        rel="noreferrer"
      >
        <span className="dynamic-event-abstract underline-n">成为 "{formatText(abstract.projectname)}" 拟定供应商</span>
      </a>
    )
  } else if (type == '招投标公告' && role == '采购单位') {
    return (
      <a
        className="w-link wi-link-color"
        target="_blank"
        href={`index.html?nosearch=1#/biddingDetail?detailid=${formatText(source_id)}`}
        rel="noreferrer"
      >
        {abstract?.projectname ? (
          <span className="dynamic-event-abstract">发布 "{formatText(abstract.projectname)}" 公告</span>
        ) : (
          <span className="dynamic-event-abstract">招标项目发布新公告</span>
        )}
      </a>
    )
  } else if (type == '招聘信息') {
    return (
      <a
        className="w-link wi-link-color"
        target="_blank"
        href={`index.html#/jobDetail?type=jobs&detailid=${formatText(source_id)}&jobComCode=${companycode}`}
        rel="noreferrer"
      >
        <span className="dynamic-event-abstract underline-n">发布职位 {formatText(abstract.job)}</span>
      </a>
    )
  } else if (type == '裁判文书') {
    return (
      <a
        className="w-link wi-link-color"
        target="_blank"
        href={`index.html#/lawdetail?reportName=Judgment&id=${formatText(source_id)}`}
        rel="noreferrer"
      >
        <span className="dynamic-event-abstract underline-n">新增{formatText(abstract.judgetitle)}</span>
      </a>
    )
  } else if (type == '开庭公告') {
    return (
      <a
        className="w-link wi-link-color"
        target="_blank"
        href={`index.html#/lawdetail?reportName=CourtSession&id=${formatText(source_id)}`}
        rel="noreferrer"
      >
        <span className="dynamic-event-abstract underline-n">
          新增{formatText(type)}：{formatText(eachList.caseReason)}
        </span>
      </a>
    )
  } else if (type == '法院公告') {
    return (
      <a
        className="w-link wi-link-color"
        target="_blank"
        href={`index.html#/lawdetail?reportName=CourtAnnouncement&id=${formatText(source_id)}`}
        rel="noreferrer"
      >
        <span className="dynamic-event-abstract underline-n">新增{formatText(type)}</span>
      </a>
    )
  } else if (type == '商标信息') {
    return (
      <a
        className="w-link wi-link-color"
        target="_blank"
        href={`index.html?type=brand&detailid=${formatText(source_id)}#/logoDetail`}
        rel="noreferrer"
      >
        <span className="dynamic-event-abstract underline-n">新增申请{formatText(abstract.trademarkname)}商标</span>
      </a>
    )
  } else if (type == '专利信息') {
    return (
      <a
        className="w-link wi-link-color"
        target="_blank"
        href={`index.html#/patentDetail?type=patent&detailid=${formatText(source_id)}`}
        rel="noreferrer"
      >
        <span className="dynamic-event-abstract underline-n">
          新增{formatText(abstract.patentype)}
          {formatText(abstract.patentname)}
        </span>
      </a>
    )
  } else if (type == '作品著作权') {
    return <span className="dynamic-event-abstract ">新增{formatText(abstract.workname)}登记</span>
  } else if (type == '软件著作权') {
    return <span className="dynamic-event-abstract ">新增{formatText(abstract.softname)}登记</span>
  } else {
    return null
  }
}
