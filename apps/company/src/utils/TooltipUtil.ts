const TooltipMapCompanyDetail = {
  // 股东信息 工商登记
  CompanyDetailShareholderInfoBusinessRegistration: {
    intlId: 387953,
    default: '工商登记股东数据来源为国家企业信用信息公示系统',
  },
  // 控股企业
  CompanyDetailHoldingCompanies: {
    intlId: 387954,
    default: '控股企业指企业直接或间接拥有其控制权的企业，仅供参考',
  },
  // 对外投资
  CompanyDetailOutboundInvest: {
    intlId: 387973,
    default: '对外投资指企业直接持股企业',
  },
  // 工商变更
  CompanyDetailIndustryAndCommercialChange: {
    intlId: 387955,
    default: '基于国家企业信用信息公示系统工商变更数据分析，仅供参考',
  },
  // 竞争对手
  CompanyDetailCompetitor: {
    intlId: 387974,
    default: '基于企业公开的基本信息、经营信息、知识产权等数据综合分析生成，结果仅供参考',
  },
}

export const TooltipMap = {
  ...TooltipMapCompanyDetail,
}
