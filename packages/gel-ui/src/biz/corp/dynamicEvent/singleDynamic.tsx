import { Tag } from '@wind/wind-ui'
import { CorpEvent } from 'gel-types'
import { formatMoneyTempFromWftCommon } from 'gel-util/format'
import { FC } from 'react'

export const getDynamicDetail: FC<{
  event_type: CorpEvent['event_type']
  event_status?: CorpEvent['event_status']
  event_abstract?: CorpEvent['event_abstract']
  caseReason?: CorpEvent['caseReason']
  role?: CorpEvent['role']
  announcementType?: string
}> = ({ event_type, event_status, event_abstract, caseReason, announcementType, role }) => {
  event_abstract = event_abstract || {}
  const {
    patentype,
    patentname,
    shareholdername,
    years,
    investname,
    round,
    amount,
    unit,
    invest_to,
    projectname,
    rank_name,
    job,
    judgetitle,
    trademarkname,
    softname,
    workname,
  } = event_abstract
  switch (event_type) {
    // 基础信息
    case '股东变更':
      if (event_status == '退出') {
        return `${shareholdername || ''} 退出`
      } else if (event_status == '新增') {
        return `新增股东：${shareholdername || ''}`
      }
      return `${shareholdername || ''} 持股变更`

    case '企业公告':
      return `发布${years || ''}年度报告`

    case '对外投资':
      if (event_status == '变动') {
        return `${event_type || ''}变动 ${investname || ''} `
      } else if (event_status == '新增') {
        return `新增${event_type || ''} ${investname || ''}`
      } else if (event_status == '退出') {
        return `${event_type || ''}退出 ${investname || ''}`
      }
      break
    case '专利信息':
      return patentype && `新增${patentype || ''}：${patentname || ''}`

    // 金融行为
    case 'PEVC融资':
      return (
        <span>
          {`进行${round}融资，金额：${formatMoneyTempFromWftCommon(amount, [2, unit])}`}
          <Tag style={{ color: '#63A074', backgroundColor: 'rgba(99, 160, 116, 0.14)' }}>利好</Tag>
        </span>
      )
    case '并购事件':
      return `新增${event_type || ''}，角色为${role || ''}`
    case '投资事件':
      return `参与${invest_to || ''}的${round || ''}融资`
    case '动产融资':
      return `发生${event_type || ''}${event_status || ''}`

    // 经营状况
    case '招投标公告':
      if (role == '中标人/供应商') {
        return `成为 "${projectname || ''}" 中标人`
      } else if (role == '拟定供应商') {
        return `成为 "${projectname || ''}" 拟定供应商`
      } else if (role == '中标候选人') {
        return `成为 "${projectname || ''}" 中标候选人`
      } else if (role == '采购单位') {
        if (projectname) {
          return `发布 "${projectname}" 公告`
        }
        return `参与的招标项目发布新公告`
      }
      return `参与的招标项目发布新公告`
    case '上榜信息':
      return `新增上榜：${rank_name || ''}`

    case '招聘信息':
      return `发布职位：${job || ''}`

    // 法律诉讼
    case '裁判文书':
      return `新增 "${judgetitle || ''}"`
    case '开庭公告':
      return `新增开庭公告${caseReason ? ':' + caseReason : ''}`
    case '法院公告':
      return `新增法院公告${announcementType ? '-' + announcementType : ''} ${caseReason ? ':' + caseReason : ''}`

    // 知识产权
    case '商标信息':
      return `新增申请 "${trademarkname || ''}" 商标`
    case '作品著作权':
      return `新增${workname || ''}登记`
    case '软件著作权':
      return `新增${softname || ''}登记`

    default:
      return `发生${event_status || ''}变更`
  }
}
