// 基本公司信息类型
interface BaseInfo {
  address: string
  bus_status: string // 企业状态，例如：开业
  company_name: string // 公司名称
  corpId: string // 企业法人代码
  credit_code: string // 信用代码
  email_address: string // 邮箱地址
  employee_number: number // 员工总数
  has_share_transfer: string // 是否有股份转让
  has_website: string // 是否有官网
  holding_situation: string // 控股情况
  is_guaranted: string // 是否提供担保
  is_invested: string // 是否已投资
  main_business: string // 主要业务
  post_code: string // 邮政编码
  tel: string // 电话号码
  women_employee_number: number // 女性员工人数
}

// 社会保险信息类型
interface SocialSecurity {
  corp_id: string // 企业法人代码
  employment_injury_amount_owed: string // 工伤保险欠缴金额
  employment_injury_num: number // 工伤保险人数
  employment_injury_real_cost_base: string // 工伤保险实际缴费基数
  endowment_amount_owed: string // 养老保险欠缴金额
  endowment_cost_base: string // 养老保险缴费基数
  endowment_num: number // 养老保险人数
  endowment_real_cost_base: string // 养老保险实际缴费基数
  ifFlag_Amount_Owed: string // 是否欠缴金额
  ifFlag_cost_base: string // 是否有缴费基数
  ifFlag_realCost_base: string // 是否有实际缴费基数
  maternity_amount_owed: string // 生育保险欠缴金额
  maternity_cost_base: string // 生育保险缴费基数
  maternity_num: number // 生育保险人数
  maternity_real_cost_base: string // 生育保险实际缴费基数
  medical_amount_owed: string // 医疗保险欠缴金额
  medical_cost_base: string // 医疗保险缴费基数
  medical_num: number // 医疗保险人数
  medical_real_cost_base: string // 医疗保险实际缴费基数
  unemployment_amount_owed: string // 失业保险欠缴金额
  unemployment_cost_base: string // 失业保险缴费基数
  unemployment_num: number // 失业保险人数
  unemployment_real_cost_base: string // 失业保险实际缴费基数
  year: string // 年份
}

// 资产信息类型
interface Asset {
  corp_id: string // 企业法人代码
  gross_revenue: string // 总收入
  main_business_income: string // 主要业务收入
  net_profit: string // 净利润
  total_asset: string // 总资产
  total_indebtedness: string // 总负债
  total_owner_equity: string // 总所有者权益
  total_profit: string // 总利润
  total_tax_payment: string // 总税费缴纳
}

// 年度股东数类型
interface AnnualNum {
  shareholder_num: number // 股东人数
  website_num?: number // 网站数
  stockchange_num?: number // 股权变更数
  guarantee_num?: number
}

export interface ICorpAnnualReport {
  baseinfo: BaseInfo[]
  socialsecurity: SocialSecurity[]
  asset: Asset[]
  annual_num: AnnualNum
}
