/**
 * @description 定义从后端接收的 itemType 到其语义化名称的映射。
 * 使用枚举可以消除魔法字符串，增强代码的可读性和类型安全。
 */
export enum FilterType {
  /** 级联选择器（地区、行业等），会动态添加置信度选择器 */
  CASCADER_WITH_CONFIDENCE = '0',
  /** 逻辑关键词 (含任一/所有/不含 + tagsInput) */
  LOGICAL_KEYWORD = '1',
  /** 标签输入 */
  TAGS_INPUT = '2',
  /** 复选框 (可自动转为 Tree/带数字范围) */
  CHECKBOX = '3',
  /** 单选框 (可自动转为 带日期范围) */
  RADIO = '4',
  /** 单选框 (同4) */
  RADIO_ALT = '5',
  /** 数字范围 */
  NUMBER_RANGE = '6',
  /** 带搜索的输入框 */
  SEARCH = '9',
  /** 级联选择器（同0，兼容旧版） */
  CASCADER_WITH_CONFIDENCE_ALT = '10',
  /** 特殊组合筛选器 (包含/不包含 + 可搜索标签) */
  LOGIC_WITH_SEARCHABLE_TAGS = '91',

  /** 自定义类型：逻辑关键词筛选器（备用key） */
  LOGICAL_KEYWORD_FILTER = 'logicalKeywordFilter',
  /** 自定义类型：带置信度的级联选择器（备用key） */
  CONFIDENCE_TAG_FILTER = 'confidenceTagFilter',
}
