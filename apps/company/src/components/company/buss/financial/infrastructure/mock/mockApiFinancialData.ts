/**
 * 模拟原始接口响应数据：用于开发与错误降级回退。
 * @author yxlu.calvin
 * @example
 * const rows = mockApiFinancialData.Data
 */
export const mockApiFinancialData = {
  Data: [
    {
      _reportDate: '2025-06-30',

      _sumOfDebt: 11075305625.02,
      _sumOfHolderRightsAndInterests1: 19701566214.88,
      codeType: 'companyId',
      companyCode: '1057626844',
    },
    {
      _reportDate: '2024-12-31',
      _sumOfAsset: 29760116133.85,

      _sumOfHolderRightsAndInterests1: 19277632386.78,
      _sumOfHolderRightsAndInterests2: 19283856918.55,
      codeType: 'companyId',
      companyCode: '1057626844',
    },
    {
      _reportDate: '2023-12-31',
      _sumOfAsset: 25363554179.64,
      _sumOfDebt: 8793560954.52,

      _sumOfHolderRightsAndInterests2: 16569993225.12,
      codeType: 'companyId',
      companyCode: '1057626844',
    },
    {
      _reportDate: '2022-12-31',
      _sumOfAsset: 24301603274.71,
      _sumOfDebt: 9661926268.23,
      _sumOfHolderRightsAndInterests1: 14617447971.46,

      codeType: 'companyId',
      companyCode: '1057626844',
    },
  ],
  ErrorCode: '0',
  ErrorMessage: '',
  Page: { CurrentPage: 0, PageSize: 0, Records: 0, TotalPage: 0 },
  State: 0,
} as const
