import { t } from 'gel-util/intl'

// 友情链接
export const LINK_ENUM = {
  AI_FINANCIAL: 'aifinancial', // 智能财报诊断
  AI_FINANCIAL_PROCESS: 'aifinancial-process', // 智能财报诊断-上传
  PARK: 'park', // 重点园区
  CHAIN: 'chain', // 产业链
  SUPPLY: 'supply', // 供应链
  NEW_CORP: 'newcorp', // 新企发现
  BATCH_OUTPUT: 'batchoutput', // 批量查询导出
  GROUP_CHART: 'groupchart', // 集团系图谱
}

export const INNER_LINK_ENUM = {
  // 内部链接（从InnerLinks合并）
  AI_CHAT: 'aichat', // AI对话
  SUPER: 'super', // 一句话找企业
  CREDITS: 'credits', // 一句话找企业-积分
  SUPER_CHAT: 'superChat', // 一句话找企业-聊天
}

// 友情链接标题
export const LINK_ENUM_TITLE = {
  [LINK_ENUM.AI_FINANCIAL]: t('456274', '智能财报诊断'),
  [LINK_ENUM.AI_FINANCIAL_PROCESS]: t('', '智能财报诊断-上传'),
  [LINK_ENUM.PARK]: t('294403', '重点园区'),
  [LINK_ENUM.CHAIN]: t('298427', '产业链'),
  [LINK_ENUM.SUPPLY]: t('314444', '供应链'),
  [LINK_ENUM.NEW_CORP]: t('235783', '新企发现'),
  [LINK_ENUM.BATCH_OUTPUT]: t('422040', '批量查询导出'),
  [LINK_ENUM.GROUP_CHART]: t('312974', '集团系图谱'),
}

export const INNER_LINK_ENUM_TITLE = {
  // 内部链接标题（从InnerLinks合并）
  [INNER_LINK_ENUM.AI_CHAT]: t('466895', '万得企业库Alice'),
  [INNER_LINK_ENUM.SUPER]: t('464234', '一句话找企业'),
  [INNER_LINK_ENUM.CREDITS]: t('464258', '我的积分'),
  [INNER_LINK_ENUM.SUPER_CHAT]: t('464234', '一句话找企业'),
}
