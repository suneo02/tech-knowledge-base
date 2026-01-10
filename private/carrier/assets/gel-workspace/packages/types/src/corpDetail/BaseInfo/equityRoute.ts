import { ShareRateIdentifier, ShareRouteDetail } from '../shareholder'

/**
 * 股权链详情 - 主要数据结构
 */
export interface EquityRouteDetail extends ShareRateIdentifier {
  /** 实控人/股东ID */
  id: string
  /** 实控人/股东姓名 */
  name: string
  /** 持股路径列表（支持多条路径） */
  shareRoute: ShareRouteDetail[]
}
