import { useRequest, useSetState } from 'ahooks'
import { useEffect, useState } from 'react'
import { requestToWFC } from '@/api'
import { formatTaskName } from '@/utils/area'
import { TaskStatus, type GetRowsDetailRequest, ColumnDataTypeEnum } from 'gel-api'
import type { BasicColumn, BasicRecord } from '../../DataTable/types'
import { InfoCircleO } from '@wind/icons'
import { Tag, Tooltip } from '@wind/wind-ui'
import { t } from 'gel-util/intl'

const splAgentTaskDetail = (taskId: number) => requestToWFC('superlist/excel/splAgentTaskDetail', { taskId })
const getRowsDetail = (props: GetRowsDetailRequest) => requestToWFC('superlist/excel/getRowsDetail', props)
const getSheetColumns = (sheetId: number) => requestToWFC('superlist/excel/getSheetColumns', { sheetId })

export const useRightPanelLogic = (selectedId?: number) => {
  const [activeRegion, setActiveRegion] = useState<number | null>()
  const [groupTasks, setGroupTasks] = useState<{ label: string; value: number; disabled?: boolean }[]>([])
  const [columns, setColumns] = useState<BasicColumn[]>([])
  const [dataSource, setDataSource] = useState<BasicRecord[]>([])
  const [totalCount, setTotalCount] = useState<number | undefined>(undefined)
  const [totalCandidateCount, setTotalCandidateCount] = useState<number | undefined>(undefined)
  const [query, setQuery] = useState('')
  const [currentSheetId, setCurrentSheetId] = useState<number | null>(null)
  const [pagingRestricted, setPagingRestricted] = useState(false)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 })
  const [tableInfo, setTableInfo] = useSetState<{
    tableName?: string
    areaCode?: string
  }>({})

  const COLUMN_CONFIG: Partial<BasicColumn>[] = [
    { title: t('138677', '企业名称'), matchTitle: '企业名称', width: 240, type: 'company', fixed: true },
    {
      title: (
        <>
          {t('482223', '推荐等级')}
          <Tooltip
            overlayClassName="recommend-tooltip"
            title={
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div>
                  {/* @ts-expect-error windUI */}
                  <Tag color="color-5" type="primary">
                    {t('482219', '超级推荐')}
                  </Tag>
                  {t('482238', '多维度特征高度吻合，值得重点投入评估')}
                </div>
                <div>
                  {/* @ts-expect-error windUI */}
                  <Tag color="color-3" type="primary">
                    {t('482237', ' 强烈推荐')}
                  </Tag>
                  {t('482220', '关键维度契合度高，建议优先对接')}
                </div>
                <div>
                  {/* @ts-expect-error windUI */}
                  <Tag color="color-1" type="primary">
                    {t('271634', '推荐')}
                  </Tag>
                  {t('482221', '多项指标匹配，按常规节奏跟进')}
                </div>
                <div>
                  {/* @ts-expect-error windUI */}
                  <Tag type="primary">{t('482222', '一般推荐')}</Tag>
                  {t('482239', '符合基础准入条件，可纳入储备名单')}
                </div>
              </div>
            }
          >
            <InfoCircleO style={{ marginLeft: 8, cursor: 'pointer', color: 'var(--basic-8)' }} />
          </Tooltip>
        </>
      ),
      matchTitle: '推荐等级',
      width: 120,
      type: ColumnDataTypeEnum.TAG,
      align: 'center',
    },
    {
      title: t('246676', '国标行业'),
      matchTitle: '国标行业',
      width: 220,
      ellipsis: true,
    },
    { title: t('265705', '注册资本（万）'), matchTitle: '注册资本（万）', width: 140 },
    { title: t('438034', '公司电话'), matchTitle: '公司电话', width: 140, type: 'phone' },
    { title: t('1588', '办公地址'), matchTitle: '办公地址', width: 240, ellipsis: true },
    { title: t('32912', '公司简介'), matchTitle: '公司简介', width: 300, ellipsis: true },
  ]

  /**
   * 获取sheet的列信息
   */
  const { loading: sheetColumnsLoading, run: getSheetColumnsRun } = useRequest(
    async (sheetId) => getSheetColumns(sheetId),
    {
      onSuccess: (res) => {
        if (!res?.Data?.columns?.length) {
          setColumns([])
          return
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const _columns: BasicColumn[] = res?.Data?.columns.map((item: any, index: number) => {
          // Warning: The backend will return the column ID in the future, and we need to change it to match by ID.
          const config = COLUMN_CONFIG.find((c) => (c.matchTitle || c.title) === (item.columnName || ''))
          return {
            ...item,
            ...config,
            title: config?.title || item.columnName || '',
            dataIndex: item.columnId || '',
            type: index === 0 ? 'company' : config?.type || item.columnDataType || '',
            width: config?.width || item.width || 150,
          }
        }) as BasicColumn[]
        setColumns(_columns)
      },
      manual: true,
      refreshDeps: [activeRegion],
    }
  )

  /**
   * 获取名单行数据
   */
  const { loading: rowsDetailLoading, run: getRowsDetailRun } = useRequest(
    async (params: { sheetId: number; pageNo?: number; pageSize?: number; query?: string }) =>
      getRowsDetail({
        sheetId: params.sheetId,
        pageNo: params.pageNo ?? 1,
        pageSize: params.pageSize ?? 20,
        // query: params.query ?? '',
      }),
    {
      onSuccess: (res, params) => {
        const [reqArgs] = params
        if (reqArgs.pageNo) {
          setPagination((prev) => ({ ...prev, current: reqArgs.pageNo!, pageSize: reqArgs.pageSize || prev.pageSize }))
        }
        setDataSource(res?.Data?.data || [])
        // console.log('🚀 ~ useRightPanelLogic ~ Page.Records:', res?.Page?.Records)
        // setTotalCount(res?.Page?.Records || 0)
      },
      manual: true,
      refreshDeps: [activeRegion],
    }
  )

  const onPaginationChange = (page: number, pageSize: number) => {
    if (!currentSheetId) return
    getRowsDetailRun({
      sheetId: currentSheetId,
      pageNo: page,
      pageSize,
      query,
    })
  }

  /**
   * 获取客户名单的筛选项
   */
  const { loading: groupTasksLoading, run: getGroupTasksRun } = useRequest(splAgentTaskDetail, {
    onSuccess: (res) => {
      const tasks =
        res?.Data?.groupTasks?.map((item) => ({
          label: formatTaskName(item.areaCode, item.taskName),
          value: Number(item.taskId),
          disabled: item.status !== TaskStatus.SUCCESS,
        })) || []
      const sheetId = res?.Data?.currentTask?.sheetId
      const _pagingRestricted = !!res?.Data?.currentTask?.pagingRestricted
      const _totalCandidateCount = res?.Data?.currentTask?.totalCandidateCount
      const _customerCount = res?.Data?.currentTask?.customerCount
      setCurrentSheetId(sheetId || null)
      setPagingRestricted(_pagingRestricted)
      setTotalCandidateCount(_totalCandidateCount || 0)
      setTotalCount(_customerCount || 0)

      if (sheetId) {
        getSheetColumnsRun(sheetId)
        getRowsDetailRun({ sheetId, pageNo: pagination.current, pageSize: pagination.pageSize, query })
      }

      setGroupTasks(tasks)
      setTableInfo({ tableName: res?.Data?.currentTask?.taskName, areaCode: res?.Data?.currentTask?.areaCode })
      // 初始化的时候，如果先赋值筛选框会出现数字的情况，所以必须等待select的option远程加载完毕之后才能附上对应的value
      if (!activeRegion) setActiveRegion(Number(selectedId || 0))
    },
    manual: true,
    loadingDelay: 300,
  })

  // 初始化的时候，如果先赋值筛选框会出现数字的情况，所以必须等待select的option远程加载完毕之后才能附上对应的value
  useEffect(() => {
    if (selectedId) getGroupTasksRun(selectedId)
  }, [selectedId])

  return {
    activeRegion,
    groupTasks,
    columns,
    dataSource,
    totalCount,
    query,
    setQuery,
    currentSheetId,
    tableInfo,
    loading: {
      groupTasks: groupTasksLoading,
      sheetColumns: sheetColumnsLoading,
      rowsDetail: rowsDetailLoading,
    },
    actions: {
      getRowsDetailRun,
      getSheetColumnsRun,
      getGroupTasksRun,
      onPaginationChange,
    },
    pagingRestricted,
    pagination,
    totalCandidateCount,
  }
}
