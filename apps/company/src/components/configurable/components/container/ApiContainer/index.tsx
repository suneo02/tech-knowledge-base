import { Button, Empty, Result, Spin } from 'antd'
import { isEmpty, isEqual, pick } from 'lodash'
import React, { memo, useEffect, useMemo, useRef, useState } from 'react'
import { getLocalStorage } from '../../../services/ls'
import { getServerApi } from '../../../services/serverApi'
import { ParamsConfig } from '../../../types'
import { TableOnChangeParams } from '../../wind/Table'

type ApiContainerPropsParams = TableOnChangeParams | any

export interface ApiContainerReturns<T extends any = any, U extends any = any> {
  response?: { Page: { Records: number }; Data: U } // 接口返回参数
  params?: T // 接口传参
  updateParams?: (params: Partial<T>) => void // 设置接口传参
}

export interface ApiContainerProps<T extends any = any, U extends any = any> extends Test {
  children?: ((value: ApiContainerReturns<T, U>) => React.ReactNode) | React.ReactNode
  initialParams?: T
  api?: string // 使用此组件必须传入api
  autoChangeTablePagination?: boolean // 默认打开，是否自动检测内部是否有table并根据table的筛选项刷新table
  title?: string // 模块的标题，用来操作无数据的情况
  /** @deprecated */
  filter?: any
}

/**
 * TODO
 * 需要移除
 */
interface Test {
  apiParams?: ParamsConfig[]
  filterParams?: ParamsConfig[]
}

/**
 * 定义一个名为ApiContainer的泛型组件，用于处理API请求并根据响应渲染子组件
 * @example
 * <ApiContainer api="getTableDataApi" initialParams={{ pageNo: 1, pageSize: 10 }}>
 *
 * </ApiContainer>
 */
export const ApiContainer = memo(
  <T extends Partial<ApiContainerPropsParams>, U>({
    title,
    children,
    initialParams,
    api,
    autoChangeTablePagination,
    apiParams,
  }: ApiContainerProps<T, U>) => {
    const memorizedApiParams = useMemo(() => {
      try {
        const staticFilter = apiParams?.filter((res) => 'value' in res)
        return {
          dynamicKey: apiParams?.map((res) => res.apiKey),
          static: staticFilter?.reduce((acc: any, item) => {
            if ('value' in item) acc[item.apiKey] = Number(item.value) // 转换 value 为数字
            return acc
          }, {}),
        }
      } catch (error) {
        throw 'apiParams must be array'
      }
    }, [apiParams])
    const _all = { ...memorizedApiParams?.static, ...initialParams }
    // 判断初始化参数是否变化的数据
    const prevInitialParamsRef = useRef<T | undefined>(_all)
    // 初始化params状态，用于存储API请求的参数，初始值为initialParams
    const [params, setParams] = useState<T | undefined>(_all)
    // 初始化response状态，用于存储API响应的数据
    const [response, setResponse] = useState<ApiContainerReturns<T, U>['response']>()
    // 初始化loading状态，用于控制加载中的Spin组件显示与隐藏
    const [loading, setLoading] = useState(true)
    // 初始化empty状态，用于判断响应数据是否为空，以显示Empty组件
    const [empty, setEmpty] = useState(false)
    // 初始化error状态，用于判断API请求是否出错，以显示错误组件
    const [error, setError] = useState(false)

    // 处理参数变化的函数，用于更新params状态
    const handleParamsChange = (newParams?: Partial<T>) => {
      if (isEmpty(newParams)) return
      // 这个专门为table的筛选做自动化处理，当然你可以关闭这个自动化
      if (!(autoChangeTablePagination === false)) {
        const _newParams = newParams as TableOnChangeParams
        const _params = params as TableOnChangeParams
        if (_newParams?.pageNo === _params?.pageNo || (_params?.pageNo && !_newParams?.pageNo)) {
          setParams({
            ..._params,
            ..._newParams,
            pageNo: 0,
          } as ApiContainerPropsParams)
          return
        }
        setParams({ ..._params, ..._newParams } as ApiContainerPropsParams)
        return
      }
      setParams({ ...params!, ...newParams! })
    }

    const getDataByApi = async () => {
      setEmpty(false)
      // 防止误操作
      if (api) {
        setLoading(true)
        try {
          const res = await getServerApi(api, {
            ...params!,
            id: getLocalStorage('WindParams')?.companyCode,
          }).finally(() => setLoading(false))
          const list = res?.Data?.list || res?.Data
          if (isEmpty(list)) {
            setEmpty(true)
            return
          }
          setResponse(res)
        } catch (e) {
          console.error(e)
          setEmpty(true)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    // 刷新服务器数据的函数，用于手动刷新数据
    const refreshServer = () => {
      setError(false)
      getDataByApi()
    }

    useEffect(() => {
      getDataByApi()
    }, [params])

    useEffect(() => {
      const _initialParams = pick(_all, ['pageNo', 'pageSize', ...(memorizedApiParams?.dynamicKey || [])]) as any
      if (!isEqual(prevInitialParamsRef.current, _initialParams)) {
        prevInitialParamsRef.current = _initialParams // 更新ref中的值
        setParams(_initialParams)
      }
    }, [{ ..._all }, ...(memorizedApiParams?.dynamicKey || [])])

    const renderChildren = () => {
      if (typeof children === 'function') {
        return children({ response, params, updateParams: handleParamsChange })
      } else {
        return children
      }
    }

    const renderContainer = () => {
      if (!loading && empty) {
        return (
          <div style={{ border: '1px solid #ededed' }}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                title ? (
                  <>
                    <strong>{title} </strong> 暂无数据
                  </>
                ) : (
                  false
                )
              }
            />
          </div>
        )
      }
      if (error) {
        return (
          <Result
            status="500"
            title="500"
            subTitle="Sorry, something went wrong."
            extra={
              <Button type="primary" onClick={() => refreshServer()}>
                点击重新获取数据
              </Button>
            }
          />
        )
      }
      if (response) {
        return renderChildren()
      }
      return null
    }

    return (
      <Spin spinning={loading} tip={title ? `${title} 加载中...` : '加载中...'}>
        <div className="api-container" style={loading ? { minHeight: 100 } : {}}>
          <div>{renderContainer()}</div>
        </div>
      </Spin>
    )
  }
)

export default ApiContainer
