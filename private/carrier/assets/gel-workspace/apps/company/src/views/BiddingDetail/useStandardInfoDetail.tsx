import { translateComplexHtmlData } from '@/utils/intl'
import { useEffect, useState } from 'react'
import axios from '../../api'
import { useTranslateService } from '../../hook'
import { parseQueryString } from '../../lib/utils'
import { wftCommon } from '../../utils/utils'
import './index.less'

const useBiddingDetail = () => {
  let param = parseQueryString()
  let detailid = param['detailid']
  let jumpAttach = param['jumpAttach'] || 0
  const [data1, setData1] = useState<any>({
    data: {},
    loading: false,
  })
  const [data2] = useState({
    data: {
      url: '/gel/detail/company/getstandardinfodetail_draftingunit',
      method: 'post',
      data: {
        __primaryKey: detailid,
        type: 'biddingsubV2',
      },
      cmd: 'detail/bid/bidDetailParticipant',
    },
  })

  //招标项目进度信息
  const [navData, setNavData] = useState([])
  const [navDataIntl] = useTranslateService(navData, true, true)

  const [detail, setDetail] = useState<any>({
    data: '',
    attachment: undefined,
    loading: true,
    translating: false,
  })

  const getStandardInfoDetail = () => {
    setData1((state) => ({ ...state, loading: true }))
    axios
      .request({
        url: '/gel/detail/company/getstandardinfodetail',
        method: 'post',
        data: {
          __primaryKey: detailid,
          type: 'biddingdetailnewV2',
        },
        cmd: 'detail/bid/bidDetailBasicInfo',
      })
      .finally(() => setData1((state) => ({ ...state, loading: false })))
      .then((res) => {
        console.log(res.Data)
        if (res.Data) {
          setData1((state) => ({ ...state, data: res.Data }))
          if (window.en_access_config) {
            wftCommon.translateService(res.Data, (content) => {
              setData1((state) => ({ ...state, data: content }))
            })
          }
        }
      })
      .catch(() => {
        setData1({
          data: data1,
          loading: false,
        })
      })
  }

  const getNavList = () => {
    axios
      .request({
        url: '/gel/detail/company/getstandardinfodetail',
        method: 'post',
        data: {
          __primaryKey: detailid,
          type: 'biddingprojectcontentV2',
        },
        cmd: 'detail/bid/bidDetailProjectInfo',
      })
      .then((res) => {
        let { Data } = res
        setNavData(Data)
      })
  }

  const getDetail = async () => {
    setDetail((state) => ({ ...state, loading: true }))
    axios
      .request({
        url: '/gel/detail/company/getstandardinfodetail',
        method: 'post',
        data: {
          __primaryKey: detailid,
        },
        cmd: 'detail/bid/bidDetailContent',
      })
      .finally(() => setDetail((state) => ({ ...state, loading: false })))
      // @ts-expect-error ttt
      .then((res) => {
        let { Data } = res
        if (!Data) return
        let { content, attachment, copyrightDeclare, contentDetail } = Data
        const wsid = wftCommon.getwsd()
        const is_terminal = wftCommon.usedInClient()
        // 有版权不显示内容
        if (copyrightDeclare) {
          return {
            copyrightDeclare,
          }
        }
        // 有内容详情直接使用
        if (contentDetail) {
          return {
            data: contentDetail,
            attachment,
          }
        }
        if (content) {
          if (!is_terminal && wsid) {
            content = content + '?wind.sessionid=' + wsid
          }
        }
        return axios
          .request({
            url: content,
            method: 'get',
          })
          .then((e) => ({
            data: e,
            attachment,
          }))
          .catch(() => ({
            data: null,
            attachment,
          }))
      })
      .then(async (res) => {
        if (!res) return
        setDetail((state) => ({
          ...state,
          data: res?.data,
          // @ts-expect-error ttt
          attachment: res?.attachment,
          // @ts-expect-error ttt
          copyrightDeclare: res.copyrightDeclare,
        }))
        if (window.en_access_config) {
          setDetail((state) => ({ ...state, translating: true }))
          const translatedHtml = await translateComplexHtmlData(res?.data).finally(
            // @ts-expect-error ttt
            setDetail((state) => ({
              ...state,
              translating: false,
            }))
          )
          if (translatedHtml) setDetail((state) => ({ ...state, data: translatedHtml }))
        }
      })
      .catch(async () => {
        setDetail((state) => ({
          ...state,
          data: '',
        }))
      })
  }

  useEffect(() => {
    getStandardInfoDetail()
    getDetail()
    getNavList()
  }, [])

  return {
    data1,
    data2,
    detail,
    navData: navDataIntl,
    jumpAttach,
  }
}

export default useBiddingDetail
