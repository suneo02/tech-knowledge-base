export enum LayoutStateEnum {
  HORIZONTAL = "horizontal", // 水平
  VERTICAL = "vertical", // 垂直
  TABS = "tabs", // 标签页
}

export enum ComponentTypeEnum {
  INTEGRATION = "integration",
  TABLE = "table",
  DESCRIPTIONS = "descriptions",
  CHARTS = "charts",
  CHAINS = "chains",
}

export enum ComponentTypeNumEnum {
  INTEGRATION = 1,
  TABLE,
  DESCRIPTIONS,
  CHARTS,
  CHAINS,
}

export enum VipTypeEnum {
  NO = "",
  VIP = "vip",
  SVIP = "svip",
}

export enum AlignTypeEnum {
  LEFT = "left",
  CENTER = "center",
  RIGHT = "right",
}

export enum ColumnTypeEnum {
  INDEX = 1, // 序号
  TEXT = 2, // 文本
  TEXTAREA = 3, // 文本域
  NUMBER = 4, // 数字
  PERCENT = 5, // 百分比
  CURRENCY = 6, // 货币
  DATE = 7, // 时间
  LINKS = 8, // 超链
  HTML = 9, // HTML
  CHG = 10, // 涨跌幅
  IMAGE = 11, // 图片
  INFO = 12, // 详情
  CHAIN = 13, // 股权链
  ARRAY = 14, // 数组
  TREE = 15, // 树结构
}

/** 项目模块类型 */
export enum ModuleTypeEnum {
  COMPANY = 1, // 企业
  GROUP, // 集团
  CHARACTER, // 人物
  WEB, // 外链
  FETURED, // 榜单名录
}
