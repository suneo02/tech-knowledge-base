import { HomeO } from '@wind/icons'
import { Button, Divider } from '@wind/wind-ui'
import { t } from 'gel-util/intl'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.less'
import { TableTab } from './parts/TableTab'
import { formatTaskName } from '@/utils/area'
import { SkeletonTitle } from '@/components/SkeletonTitle'
import { useRightPanelLogic } from './hooks/useRightPanelLogic'

export interface RightPanelProps {
  selectedId?: number
}

const PREFIX = 'company-directory-right'

export const RightPanel: React.FC<RightPanelProps> = (props) => {
  const { selectedId } = props
  const navigator = useNavigate()
  const {
    activeRegion,
    groupTasks,
    columns,
    dataSource,
    totalCount,
    totalCandidateCount,
    setQuery,
    currentSheetId,
    tableInfo,
    loading,
    actions,
    pagingRestricted,
    pagination,
  } = useRightPanelLogic(selectedId)

  return (
    <main className={styles[`${PREFIX}-main`]}>
      <div className={styles[`${PREFIX}-title`]}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button icon={<HomeO />} onClick={() => navigator('/home')} size="small">
            {t('273158', '返回首页')}
          </Button>
          <Divider type="vertical" />

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <SkeletonTitle loading={loading.groupTasks}>
              {tableInfo?.tableName ? (
                <div style={{ fontWeight: 'bold' }}>{formatTaskName(tableInfo.areaCode, tableInfo.tableName)}</div>
              ) : null}
            </SkeletonTitle>

            {groupTasks?.length > 1 ? (
              <>
                <div
                  className={styles[`${PREFIX}-title-link`]}
                  onClick={() => navigator(`/prospect?id=${activeRegion}`)}
                >
                  {t('482224', '查看其他地区挖掘进度')}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <TableTab
        columns={columns}
        columnsLoading={loading.groupTasks || loading.rowsDetail || loading.sheetColumns}
        selectedId={selectedId}
        dataSource={dataSource}
        totalCount={totalCount}
        totalCandidateCount={totalCandidateCount}
        onSearch={(text) => {
          setQuery(text)
          if (currentSheetId) {
            actions.getRowsDetailRun({ sheetId: currentSheetId, pageNo: 1, pageSize: 20, query: text })
          }
        }}
        pagingRestricted={pagingRestricted}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          onChange: actions.onPaginationChange,
        }}
        toolbarLoading={loading.groupTasks}
      />
    </main>
  )
}

export default RightPanel
