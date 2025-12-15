import { IndicatorBulkImportApi } from '@/BulkImport/type.tsx'
import { Button } from '@wind/wind-ui'
import { useControllableValue } from 'ahooks'
import classNames from 'classnames'
import { IndicatorCorpMatchItem, IndicatorCorpSearchRes } from 'gel-api'
import { t } from 'gel-util/intl'
import React, { useEffect, useState } from 'react'
import { CorpSearchSelect } from '../CorpSearchSelect/index.tsx'
import { EditableCorpDisplay } from './components/EditableCorpDisplay'
import styles from './index.module.less'

/**
 * 可编辑单元格的属性接口
 */
interface EditableCellProps extends Pick<IndicatorBulkImportApi, 'searchCompanies'> {
  value: IndicatorCorpMatchItem
  defaultIsEditing?: boolean // 非受控模式下的默认编辑状态
  isEditing?: boolean // 受控模式下的编辑状态
  onEditingChange?: (editing: boolean) => void // 编辑状态变化的回调
  onChange?: (value: IndicatorCorpMatchItem) => void // 值变更时的回调函数
  onDel: () => void // 删除操作的回调函数
  editable?: boolean // 控制单元格是否可以进入编辑状态
  className?: string // 单元格的类名
  edittingClassName?: string // 编辑状态下的单元格类名
}

/**
 * EditableCell组件 - 可编辑的单元格组件
 *
 * 功能特点:
 * 1. 支持查看和编辑两种模式切换
 * 2. 编辑模式下使用CorpSearchSelect组件进行公司搜索
 * 3. 根据匹配状态(matched)显示不同的样式
 * 4. 提供编辑和删除操作
 * 5. 维护内部编辑状态，支持取消恢复原值
 * 6. 支持受控和非受控的编辑状态
 */
export const EditableCorpCell: React.FC<EditableCellProps> = ({
  value,
  defaultIsEditing = false,
  isEditing: externalIsEditing,
  onEditingChange,
  onChange,
  onDel,
  editable = true, // 默认可编辑
  searchCompanies,
  className,
  edittingClassName,
}) => {
  // 内部维护一个编辑中的值状态
  const [editingValue, setEditingValue] = useState<IndicatorCorpMatchItem>(value)

  // 使用 ahooks 的 useControllableValue 处理受控/非受控状态
  const [isEditing, setIsEditing] = useControllableValue<boolean>({
    value: externalIsEditing,
    defaultValue: defaultIsEditing,
    onChange: onEditingChange,
  })

  // 处理公司选择变更
  const handleCorpChange = (company: IndicatorCorpSearchRes) => {
    if (!company.corpName || !company.corpId) return
    setEditingValue({
      ...editingValue,
      ...company,
      queryText: company.corpName,
      matched: 2, // 标记为已匹配
    })
  }

  // 同步 value 到 editingValue
  useEffect(() => {
    if (isEditing) {
      setEditingValue(value)
    }
  }, [isEditing, value])

  // 确认编辑并保存值
  const handleSave = () => {
    setIsEditing(false)
    onChange?.(editingValue)
  }

  // 取消编辑，恢复为查看模式
  const handleCancel = () => {
    setIsEditing(false)
  }

  // 进入编辑模式
  const handleEdit = () => {
    if (!editable) return // 如果不可编辑，则不执行编辑操作
    setIsEditing(true)
    setEditingValue(value)
  }

  return (
    <div
      className={classNames(
        {
          [styles['editable-cell--editor']]: isEditing,
          ...(edittingClassName ? { [edittingClassName]: isEditing } : {}),
        },
        styles['editable-cell'],
        className
      )}
    >
      {isEditing ? (
        // 编辑模式 - 显示搜索选择器和操作按钮
        <>
          <CorpSearchSelect
            corpName={value.corpName || undefined}
            queryText={value.queryText}
            onChange={handleCorpChange}
            searchCompanies={searchCompanies}
          />
          <div className={styles['editable-cell-btn-container']}>
            <Button className={styles['editable-cell-btn']} onClick={handleCancel}>
              {t('372173', '取消')}
            </Button>
            <Button type="primary" className={styles['editable-cell-btn']} onClick={handleSave}>
              {t('12238', '确定')}
            </Button>
          </div>
        </>
      ) : (
        // 查看模式 - 使用展示组件
        <EditableCorpDisplay value={value} editable={editable} onEdit={handleEdit} onDelete={onDel} />
      )}
    </div>
  )
}
