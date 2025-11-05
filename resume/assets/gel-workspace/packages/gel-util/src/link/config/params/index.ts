// 定义每个模块的参数接口
import { CompanyParams } from './company'
import { KGLinkActiveKeyEnum, KGLinkParams } from './kg'
import { RPLinkParams } from './report'
import { UserLinkParams } from './user'

export { UserLinkParamEnum } from './user'
export { KGLinkActiveKeyEnum }

export type LinkParams = KGLinkParams & UserLinkParams & CompanyParams & RPLinkParams
