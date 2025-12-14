import { IndicatorBulkImportApi } from '@/BulkImport/type'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Popover } from '@wind/wind-ui'
import Table, { TableProps } from '@wind/wind-ui-table'
import { IndicatorCorpMatchItem } from 'gel-api'
import { ErrorBoundary } from 'gel-ui'
import { t } from 'gel-util/intl'
import { useCallback, useMemo, useState } from 'react'
import { CompanyCountStats } from '../CorpMatchConfirm/handle'
import { EditableCorpCell } from '../EditableCorpCell'
import styles from './index.module.less'

interface CompanyMatchTableProps extends Pick<IndicatorBulkImportApi, 'searchCompanies'> {
  dataSource?: IndicatorCorpMatchItem[]
  loading: boolean
  setCountStats: (updater: (prev: CompanyCountStats) => CompanyCountStats) => void
  editItem: (oldData: IndicatorCorpMatchItem, newData: IndicatorCorpMatchItem, index: number | undefined) => void
  deleteItem: (record: IndicatorCorpMatchItem) => void
}

// Extended type for the column configuration hook
interface ColumnConfigExtras {
  editingKey: number | null
  setEditingKey: (key: number | null) => void
}

/**
 * 创建表格列配置
 */
const useIndicatorMatchTableColumns = ({
  setCountStats,
  editItem,
  deleteItem,
  editingKey,
  setEditingKey,
  searchCompanies,
}: Pick<CompanyMatchTableProps, 'setCountStats' | 'editItem' | 'deleteItem'> &
  ColumnConfigExtras &
  Pick<IndicatorBulkImportApi, 'searchCompanies'>): TableProps<IndicatorCorpMatchItem>['columns'] => {
  const BUSSINESS_TYPE = {
    2: t('140081', '香港企业'),
    3: t('140082', '台湾企业'),
  } as const

  // Use useCallback to memoize the handlers for each cell
  const handleDelete = useCallback(
    (record: IndicatorCorpMatchItem) => {
      deleteItem(record)
    },
    [deleteItem]
  )

  const handleChange = useCallback(
    (record: IndicatorCorpMatchItem, newData: IndicatorCorpMatchItem, index: number | undefined) => {
      if (!newData.matched) {
        return
      }
      if (!record.matched && newData.matched) {
        // 更新错误计数
        setCountStats((prev) => ({
          ...prev,
          errNum: prev.errNum - 1,
        }))
      }
      editItem(record, newData, index)
      setEditingKey(null) // Exit editing mode after save
    },
    [editItem, setCountStats, setEditingKey]
  )

  // Create memoized render function for EditableCorpCell
  const renderEditableCell = useCallback(
    (_: any, record: IndicatorCorpMatchItem, index: number | undefined) => {
      // 判断是否处于编辑状态
      const isEditing = editingKey === index
      // 判断是否处于编辑模式
      const isEditingActive = editingKey !== null

      return (
        <EditableCorpCell
          edittingClassName={styles['editable-cell-editor']}
          onDel={() => handleDelete(record)}
          value={record}
          isEditing={isEditing}
          editable={!isEditingActive || isEditing}
          onEditingChange={(editing: boolean) => {
            setEditingKey(editing ? (index ?? null) : null)
          }}
          onChange={(newData) => handleChange(record, newData, index)}
          searchCompanies={searchCompanies}
        />
      )
    },
    [handleDelete, handleChange, editingKey, setEditingKey]
  )

  return useMemo(() => {
    return [
      {
        title: t('441914', '序号'),
        align: 'center' as const,
        render: (_, __, index) => <span>{(index || 0) + 1}</span>,
        width: 60,
      },
      {
        className: styles['corp-name-column'],
        title: (
          <span>
            {t('', '导入信息')}{' '}
            <Popover content={t('', '点击导入信息后的"编辑"可重新匹配企业。')}>
              <ExclamationCircleOutlined />
            </Popover>
          </span>
        ),
        render: renderEditableCell,
        width: '30%',
      },
      {
        title: t('138677', '企业名称'),
        ellipsis: true,
        render: (_: any, record) => (
          <div
            style={{
              color: `${record.matched == 0 ? 'red' : '#333'}`,
              height: '100%',
            }}
          >
            {record.matched == 0 ? t('', '匹配失败') : record.corpName}
          </div>
        ),
        width: '30%',
      },
      {
        title: t('257683', '曾用名'),
        ellipsis: true,
        render: (_: any, record) => <span>{record.formerName || '--'}</span>,
        width: '20%',
      },
      {
        title: t('138808', '统一社会信用代码'),
        render: (_: any, record) => (
          <span>
            {record.source && record.source in BUSSINESS_TYPE
              ? BUSSINESS_TYPE[record.source as keyof typeof BUSSINESS_TYPE]
              : record.creditCode || '--'}
          </span>
        ),
        width: '20%',
      },
      {
        title: t('419959', '法定代表人'),
        render: (_: any, record) => <span>{record.artificialPerson || '--'}</span>,
        width: '20%',
      },
    ]
  }, [t, renderEditableCell])
}

/**
 * Component to display the company match data table
 */
export const CompanyMatchTable = ({
  dataSource,
  loading,
  setCountStats,
  editItem,
  deleteItem,
  searchCompanies,
}: CompanyMatchTableProps) => {
  const [editingKey, setEditingKey] = useState<number | null>(null)
  const columns = useIndicatorMatchTableColumns({
    setCountStats,
    editItem,
    deleteItem,
    editingKey,
    setEditingKey,
    searchCompanies,
  })

  return (
    <ErrorBoundary>
      <Table
        pagination={false}
        columns={columns}
        dataSource={dataSource || []}
        size="middle"
        loading={loading}
        bordered={true}
        rowKey={() => `row-${Math.random()}`}
      />
    </ErrorBoundary>
  )
}
