import { ApiPageForSuperlist } from '..'

export enum PointsChangeType {
  ALL = 0, // 全部
  RECHARGE = 1, // 充值
  CONSUME = 2, // 消耗
  EXPIRE = 3, // 过期
  ADMIN_GIVE = 4, // 管理员赠送
  ADMIN_CONSUME = 5, // 管理员消耗
  GIVE = 6, // 赠送
}

export interface PointsChangeItem {
  changeRemarks: string // 备注
  createUserId: number // 创建者ID
  createTime: string // 记录时间
  updateUserId: number // 更新者ID
  changeInfo: string // 变更信息
  changeType: PointsChangeType // 变更类型 用户(0赠送,1充值,2消耗,3过期)
  changeCount: number // 变更数量
  updateTime: string // 更新时间
  id: number // 记录ID
  userId: number // 用户ID
  endTime: string // 过期时间
}

export interface GetPointsChangeListRequest {
  pageNo: number
  pageSize: number
  changeType?: PointsChangeType
}

export interface GetPointsChangeListResponse {
  list: PointsChangeItem[]
  page: ApiPageForSuperlist
}

export interface GetUserPointsInfoResponse {
  pointTotal: number // 剩余积分
  latestExpiringPoints: {
    pointCount: number // 积分数量
    pointSurplus: number // 剩余积分
    pointSource: string // 积分来源
    endTime: string // 过期时间
    pointType: number // 积分类型
  }
}
