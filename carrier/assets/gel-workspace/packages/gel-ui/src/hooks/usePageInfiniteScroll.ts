import { useInfiniteScroll as useAhooksInfiniteScroll } from 'ahooks'
import { useState } from 'react'

/**
 * 分页无限滚动 Hook 配置选项接口
 * @template TData 列表项数据类型，即要渲染的数据类型
 * @template TParams 请求参数类型，用于分页参数，默认为包含 pageNo 和 pageSize 的对象
 * @template TApiResponse API 响应类型，默认为 ApiResponse<TData>
 */
interface PageInfiniteScrollOptions<
  TData,
  TApiResponse,
  TParams extends Record<string, any> = { pageNo: number; pageSize: number },
> {
  /**
   * 请求函数，负责获取分页数据
   * @param params 包含分页参数的请求参数对象
   * @returns Promise，解析为包含分页数据的 API 响应
   */
  requestFn: (params: TParams) => Promise<TApiResponse>

  /**
   * 请求参数，每次请求时会与页码参数合并
   * 不需要包含 pageNo 和 pageSize，这些会在内部自动添加
   */
  requestParams?: Omit<TParams, 'pageNo' | 'pageSize'> & Partial<{ pageNo: number; pageSize: number }>

  /**
   * 从请求结果中提取数据列表的函数
   * @param result API 返回的原始结果
   * @returns 提取出的数据列表
   */
  getDataFromResult: (result: TApiResponse) => TData[]

  /**
   * 每页大小，默认为 10
   */
  pageSize?: number

  /**
   * 页码字段名，默认为 'pageNo'
   */
  pageNoKey?: keyof TParams & string

  /**
   * 页大小字段名，默认为 'pageSize'
   */
  pageSizeKey?: keyof TParams & string

  /**
   * 自定义判断是否有更多数据的函数
   * @param result API 返回的原始结果
   * @returns 是否还有更多数据可以加载
   */
  hasMoreFn?: (result: TApiResponse) => boolean

  /**
   * 是否在 hook 初始化时自动加载第一页数据，默认为 true
   */
  initialLoad?: boolean

  /**
   * 初始数据列表，默认为空数组
   */
  initialData?: TData[]

  /**
   * 依赖项数组，当依赖项变化时会重置并重新加载数据
   * 类似于 useEffect 的依赖数组
   */
  deps?: any[]
}

/**
 * 用于实现基于分页的无限滚动数据加载的 Hook，基于 ahooks 的 useInfiniteScroll 实现
 *
 * 本 Hook 主要用于处理服务端分页的无限滚动场景，它自动处理分页参数的构建和发送，
 * 并提供便捷的数据获取和状态管理功能。
 *
 * 特点：
 * 1. 自动处理分页加载和数据合并
 * 2. 支持自定义判断是否有更多数据的逻辑
 * 3. 支持指定页码和页大小字段名
 * 4. 支持初始数据和自动加载选项
 * 5. 支持依赖项改变时重新加载
 *
 * @template TData 列表项数据类型
 * @template TParams 请求参数类型，默认为包含 pageNo 和 pageSize 的对象
 * @template TApiResponse API 响应类型，默认为 ApiResponse<TData>
 * @param options Hook 配置选项
 * @returns 包含列表数据、加载状态、控制方法等的对象
 *
 * @example
 * ```tsx
 * const {
 *   list,
 *   loading,
 *   loadingMore,
 *   hasMore,
 *   loadMore,
 *   reload
 * } = usePageInfiniteScroll<UserData>({
 *   requestFn: (params) => api.getUsers(params),
 *   getDataFromResult: (result) => result.Data || [],
 *   pageSize: 20,
 *   hasMoreFn: (result) => result.Data.length >= 20
 * });
 * ```
 */
export function usePageInfiniteScroll<
  TData,
  TApiResponse,
  TParams extends Record<string, any> = { pageNo: number; pageSize: number },
>(options: PageInfiniteScrollOptions<TData, TApiResponse, TParams>) {
  const {
    requestFn,
    requestParams = {} as Omit<TParams, 'pageNo' | 'pageSize'>,
    getDataFromResult,
    pageSize = 10,
    pageNoKey = 'pageNo' as keyof TParams & string,
    pageSizeKey = 'pageSize' as keyof TParams & string,
    hasMoreFn,
    initialLoad = true,
    initialData = [],
    deps = [],
  } = options

  // 保存当前页码，主要用于响应式更新
  const [page, setPage] = useState(1)

  /**
   * 默认判断是否有更多数据的逻辑
   * @param result API 返回的原始结果
   * @returns 是否还有更多数据可以加载
   */
  const defaultHasMore = (result: TApiResponse) => {
    const data = getDataFromResult(result)
    if (!data || data.length === 0) {
      return false
    }
    // 如果数据长度大于等于页大小，则还有更多数据
    return data.length >= pageSize
  }

  /**
   * 使用 ahooks 的 useInfiniteScroll 创建无限滚动
   */
  const {
    data: rawData,
    loading: initialLoading,
    loadMore,
    loadingMore,
    mutate,
    noMore,
    reload,
  } = useAhooksInfiniteScroll<{
    list: TData[]
    rawResult?: TApiResponse
  }>(
    (d) => {
      // 计算当前页码
      const currentPage = d ? Math.ceil(d.list.length / pageSize) + 1 : 1
      setPage(currentPage)

      // 构建请求参数
      const params = {
        ...requestParams,
        [pageNoKey]: currentPage,
        [pageSizeKey]: pageSize,
      } as unknown as TParams

      // 发起请求
      return requestFn(params).then((result) => {
        // 提取数据
        const newList = getDataFromResult(result)

        // 构造返回格式，符合 ahooks 的 useInfiniteScroll 的约定
        return {
          list: newList,
          // 保存原始结果，用于判断是否有更多数据
          rawResult: result,
        }
      })
    },
    {
      manual: !initialLoad,
      reloadDeps: deps,
      // 初始数据
      ...(initialData.length > 0
        ? {
            defaultParams: [
              {
                list: initialData,
              },
            ],
          }
        : {}),
    }
  )

  // 计算是否有更多数据
  const hasMore =
    !noMore && rawData?.rawResult
      ? hasMoreFn
        ? hasMoreFn(rawData.rawResult)
        : defaultHasMore(rawData.rawResult)
      : false

  // 获取已加载的列表数据
  const list = (rawData?.list || []) as TData[]

  return {
    /** 已加载的数据列表 */
    list,
    /** 是否正在初始加载 */
    loading: initialLoading,
    /** 是否正在加载更多 */
    loadingMore,
    /** 是否还有更多数据 */
    hasMore,
    /** 加载更多数据的方法 */
    loadMore,
    /** 重置并重新加载的方法 */
    reload,
    /** 当前页码 */
    page,
    /** 最近一次请求的原始响应数据 */
    rawData: rawData?.rawResult,
    /** 用于手动修改数据的方法 */
    mutate,
  }
}
