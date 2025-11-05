/**
 * 是否展示AIGC数据
 */
export const ENABLE_STREAM = true

/**
 * AIGC参考来源
 */
export const AIGC_SRC_TYPE = {
  NONE: 'NONE', // 没有参考资料
  DPU: 'DPU', // DPU表格
  RAG: 'RAG', // 文档召回
  MIX: 'MIX', // DPU+RAG
}

/**
 * Alice回答显示类型
 * 注：此处枚举值用于浏览器数据缓存和页面恢复，切勿随意修改！
 */
export const ALICE_SHOW_TYPE = {
  PRE_MATCH: 'PRE_MATCH', // 预先匹配
  TEXT: 'text', // 文本
  ERROR: 'error', // 错误
  FUNC: 'func', // 功能推荐
  FIRM_CARD: 'firmCard', // 实体插件
  STREAM: 'stream', // 流式
  RECALL: 'news', // 向量数据库
  F9: 'f9', // F9数据
  WFTCMD: 'WFTCMD', // 终端功能指令
  TBLIST: 'TBLIST', // 多表格
  TABLE: 'table', // 表格
}

/**
 * 流式状态
 */
export const TYPING_STATUS = {
  INIT: 'TYPING_INIT',
  DONE: 'TYPING_DONE',
}

/**
 * Alice问答模式
 */
export const ALICE_CHAT_MODE = {
  QA: 'QA', // 普通对话
  EXCEL: 'EXCEL', // ChatExcel
  PDF: 'PDF', // ChatPDF
}

/**
 * Alice模型参数配置
 */
export const ALICE_DEFAULT_CONFIG = {
  newFlow: '0', // 召回流程：0，DPU+AIGC；1，强制Type17；2，直接AIGC;
  callGLMType: '3', // 模型：3，Alice130；4，Kimi8K；
  ragVersion: 'V3', // 0,老流程；V1,新流程问句；V2,新流程关键词
}

/**
 * 万得数据库连接模式（newFlow参数的枚举值）
 */
export const ALICE_DB = {
  AUTO_CONN: '0', // 智能连接万得数据库
  FORCE_CONN: '1', // 强制连接万得数据库
  FORCE_DISCONN: '2', // 强制断连万得数据库
}

/**
 * 问答文件缓存
 */
export const CACHE_KEY_CHATDOC = 'CACHE_CHATDOC'

/**
 * 问答列表缓存Key
 */
export const CACHE_KEY_QALIST = 'CACHE_QALIST'

/**
 * 问答参数配置
 */
export const CACHE_KEY_ALICECONFIG = 'CACHE_ALICECONFIG'

/**
 * 问答列表最大展示个数
 */
export const MAX_QALIST_SIZE = 20

/**
 * 文档召回参考资料最大展示个数
 */
export const MAX_REFLINKS_SIZE = 5

/**
 * 3C会议最大展示个数
 */
export const MAX_3CMEETING_SIZE = 4

/**
 * 表格问答缓存Key
 */
export const CACHE_KEY_TABLE_SESSION = 'CACHE_TBSESSION'

/**
 * PDF问答缓存Key
 */
export const CACHE_KEY_PDF_SESSION = 'CACHE_PDFSESSION'

/**
 * Alice头像服务地址
 */
export const ALICE_AVATAR_HOST = 'https://SmartReport/'

/**
 * 支持导出EXCEL的数据类型
 */
export const ALICE_EXCEL_TYPE = ['table', 'chart', 'mult']

/**
 * 是否开启水印
 */
export const ENABLE_WATERMARK = true

/**
 * 是否开启ES检索结果全匹配
 */
export const ENABLE_ES_FULLMATCH = false

/**
 * 是否开启EDB作图
 */
export const ENABLE_EDB_CHART = true

/**
 * 是否开启表格转Excel文件形式
 */
export const ENABLE_TABLE2EXCEL = true

/**
 * 是否启用流式接口返回答案
 */
export const ENABLE_STREAM_ANSWER = true

/**
 * 是否启用流式问答继续生成模式
 * 1）用户主动停止生成 -> 显示继续生成按钮；
 * 2）点击继续生成 -> 擦除已生成内容 -> 重新生成回答；
 */
export const ENABLE_STREAM_RELAY = true

/**
 * 是否启用PDF流式接口返回答案
 */
export const ENABLE_PDF_STREAM_ANSWER = true

/**
 * 显示功能推荐的意图
 */
export const INTENTION_FUNC_TYPE = ['1.1', '1.2', '1.3', '1.4', '9']

/**
 * 实体类型
 */
export const ENTITY_TYPE = {
  STOCK_CN: '1', // 上、深股票
  PEOP: '3', // 人物库(@deprecated)
  FIRM: '4', // 企业
  STOCK_HK: '5', // 港股
  STOCK_US: '6', // 美股
  EDB: '7', // EDB
  BOND: '8', // 债券
  FUND: '9', // 基金
  INDEX: '10', // 指数
  PDB: '13', // 产业链(@deprecated)
  FUTURES: '16', // 期货
  FUNC: '21', // 快捷指令
  WU: '52', // 万得大学
}

/**
 * 扩展实体类型
 * 需要渲染为参考信息
 */
export const ENTITY_TYPE_EXTEND = {
  RN: 'RN', // 不固定
  NEWS: 'N', // 新闻
  RPP: 'R', // 研报
  ANN: 'A', // 公告
  LAW: 'L', // 法律法规
  YQ: 'YQ', // 舆情
  // CCC: '3C', // 3C会议

  // BK: 'BK', // 百科
}

/**
 * Alice数据来源枚举
 */
export const ALICE_DATASOURCE = {
  EQS: '0', // 智能选股
  REPORT: '1', // Grounding报表
  DPU_SH: '11', // DPU_SH
  DPU_NJ: '12', // DPU_NJ
  EDB: '2', // EDB数据库
  NEWS: '3',
  /** @deprecated 新闻公告研报法律法规 */
  RECALL: '4', // ES和向量数据库文档召回
  STREAM: '5', // EventSource流式文本
  WFTCMD: '6', // 终端功能指令
}

/**
 * 表格数据来源
 */
export const TB_SRCTYPE = {
  EDB: 'edb', // EDB数据
  EDE: 'function', // EDE数据
}

/**
 * 作图类型
 */
export const ALICE_CHART_TYPE = {
  1: 'bar', // 柱状图
  2: 'line', // 线图
  3: 'pie', // 饼图
  4: 'speed', // 行情图
  5: 'scatter', // 散点图
}

/**
 * 后台返回的图表类型枚举
 */
export const TABLE_CHART_TYPE = {
  BAR: '1',
  LINE: '2',
  PIE: '3',
  SPEED: '4',
}

/**
 * 数据接口枚举
 */
export const API_TYPE = {
  ALICE: 'V0',
  EDB: 'V1',
  RPP: 'V2',
  F9: 'V3',
}

/**
 * 问答模块功能点
 */
export const FUNCTION_ID = {
  ALICE_DATA: '901600330045',
  ALICE_FUNC: '901600330046',
  ALICE_SUGGEST: '901600330047',
}

/**
 * PDF类型
 */
export const CHAT_PDF_TYPE = {
  USER: 0, // 用户上传
  NEWS: 1, // 新闻（原A股公告）
  ANNC_HK: 2, // A股、港股公告
  RPP: 3, // 研报
  SRC_OCEAN: 1, // 预加工
  SRC_HTTP: 2, // 实时下载
}

/**
 * 文档问答支持的文件类型
 */
export const CHAT_FILE_EXTS = ['.pdf', '.avi.3c']

/**
 * DPU表格证券简称
 */
export const DPU_STOCK_NAME = ['证券简称', 'Short Name']

/**
 * DPU表格证券代码
 */
export const DPU_STOCK_CODE = ['Wind代码', '证券代码', 'Symbol', 'Code']

/**
 * Alice配置参数白名单
 */
export const ALICE_SETTING_USERLIST = [
  {
    userId: 'W0813391',
    roleType: '0',
  }, // jwchu
  {
    userId: 'W0818859',
    roleType: '0',
  }, // lzhu.raymond
  {
    userId: 'W0820520',
    roleType: '0',
  }, // slin
  {
    userId: 'W0818815',
    roleType: '0',
  }, // yyli
  {
    userId: 'W0823142',
    roleType: '0',
  }, // xwan
  {
    userId: 'W0822D18',
    roleType: '0',
  }, // syhe
  /** 以下用户不展示【流程：<'1', 强制Type17>】选项 */
  {
    userId: 'W0802054',
    /* '1179478' */
    roleType: '1',
  }, // jsun
]

export const RECORD_STATUS = {
  stop: 0, //停止
  doing: 1, // 正在录音
  pause: 2, //暂停
  unAuth: -1, // 未授权
  wsError: -2, // websocket出错，科大讯飞报错
  unAgreePrivacy: 104, // 未同意隐私协议
}
export const CONTINUE_SEARCH = true

export const DPU_ENTITY_MAP = [
  'FUND',
  'STOCKCN',
  'STOCKHK',
  'STOCKUS',
  'STOCKABROAD',
  'STOCKTW',
  'COMMODITY',
  'FUTURE',
  'INDICATOR',
  'BOND',
] //'BOND'
export const STOCK_ENTITY_TYPE = [
  'FUND',
  'STOCKCN',
  'STOCKHK',
  'STOCKUS',
  'STOCKABROAD',
  'STOCKTW',
  'COMMODITY',
  'FUTURE',
  'INDICATOR',
  'BOND',
] //'BOND'

export const API_STATUS_CODE = {
  needLogin: '5',
  HTTP_ERROR_403: 403,
}

export const APP_ID = 'wx9193c55d84d93289'

export const STORAGE_KEY = {
  userInfo: 'USER_INFO',
  userAvatar: 'USER_AVATAR',
  AGENT_LIST: 'AGENT_LIST',
  AGENT_LIST_HISTORY: 'AGENT_LIST_HISTORY',
  AGENT_LIST_EXPIRE: 'AGENT_LIST_EXPIRE',
}

export const DOC_RELATED = [
  '文章',
  '文件',
  '文档',
  '文献',
  '报告',
  '手册',
  '档案',
  '章节',
  '材料',
  '资料',
  '摘录',
  '节选',
  '简报',
  '论文',
  '摘要',
  '指南',
]

export const SCENE_INFO = {
  1020: '公众号profile相关',
  1035: '公众号自定义菜单',
  1036: 'App分享',
  1037: '小程序打开小程序',
  1038: '从另一个小程序返回',
  1043: '公众号模板消息',
  1007: '单人聊天会话',
  1008: '群聊会话',
}

export const DOC_FLAG = {
  WIND: 0,
  USER: 1,
  ALICE_BOX: 2,
}

export const EVENT_NAME = {
  keyBoardHeightChange: 'keyBoardHeightChange',
  selectFileItem: 'selectFileItem',
}
export const VALITYPE = [
  ENTITY_TYPE_EXTEND.ANN,
  ENTITY_TYPE_EXTEND.LAW,
  ENTITY_TYPE_EXTEND.NEWS,
  ENTITY_TYPE_EXTEND.RPP,
  ENTITY_TYPE_EXTEND.RN,
  ENTITY_TYPE_EXTEND.YQ,
]

export const WX_ERROR_CODE = {
  disAgreePrivacy: 104, //拒绝隐私协议
}

// 使用旧的会话历史接口
export const OLD_SESSION_INTERFACE = false

export const SESSION_FIELD_EXCHANGE = {
  title: 'chatTitle',
  publishdate: 'createTime',
  subjectID: 'chatId',
  content: 'qaContent',
}

export const FILE_MAX_SIZE = 50 * 1024 * 1024

export const FILE_DOWNLOAD_STATUS_CODE = {
  ok: 200,
}

export const IMAGE_FILE_EXT = ['JPG', 'JPEG', 'PNG', 'GIF', 'BMP', 'WEBP', 'SVG', 'HEIC']
export const IMAGE_FILE_EXTENSION = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.heic']

export const FILE_SRC = {
  ocean: 0,
  aliceBox: 1,
  wind_3C: 2,
}

// 设置缓存过期时间为1天
export const AGENT_LIST_EXPIRE_TIME = 24 * 60 * 60 * 1000
