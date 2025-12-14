/**
 * Chat 模块枚举定义
 * 
 * @description 将枚举独立出来，避免循环依赖
 */

// dpu数据显示图表类型
export enum ChatTypeEnum {
  BAR = 1, // 柱状图
  LINE = 2, // 折线图
  PIE = 3, // 饼图
  // SPEED = 4, // 行情图
  DOT = 5, // 散点图
}
