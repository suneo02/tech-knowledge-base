import { Button } from '@wind/wind-ui'
import { CDEFilterItemUser, CDESaveFilterButton } from 'cde'
import classNames from 'classnames'
import { TRequestToWFCSpacfic } from 'gel-api'
import { isNil } from 'lodash'
import { FC, useState } from 'react'
import { AddCDEDataBtn } from '../AddDataBtn'
import { FilterResTip } from '../FilterResTip'
import styles from '../style/CDEFilterConsoleFooter.module.less'

export interface CDEFilterConsoleFooterProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  onSaveFilterFinish: () => void | undefined
  total: number | undefined
  saveSubFunc: TRequestToWFCSpacfic<'operation/insert/addsubcorpcriterion'>
  confirmLoading: boolean
  handleAddToTable: (addNum?: number) => void
  confirmText: string
  className?: string
  hasValidFilter: boolean
  resetFilters: () => void
  filtersValid: CDEFilterItemUser[]
  canAddCdeToCurrent?: boolean
}

/**
 * CDEFilterConsole 专用底部按钮组件，包含保存条件、重置筛选、立即搜索及视图切换按钮
 */
export const CDEFilterConsoleFooter: FC<CDEFilterConsoleFooterProps> = ({
  resetFilters,
  hasValidFilter,
  className,
  filtersValid,
  saveSubFunc,
  onSaveFilterFinish,
  total,
  confirmLoading,
  handleAddToTable,
  canAddCdeToCurrent,
  // confirmText,
  ...restProps
}) => {
  const [addNum, setAddNum] = useState<number | undefined>(total ? Math.min(total, 2000) : undefined)

  return (
    <div className={classNames(styles['filter-console-footer'], className)} {...restProps}>
      <div className={styles.mainRowFirst}>
        <FilterResTip total={total} onAddNumChange={setAddNum} loading={confirmLoading} />
      </div>
      <div className={styles.mainRowSecond}>
        <div className={styles.leftButtons}>
          {/* <span className={styles.footerDesc}>支持查询中国大陆境内企业</span> */}
        </div>
        <div className={styles.rightButtons}>
          {/* 仅在主筛选视图中显示保存条件按钮 */}
          <CDESaveFilterButton
            filtersValid={filtersValid}
            saveSubFunc={saveSubFunc}
            onSaveFilterFinish={onSaveFilterFinish}
          />
          {/* 重置筛选 */}
          <Button key="reset" onClick={resetFilters}>
            重置筛选
          </Button>
          <AddCDEDataBtn
            hasValidFilter={hasValidFilter}
            disabled={isNil(total) || total === 0 || !hasValidFilter}
            loading={confirmLoading}
            onClick={() => handleAddToTable(addNum)}
            content={'添加至新表格'}
          />

          {canAddCdeToCurrent && (
            <AddCDEDataBtn
              hasValidFilter={hasValidFilter}
              disabled={isNil(total) || total === 0 || !hasValidFilter}
              loading={confirmLoading}
              onClick={() => handleAddToTable(addNum)}
              content={'添加至当前表格'}
            />
          )}
        </div>
      </div>
    </div>
  )
}
