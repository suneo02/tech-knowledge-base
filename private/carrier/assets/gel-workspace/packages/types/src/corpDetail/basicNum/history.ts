export interface CorpBasicNumHistory {
  changeHistoryCount: number // 变更历史
  his_shareholder_num: number // 股东信息
  his_manager_num: number // 法人和高管
  his_invest_num: number // 对外投资
  his_permission_num?: number // 行政许可
  his_domain_num: number // 网站备案

  hisPatentNum: number // 历史专利
  landmortgage_num: number // 土地抵押
  company_certificate_num: number // 多证合一
  license_abolish_num: number // 作废声明
  historicalcontrollerCount: number // 历史实际控制人
  historicalbeneficiaryCount: number // 历史最终受益人
  his_business_info_num: number // 工商信息

  companyCreditNum: number // 征信备案-企业征信
  personCreditNum: number // 征信备案-个人征信
  financialRecordNum: number // 金融信息服务备案

  hisEquitypledgedCountbypledgor: number // 历史股权出质-出质人
  hisEquitypledgedCountbypledgee: number // 历史股权出质-质权人
  hisEquitypledgedCountbycomid: number // 历史股权出质-出质标的
}
