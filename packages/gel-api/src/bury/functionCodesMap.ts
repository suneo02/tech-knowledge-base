import { BaseFunctionConfig, currentPage } from './misc'

// functionCode功能点  opEntity功能名称  currentId当前id  opActive触发类型  currentPage当前页面 opSystem终端类型
export const functionCodesMap: Record<string, BaseFunctionConfig> = {
  // 首页
  '922610370001': {
    opEntity: '首页点击Alice',
    opActive: 'click',
    currentPage: currentPage.HOME,
  },

  // 对话
  '922610370002': {
    opEntity: '完成一次普通回答',
    opActive: 'click',
    currentPage: currentPage.CHAT,
  },
  '922610370003': {
    opEntity: '完成一次深度思考回答',
    opActive: 'click',
    currentPage: currentPage.CHAT,
  },
  '922610370004': {
    opEntity: '点赞',
    opActive: 'click',
    currentPage: currentPage.CHAT,
  },
  '922610370005': {
    opEntity: '点踩',
    opActive: 'click',
    currentPage: currentPage.CHAT,
  },
  '922610370006': {
    opEntity: '复制',
    opActive: 'click',
    currentPage: currentPage.CHAT,
  },

  // 卡片组件
  '922610370007': {
    opEntity: '点击企业卡片',
    opActive: 'click',
    currentPage: currentPage.CHAT,
  },
  '922610370008': {
    opEntity: '点击人物卡片',
    opActive: 'click',
    currentPage: currentPage.CHAT,
  },
  '922610370009': {
    opEntity: '点击招聘卡片',
    opActive: 'click',
    currentPage: currentPage.CHAT,
  },
  '922610370010': {
    opEntity: '点击商标卡片',
    opActive: 'click',
    currentPage: currentPage.CHAT,
  },
  '922610370011': {
    opEntity: '点击专利卡片',
    opActive: 'click',
    currentPage: currentPage.CHAT,
  },
  '922610370012': {
    opEntity: '点击图谱',
    opActive: 'click',
    currentPage: currentPage.CHAT,
  },
  '922610370013': {
    opEntity: '点击集团系卡片',
    opActive: 'click',
    currentPage: currentPage.CHAT,
  },
  '922610370014': {
    opEntity: '点击招投标卡片',
    opActive: 'click',
    currentPage: currentPage.CHAT,
  },

  //
  '922610370015': {
    opEntity: '点击查看参考资料详情',
    opActive: 'click',
    currentPage: currentPage.CHAT,
  },

  // 历史对话
  '922610370016': {
    opEntity: '点击历史对话',
    opActive: 'click',
    currentPage: currentPage.HISTORY,
  },
  '922610370017': {
    opEntity: '点击新增对话',
    opActive: 'click',
    currentPage: currentPage.HISTORY,
  },
  '922610370018': {
    opEntity: '收起历史对话',
    opActive: 'click',
    currentPage: currentPage.HISTORY,
  },
  '922610370019': {
    opEntity: '展开历史对话',
    opActive: 'click',
    currentPage: currentPage.HISTORY,
  },
  '922610370020': {
    opEntity: '历史对话改名',
    opActive: 'click',
    currentPage: currentPage.HISTORY,
  },
  '922610370021': {
    opEntity: '历史对话删除',
    opActive: 'click',
    currentPage: currentPage.HISTORY,
  },
  '922610370022': {
    opEntity: '进入我的收藏',
    opActive: 'click',
    currentPage: currentPage.HISTORY,
  },
  '922610370023': {
    opEntity: '对话添加收藏',
    opActive: 'click',
    currentPage: currentPage.HISTORY,
  },
  '922610370024': {
    opEntity: '对话取消收藏',
    opActive: 'click',
    currentPage: currentPage.HISTORY,
  },
  '922610370025': {
    opEntity: '我的收藏中批量取消收藏',
    opActive: 'click',
    currentPage: currentPage.HISTORY,
  },
  '922610370026': {
    opEntity: '我的收藏中点击对话跳转',
    opActive: 'click',
    currentPage: currentPage.HISTORY,
  },
}
