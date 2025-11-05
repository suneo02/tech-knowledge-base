export interface ConfigDetailTitleJSON {
  title: string
  titleIntl?: string | number // 国际化ID
  hiddenTitle?: boolean
}

export type ConfigDetailApiJSON = {
  api?: string
  /**
   * 接口类型，默认是 gel/detail/company
   * operation 即为 operation/get/...
   */

  apiType?: 'operation'
  extraPayload?: Record<string, string>
  extraParams?: Record<string, string> & {
    // 公司 code 会做特殊处理
    companyCode: string
  }
  apiOptions?: {
    method?: 'GET' | 'POST'
  }
}

export type TConfigDetailLayout = 'horizontal' | 'vertical' | 'tabs' | undefined | string
