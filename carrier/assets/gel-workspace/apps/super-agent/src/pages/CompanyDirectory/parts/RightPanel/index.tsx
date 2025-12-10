import { DownloadO, HistoryO, HomeO, TimeO } from '@wind/icons'
import { Button, Divider, Select, Spin } from '@wind/wind-ui'
import { useRequest } from 'ahooks'
import { t } from 'gel-util/locales'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.less'
// tabs
import { requestToWFC } from '@/api'
import { getAreaNameByCode } from '@/utils/area'
import type { GetRowsDetailRequest } from 'gel-api'
import type { BasicColumn, BasicRecord } from '../DataTable/types'
import { TableTab } from './parts/TableTab'

export interface RightPanelProps {
  selectedId?: number
}

const PREFIX = 'company-directory-right'

const splAgentTaskDetail = (taskId: number) => requestToWFC('operation/get/splAgentTaskDetail', { taskId })
const getRowsDetail = (props: GetRowsDetailRequest) => requestToWFC('superlist/excel/getRowsDetail', props)

const getSheetColumns = (sheetId: number) => requestToWFC('superlist/excel/getSheetColumns', { sheetId })

export const RightPanel: React.FC<RightPanelProps> = (props) => {
  const [activeRegion, setActiveRegion] = useState<number>()
  const [groupTasks, setGroupTasks] = useState<{ label: string; value: number }[]>([])
  const [columns, setColumns] = useState<BasicColumn[]>([])
  const [dataSource, setDataSource] = useState<BasicRecord[]>([])

  const { selectedId } = props
  const navigator = useNavigate()

  const { loading: groupTasksLoading } = useRequest(async () => splAgentTaskDetail(Number(selectedId)), {
    onSuccess: (res) => {
      const groupTasks =
        res?.Data?.groupTasks?.map((item) => ({
          label: `${item.taskName}-${getAreaNameByCode(item.areaCode)}`,
          value: Number(item.taskId),
        })) || []
      const sheetId = res?.Data?.currentTask?.sheetId
      getSheetColumnsRun(sheetId)
      getRowsDetailRun(sheetId)
      setGroupTasks(groupTasks || [])
      setActiveRegion(Number(selectedId))
    },
    refreshDeps: [selectedId],
  })

  const { loading: sheetColumnsLoading, run: getSheetColumnsRun } = useRequest(
    async (sheetId) => getSheetColumns(sheetId),
    {
      onSuccess: (res) => {
        if (!res?.Data?.columns?.length) {
          setColumns([])
          return
        }
        const _columns: BasicColumn[] = res?.Data?.columns.map((item, index) => {
          if (item.columnName === '分数') {
            return {
              ...item,
              title: item.columnName || '',
              dataIndex: item.columnId || '',
              type: 'drawer',
            }
          }
          return {
            ...item,
            title: item.columnName || '',
            dataIndex: item.columnId || '',
            type: index === 0 ? 'company' : item.columnDataType || '',
          }
        }) as BasicColumn[]
        setColumns(_columns)
      },
      manual: true,
    }
  )

  const { loading: rowsDetailLoading, run: getRowsDetailRun } = useRequest(
    async (sheetId) => getRowsDetail({ sheetId, pageNo: 1, pageSize: 100 }),
    {
      onSuccess: (res) => {
        setDataSource(res?.Data?.data || [])
      },
      manual: true,
    }
  )

  return (
    <main className={styles[`${PREFIX}-main`]}>
      <div className={styles[`${PREFIX}-title`]}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button icon={<HomeO />} onClick={() => navigator('/home')} size="small" type="text">
            {t('home', '首页')}
          </Button>
          <Divider type="vertical" />
          {/* @ts-expect-error will be fixed in next release */}
          <Spin spinning={groupTasksLoading}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div>
                <Select
                  size="small"
                  style={{ width: 200 }}
                  options={groupTasks}
                  value={activeRegion}
                  onChange={(value: number) => setActiveRegion(value)}
                />
              </div>

              <div className={styles[`${PREFIX}-title-remark`]}>{t('remark', '（可下拉切换企业名单）')}</div>
              <div className={styles[`${PREFIX}-title-link`]}>查看其他地区挖掘进度</div>
            </div>
          </Spin>
          {/* <Divider type="vertical" /> */}
        </div>

        <div className={styles[`${PREFIX}-title-actions`]}>
          <Button size="small" icon={<TimeO />} type="text">
            {t('subscribe', '订阅')}
          </Button>
          <Divider type="vertical" />
          <Button size="small" icon={<HistoryO />} type="text">
            {t('history', '历史')}
          </Button>
          <Divider type="vertical" />
          <Button size="small" icon={<DownloadO />} type="text">
            {t('export', '导出')}
          </Button>
        </div>
      </div>

      <TableTab
        columns={columns}
        columnsLoading={rowsDetailLoading || sheetColumnsLoading}
        selectedId={selectedId}
        dataSource={dataSource}
      />
    </main>
  )
}

export default RightPanel
