export interface CorpBasicNumFinance {
  structuralEntityCount: number // 结构性主体

  sharedstock_num_new: number // 发行股票
  listedSubjectSharesCount: number // 发行股票-上市主体股票

  declarcompany_num: number // 待上市信息
  sharedbonds_num: number // 发行债券
  cbrcreditratingreport_num: number // 发债主体评级
  companyabs_num: number // ABS信息
  mainbusinessstruct_num: number // 主营构成

  ranked_num: number // 上榜信息
  governmentgrants_num: number // 政府补贴

  insuranceNum: number // 保险产品
  invest_orgs_num: number // 投资机构
  invest_events_num: number // 投资事件
  pevc_num_new: number // PEVC融资
  pevcquit_num: number // PEVC退出
  chattle_financing_num: number // 动产融资

  chattelMortgagor: number // 动产抵押-抵押人
  chattelMortgagee: number // 动产抵押-抵押权人

  merge_num: number // 并购信息
  banktrust_num: number // 银行授信
}
