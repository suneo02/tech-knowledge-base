/**
 * 基础渲染类型
 * 这个类型更新请谨慎，已经列举了业余不相关的可能配置
 */
type ConfigTableCellRenderTypeBase =
  // 日期类型，需要格式化为标准日期格式
  | 'date'
  // 数字类型，需要加上千分位，带有单位等
  | 'number'
  // 货币类型，需要格式化为带千分位的金额
  | 'currency'
  // 日期范围，如"证书有效期"等需要显示两个日期的字段
  | 'dateRange'
  // 图片
  | 'image'
  // 直接指定内容，使用 content 或 contentIntl 的值
  | 'static'

// 将枚举值转换为字符串字面量类型，用于JSON配置
export type ConfigTableCellRenderTypeLiteral =
  | ConfigTableCellRenderTypeBase
  // 自定义渲染函数，需要在代码中单独处理
  | 'custom'
  // 关联关系类型
  | 'relativeType'
  // 案件当事人
  | 'caseParty'
