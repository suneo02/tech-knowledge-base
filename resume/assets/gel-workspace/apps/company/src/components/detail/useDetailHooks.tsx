import { useEffect, useState } from 'react'
import axios from '../../api'
import { wftCommon } from '../../utils/utils'

function useDetailHooks(props) {
  const [dataSource, setDataSource] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState<any>(false)
  const [paginationParam, setPaginationParam] = useState({})

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
          if (window.en_access_config && res?.Data?.length) {
            wftCommon.zh2en(res.Data, (data) => {
              setDataSource(data)
            })
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
    getData(paginationParam)
  }, [paginationParam])

  //获取数据

  useEffect(() => {
    getData()
  }, [props.info])

  return {
    dataSource,
    loading,
    pagination,
    onChangePage,
  }
}

export default useDetailHooks
