/**
 * 企业详情 司法风险 统计数字
 */

export interface CorpBasicNumJudicialRisk {
  judgeinfo_num: number // 裁判文书
  filing_info_num: number // 立案信息
  trialnotice_num: number // 开庭公告
  delivery_anns_num: number // 送达公告
  coutnotice_num: number // 法院公告
  cur_debetor_num: number // 被执行人
  breakpromise_num: number // 失信被执行人
  end_case_num: number // 终本案件
  corp_consumption_num: number // 限制高消费
  judicialsaleinfoCount: number // 司法拍卖
  bankruptcyeventCount: number // 破产重整

  evaluationresultCount: number // 询价评估
}
