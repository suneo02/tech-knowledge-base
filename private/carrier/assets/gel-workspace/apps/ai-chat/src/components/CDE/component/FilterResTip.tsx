import { CoinsIcon } from '@/assets/icon'
import { LoadingO } from '@wind/icons'
import { InputNumber } from '@wind/wind-ui'
import { formatNumber } from 'gel-util/format'
import { isNil } from 'lodash'
import { FC, useEffect, useState } from 'react'
import styles from './style/filterResTip.module.less'
export const CDE_MAX_ADD_TO_TABLE_NUM = 2000
export const CDE_POINT_PER = 1

/**
 * 获取可添加到表格的企业数量
 *
 * 如果搜索结果少于 2000 家，则返回搜索结果数量
 * 如果搜索结果大于 2000 家，则返回 2000
 *
 * @param total
 * @returns
 */
export const getCDEFilterResAddNum = (total: number) => {
  if (total < CDE_MAX_ADD_TO_TABLE_NUM) {
    return total
  }
  return CDE_MAX_ADD_TO_TABLE_NUM
}

/**
 * 根据添加条数 计算 point
 */
export const getCDEFilterResAddPoint = (addNum: number) => {
  return addNum * CDE_POINT_PER
}
/**
 * 已为您搜索到 203,093,232 家企业，最多可添加 2,000 家企业至表格（消耗500积分）
 *
 */
export interface FilterResTipProps {
  className?: string
  total: number | undefined
  onAddNumChange?: (value: number) => void
  loading?: boolean
}

export const FilterResTip: FC<FilterResTipProps> = ({ total, onAddNumChange, loading }) => {
  const [addNum, setAddNum] = useState<number>(0)
  const [addPoint, setAddPoint] = useState<number>(0)
  const [lastValidValue, setLastValidValue] = useState<number>(0)

  const maxAddNum = isNil(total) ? 0 : getCDEFilterResAddNum(total)

  useEffect(() => {
    if (!isNil(total)) {
      const newMaxAddNum = getCDEFilterResAddNum(total)
      setAddNum(newMaxAddNum)
      setLastValidValue(newMaxAddNum)
      setAddPoint(getCDEFilterResAddPoint(newMaxAddNum))
    }
  }, [total])

  const handleAddNumChange = (value: number | null) => {
    // 如果输入无效值（null、负数或0），保持上一次有效值
    if (!value || value <= 0) {
      setAddNum(lastValidValue)
      return
    }

    // 不能超过最大可添加数量
    const newAddNum = Math.min(value, maxAddNum)
    setAddNum(newAddNum)
    setLastValidValue(newAddNum)
    setAddPoint(getCDEFilterResAddPoint(newAddNum))

    if (onAddNumChange) onAddNumChange(newAddNum)
  }

  if (isNil(total)) return null

  return (
    <div className={styles.filterResTip}>
      已为您搜索到{' '}
      {loading ? (
        <LoadingO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
      ) : (
        <span className={styles.bold}>{formatNumber(total)}</span>
      )}
      家企业，最多添加
      {formatNumber(Math.min(maxAddNum, 2000))} 家, 添加
      <InputNumber
        size="small"
        className={styles.addNumInput}
        value={addNum}
        onChange={(value) => handleAddNumChange(value as number | null)}
        min={1}
        max={maxAddNum}
        precision={0}
      />
      家企业至表格 <CoinsIcon className={styles.addPointIcon} />
      <span className={styles.addPoint}>{formatNumber(addPoint)}</span>
    </div>
  )
}
