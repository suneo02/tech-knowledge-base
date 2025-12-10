import { createWFCRequest } from '@/api'
import { Collapse } from '@wind/wind-ui'
import {
  CDEDisplayFooter,
  CDEFilterItemUser,
  CDEFilterResTable,
  CDESaveFilterButton,
  getCDEFiltersTextUtil,
  isValidUserFilterItem,
} from 'cde'
import { CDEFilterItem, CDEFilterResItem } from 'gel-api'
import { NumberRangeValue } from 'gel-ui'
import { FC, useEffect, useMemo, useState } from 'react'
import { NumberSelectAndPoints } from '../../misc/NumberSelectAndPoints'
import styles from '../style/filterRes.module.less'

const saveSubFunc = createWFCRequest('operation/insert/addsubcorpcriterion')

const CollapsePanel: FC<{
  filtersValid: CDEFilterItemUser[]
  getFilterItemById: (itemId: CDEFilterItem['itemId']) => CDEFilterItem | undefined
  codeMap: Record<string, string>
}> = ({ filtersValid, getFilterItemById, codeMap }) => {
  const PanelHeader: FC = () => (
    <div className={styles['filter-res__header']}>
      <span>{`筛选条件（${filtersValid.length}）`}</span>
    </div>
  )
  const filtersText = useMemo(() => {
    return getCDEFiltersTextUtil(filtersValid, getFilterItemById, codeMap)
  }, [filtersValid, getFilterItemById, codeMap])
  return (
    // @ts-ignore
    <Collapse defaultActiveKey={['1']}>
      {/* @ts-ignore */}
      <Collapse.Panel header={<PanelHeader />} key="1">
        <p>{filtersText}</p>
      </Collapse.Panel>
    </Collapse>
  )
}
/**
 * cde 数据展示
 * 首页展示所用，添加到一个新的表格
 * @returns
 */
export const FilterResPreview: FC<{
  fetch: () => void
  res: CDEFilterResItem[]
  loading: boolean
  page?: {
    total: number
  }
  rangeValue: NumberRangeValue
  setRangeValue: (value: NumberRangeValue) => void
  filters: CDEFilterItemUser[]
  getFilterItemById: (itemId: CDEFilterItem['itemId']) => CDEFilterItem | undefined
  codeMap: Record<string, string>
  handleReturn: () => void
  handleAddToTable: () => void
  onSaveFilterFinish: () => void
  confirmLoading: boolean
}> = ({
  fetch,
  res,
  loading,
  page,
  rangeValue,
  setRangeValue,
  filters,
  getFilterItemById,
  codeMap,
  handleReturn,
  handleAddToTable,
  onSaveFilterFinish,
  confirmLoading,
}) => {
  const isAddableValid = useMemo(() => rangeValue[0] != null && rangeValue[1] != null, [rangeValue])
  useEffect(() => {
    fetch()
  }, [])

  const filtersValid = filters.filter((item) => isValidUserFilterItem(item))

  return (
    <div className={styles['filter-res']}>
      <div className={styles['filter-res__header']}>
        <CollapsePanel filtersValid={filtersValid} getFilterItemById={getFilterItemById} codeMap={codeMap} />
        <CDESaveFilterButton
          filtersValid={filtersValid}
          onSaveFilterFinish={onSaveFilterFinish}
          saveSubFunc={saveSubFunc}
        />
      </div>
      <div className={styles['filter-res__table-desc']}>
        当前筛选条件组下，共有{page?.total}家企业，以下是部分企业信息，如需查看全部，请添加至表格。
      </div>
      <CDEFilterResTable className={styles['filter-res__table']} dataSource={res} loading={loading} />
      <NumberSelectAndPoints
        className={styles['filter-res__bottom']}
        rangeValue={rangeValue}
        setRangeValue={setRangeValue}
      />
      <CDEDisplayFooter
        className={styles['filter-res-footer']}
        handleReturn={handleReturn}
        handleAddToTable={handleAddToTable}
        isAddable={isAddableValid}
        confirmLoading={confirmLoading}
        fetchResLoading={loading}
      />
    </div>
  )
}
