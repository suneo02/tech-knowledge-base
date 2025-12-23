import { formatPevcMoney, formatText } from 'gel-util/format'

interface DynamicDetailProps {
  event_type: string
  event_status: string
  event_abstract: {
    patentype?: string
    patentname?: string
    shareholdername?: string
    years?: string
    investname?: string
    round?: string
    invest_to?: string
    projectname?: string
    rank_name?: string
    job?: string
    judgetitle?: string
    trademarkname?: string
    workname?: string
    changeitem?: string
  }
  event_describe: any
  caseReason: string
  announcementType: string
  role: string
  corp_name: string
}

/**
 * 生成动态摘要文本
 */
export const getHomeDynamicDetail = ({
  event_type,
  event_status,
  event_abstract,
  event_describe,
  caseReason,
  announcementType,
  role,
  corp_name,
}: DynamicDetailProps) => {
  event_abstract = event_abstract || {}
  const {
    patentype,
    patentname,
    shareholdername,
    years,
    investname,
    round,
    invest_to,
    projectname,
    rank_name,
    job,
    judgetitle,
    trademarkname,
    workname,
    changeitem,
  } = event_abstract

  switch (event_type) {
    // ... 保持原有的 case 逻辑和中文字符不变 ...
    // 基础信息
    case '股东变更':
      if (event_status == '退出') {
        return `${corp_name || ''} 股东 ${shareholdername || ''} 退出`
      } else if (event_status == '新增') {
        return `${corp_name || ''}新增股东：${shareholdername || ''}`
      }
      return `${corp_name || ''} 股东 ${shareholdername || ''} 持股变更`

    case '工商变更':
      return `${corp_name || ''}发生${formatBusinessStr(changeitem)}变更`

    case '企业公告':
      return `${corp_name || ''}发布${years || ''}年度报告`

    case '对外投资':
      if (event_status == '变动') {
        return `${event_type || ''}变动 ${investname || ''} `
      } else if (event_status == '新增') {
        return `新增${event_type || ''} ${investname || ''}`
      } else if (event_status == '退出') {
        return `${event_type || ''}退出 ${investname || ''}`
      } else {
        return `${corp_name || ''}新增对外投资：${investname || ''}`
      }

    // 金融行为
    case 'PEVC融资':
      let pevcstr = round || ''
      if (round && round.indexOf('融资') < -1) {
        pevcstr = round + '融资'
      }
      return `${corp_name}进行${formatText(pevcstr)}融资，金额：${formatPevcMoney(event_abstract, event_describe || {})}`
    case '并购事件':
      return `${corp_name || ''}新增并购事件，角色为${role || ''}`
    case '投资事件':
      return `${corp_name || ''}参与${invest_to || ''}的${round || ''}融资`
    case '动产融资':
      return `${corp_name || ''}发生动产融资${event_status || ''}`

    // 经营状况
    case '招投标公告':
      if (role == '中标人/供应商') {
        return `${corp_name || ''}成为“${projectname || ''}”中标人`
      } else if (role == '拟定供应商') {
        return `${corp_name || ''}成为“${projectname || ''}”拟定供应商`
      } else if (role == '中标候选人') {
        return `${corp_name || ''}成为“${projectname || ''}”中标候选人`
      } else if (role == '采购单位') {
        if (projectname) {
          return `${corp_name || ''}发布“${projectname}”公告`
        }
        return `${corp_name || ''}参与的招标项目发布新公告`
      } else if (role == '代理机构') {
        return `${corp_name || ''}代理的项目发布新公告`
      }
      return `${corp_name || ''}参与的招标项目发布新公告`
    case '上榜信息':
      return `${formatText(event_type)}${corp_name || ''}新增上榜：${formatText(rank_name)}`

    case '招聘信息':
      return `${corp_name || ''}发布职位：${job || ''}`

    // 法律诉讼
    case '裁判文书':
      return `${corp_name || ''}新增“${judgetitle || ''}”`
    case '开庭公告':
      return `${corp_name || ''}新增${formatText(event_type)}${caseReason}`
    case '法院公告':
      return `${corp_name || ''}新增${formatText(event_type)}${announcementType}`

    // 知识产权
    case '商标信息':
      return `${corp_name || ''}新增申请“${trademarkname || ''}”商标`
    case '专利信息':
      return `${corp_name || ''}新增${formatText(patentype)}：${formatText(patentname)}`
    case '作品著作权':
      return `${corp_name || ''}新增${formatText(workname)}登记`
    case '软件著作权':
      return `${corp_name || ''}新增${formatText(workname)}登记`

    default:
      return `发生${event_status || ''}变更`
  }
}

const formatBusinessStr = (str?: string) => {
  if (str && str.length > 0) {
    if (str.substring(0, 2) == '发生') {
      str = str.substring(2)
    }
    const len = str.length
    if (str.substring(len - 2) == '变更') {
      str = str.substring(0, len - 2)
    }
    return str
  } else {
    return '--'
  }
}
