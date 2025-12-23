// @ts-nocheck
import { Integration } from '@/assets/icon'
import { Typography } from 'antd'
import { CDEFilterResTable } from 'cde'
import { CDEFilterResItem } from 'gel-api'
import { NumberRange } from 'gel-ui'
import { FC, useEffect, useState } from 'react'
import styles from '../style/filterRes.module.less'

/**
 * cde 数据展示，只展示更新的数据，展示 10 条
 * 添加到已有的表格，可以选择 sheet
 * @returns
 */
export const FilterResAndAddToExist: FC<{
  fetch: () => void
  res: CDEFilterResItem[]
  loading: boolean
  page: {
    total: number
  }
  setIsAddable: (isAddable: boolean) => void
}> = ({ fetch, res, loading, page, setIsAddable }) => {
  const [rangeValue, setRangeValue] = useState<[number | null, number | null]>([null, null])

  useEffect(() => {
    fetch()
  }, [])

  const handleRangeChange = (value: [number | null, number | null]) => {
    setRangeValue(value)
    setIsAddable(value[0] !== null && value[1] !== null)
  }

  return (
    <div className={styles['filter-res']}>
      {page && <Typography.Text>{`共有${page?.total}家企业符合筛选条件，数据仅展示10条，如下所示：`}</Typography.Text>}
      <CDEFilterResTable className={styles['filter-res__table']} dataSource={res} loading={loading} />
      <div className={styles['filter-res__bottom']}>
        <NumberRange
          className={styles['filter-res__range']}
          prefix={'条数选择'}
          min={1}
          max={10000}
          value={rangeValue}
          onChange={handleRangeChange}
        />
        <Typography.Text className={styles['filter-res__range-text']}>
          消耗积分：{rangeValue[0] !== null && rangeValue[1] !== null ? rangeValue[1] - rangeValue[0] + 1 : '-'}
          <Integration />
        </Typography.Text>
      </div>
    </div>
  )
}
