/**
 * 这个不能改 value json 中有没调用该module
 * ！！！
 */
export enum LinkModule {
  GQCT_CHART = 'KG_GQCT', // 股权穿透图 非图谱平台，只是用于iframe 嵌套
  BENEFICIAL_CHART = 'KG_BENEFICIAL', // 受益人图谱 非图谱平台，只是用于iframe 嵌套
  CORRELATION_CHART = 'KG_CORRELATION', // 关联方图谱 非图谱平台，只是用于iframe 嵌套
  ACTUAL_CONTROLLER_CHART = 'KG_ACTUAL_CONTROLLER', // 实际控制人图谱 非图谱平台，只是用于iframe 嵌套

  COMPANY_DETAIL = 'COMPANY_DETAIL', // 企业详情
  WINDCODE_2_F9 = 'WINDCODE_2_F9', // windcode 跳转 f9

  KG_PLATFORM = 'KG_PLATFORM', // 图谱平台
  USER_CENTER = 'USER_CENTER', // 用户中心
  DDRP_PREVIEW = 'DDRP_PREVIEW', // 尽职调查报告预览
  DDRP_PRINT = 'DDRP_PRINT', // 尽职调查报告打印
  CREDIT_RP_PREVIEW = 'CREDIT_RP_PREVIEW', // 企业深度信用调查报告预览
  CREDIT_RP_PRINT = 'CREDIT_RP_PRINT', // 企业深度信用调查报告打印
}
