import { useEffect, useState } from 'react'
import { getAnnualDetail } from '../../api/singleDetail.ts'
import queryString from 'qs'
import { ApiResponse } from '@/api/types.ts'
import { ICorpAnnualReport } from '@/api/corp/annualReport.ts'

export type IAnnualReportDetail = Partial<{
  baseinfo: ICorpAnnualReport['baseinfo'][0]
  socialsecurity: ICorpAnnualReport['socialsecurity'][0]
  asset: ICorpAnnualReport['asset'][0]
  annual_num: ICorpAnnualReport['annual_num']
  website?: any
  shareholder?: any
  changesOfShareholder?: any
  guarantee?: any
}>
/**
 * 获取年报详情数据
 * @returns data: 年报详情数据
 * @returns loading: 加载状态
 */
const useAnnualReportDetail = () => {
  const [data, setData] = useState<IAnnualReportDetail>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const location = window.location
    const param = queryString.parse(location.search, { ignoreQueryPrefix: true })
    const companyCode = param['companyCode']
    const year = param['year']
    setLoading(true)
    getAnnualDetail({
      __primaryKey: companyCode,
      year: year,
    })
      .then((res: ApiResponse<ICorpAnnualReport>) => {
        const { Data: value, ErrorCode } = res
        if (ErrorCode !== '0') return
        let newData: IAnnualReportDetail = {}
        //基本信息
        newData = {
          ...newData,
          baseinfo: value.baseinfo?.[0],
          socialsecurity: value.socialsecurity?.[0],
          asset: value.asset?.[0],
          annual_num: value.annual_num,
        }
        //网站或网店信息
        if (value.annual_num.website_num) {
          newData = {
            ...newData,
            website: {
              url: '/gel/detail/company/getannualdetail_websites',
              method: 'post',
              data: {
                __primaryKey: companyCode,
                year: year,
              },
              cmd: 'detail/company/getannualdetail_websites',
            },
          }
        }
        //股东及出资信息
        if (value.annual_num.shareholder_num) {
          newData = {
            ...newData,
            shareholder: {
              url: '/gel/detail/company/getannualdetail_shareholders',
              method: 'post',
              data: {
                __primaryKey: companyCode,
                year: year,
              },
              cmd: 'detail/company/getannualdetail_shareholders',
            },
          }
        }
        //股权变更信息
        if (value.annual_num.stockchange_num) {
          newData = {
            ...newData,
            changesOfShareholder: {
              url: '/gel/detail/company/getannualdetail_stockchange',
              method: 'post',
              data: {
                __primaryKey: companyCode,
                year: year,
              },
              cmd: 'detail/company/getannualdetail_stockchange',
            },
          }
        }
        //对外提供保证担保信息
        if (value.annual_num.guarantee_num) {
          newData = {
            ...newData,
            guarantee: {
              url: '/gel/detail/company/getannualdetail_guarantees',
              method: 'post',
              data: {
                __primaryKey: companyCode,
                year: year,
              },
              cmd: 'detail/company/getannualdetail_guarantees',
            },
          }
        }
        setData(newData)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return {
    data,
    loading,
  }
}

export default useAnnualReportDetail
