// Footer组件相关常量定义
export const FOOTER_CONSTANTS = {
  // 样式相关
  UI: {
    BUTTON_HEIGHT: 28, // 按钮高度
    ICON_MARGIN_END: 4, // 图标右边距
    INFO_ICON_SIZE: 14, // 信息图标大小
  },

  // 动画相关
  ANIMATION: {
    COUNTUP_DURATION: 0.8, // 数字动画持续时间
  },

  // 批处理相关
  BATCH: {
    SIZE: 100, // 每批处理的数量
    DELAY: 16, // 批次间延迟（毫秒）
  },

  // 业务逻辑相关
  BUSINESS: {
    COLUMN_ID_LENGTH: 14, // 生成的列ID长度
    COLUMN_DEFAULT_WIDTH: 200, // 新列默认宽度
    RUN_COLUMN_DELAY: 1000, // 运行列的延迟时间（毫秒）
    COLUMN_INDEX_OFFSET: 1, // 列索引偏移量
  },
} as const
