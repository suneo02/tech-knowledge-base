import { CDESubscribeItem } from '@/wfc'
import { CDEFilterResItem, getCDEFilterResPayload } from '@/windSecure'
import { ApiResponseForSuperlist, ApiResponseForSuperlistWithPage } from '../types'

export interface SuperListCdeMonitor extends Omit<CDESubscribeItem, 'subMail'> {
  // 更新的企业数量
  count: number
  // 最后更新时间
  lastUpdateTime: string
}

export interface superListCdeApiPathMap {
  // cde 结果预览(用于首页)
  'company/getcrossfilter2': {
    data: getCDEFilterResPayload
    response: ApiResponseForSuperlistWithPage<CDEFilterResItem>
  }
  // cde 数据添加至表格
  'cde/addCDEToTable': {
    data: getCDEFilterResPayload & {
      conversationId: string
      tableId: string
      // 不传则默认添加到第一个sheet
      sheetId?: string
    }
    response: ApiResponseForSuperlist
  }
  // 获取更新企业数量
  'cde/getUpdateEnterpriseCount': {
    data: {
      tableId: string
    }
    response: ApiResponseForSuperlist<{
      count: number
    }>
  }
  // 获取监控组详情（当前table 的筛选组清单）
  'cde/getMonitorList': {
    data: {
      tableId: string
    }
    response: ApiResponseForSuperlist<{
      list: SuperListCdeMonitor[]
      // 总更新企业数量
      count: number
    }>
  }

  // cde 监控数据预览 用于查看更新的企业
  'cde/monitorPreview': {
    data: {
      monitorId: string
    }
    response: ApiResponseForSuperlist<{
      list: SuperListCdeMonitor[]
    }>
  }

  // 更改推送邮件
  'cde/updatePushEmail': {
    data: {
      email: string
    }
    response: ApiResponseForSuperlist
  }
  // 更改监控详情
  'cde/updateMonitorDetail': {
    // 无法修改 superQueryLogic
    data: Omit<CDESubscribeItem, 'superQueryLogic'>
    response: ApiResponseForSuperlist
  }

  // 筛选组一键全部开启推送或关闭
  'cde/updateMonitorAll': {
    data: {
      tableId: string
      subPush: boolean
    }
    response: ApiResponseForSuperlist
  }
}
