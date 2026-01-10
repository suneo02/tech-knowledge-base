import { translateToEnglish } from '@/utils/intl'
import { isEn } from 'gel-util/intl'
import { useEffect, useRef, useState } from 'react'
import axios from '../../api'
import { wftCommon } from '../../utils/utils'

type DetailHooksProps = {
  info: any
  horizontal?: boolean
  columns?: any[]
  hideTableConstruct?: boolean
  skipTransFieldsInKeyMode?: string[]
}

function useDetailHooks(props: DetailHooksProps) {
  const [dataSource, setDataSource] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState<any>(false)
  const [paginationParam, setPaginationParam] = useState({})
  const prevInfo = useRef(props.info)

  const getData = (params = {}) => {
    const { info } = props
    if (!info) return
    if (!('url' in info || 'cmd' in info)) {
      setDataSource(info)
      setPagination(false)
    } else {
      setLoading(true)
      let { data: payload } = info
      if (typeof payload === 'object') {
        payload = {
          ...payload,
          ...params,
        }
      } else {
        payload = {
          ...payload,
          ...params,
        }
      }
      axios
        .request({
          ...info,
          data: payload,
        })
        .then((res) => {
          setDataSource(res.Data || [])
          const total = res.Page.Records
          if (total > 10) {
            setPagination({
              ...res.Page,
              total: res.Page.Records,
            })
          } else {
            setPagination(false)
          }
          if (isEn() && res?.Data?.length) {
            if (props.skipTransFieldsInKeyMode) {
              translateToEnglish(res.Data, {
                skipFields: props.skipTransFieldsInKeyMode,
              }).then((res) => {
                if (res.success) {
                  setDataSource(res.data)
                }
              })
            } else {
              wftCommon.zh2en(res.Data, (data) => {
                setDataSource(data)
              })
            }
          }
        })
        .catch((err) => {
          console.error(err, props)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  //改变表格页码
  const onChangePage = (e) => {
    console.log('onChangePage', e, pagination, paginationParam)
    if (e.currentPage === pagination.currentPage && e.pageSize === pagination.pageSize) return
    setPagination({
      ...pagination.pageSize,
      currentPage: e.currentPage,
      pageSize: e.pageSize,
    })
    setPaginationParam({
      pageNo: e.currentPage - 1 || 0,
      pageSize: e.pageSize,
    })
  }

  useEffect(() => {
    if (prevInfo.current !== props.info) {
      prevInfo.current = props.info
      // info 改变，重置分页并获取数据
      setPaginationParam({})
      getData({})
    } else {
      getData(paginationParam)
    }
  }, [props.info, paginationParam])

  return {
    dataSource,
    loading,
    pagination,
    onChangePage,
  }
}

export default useDetailHooks
