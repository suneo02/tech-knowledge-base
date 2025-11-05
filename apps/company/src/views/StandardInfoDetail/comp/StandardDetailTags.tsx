import { EStandard, STANDARD_URL_PARAM_MAP } from '@/handle/link'
import { Tag } from '@wind/wind-ui'
import React, { FC, useMemo } from 'react'
import { useGetStandardDetailSearchParam } from '../api/index.ts'
import type { IStandardDetailFront } from '../type.d.ts'

export const StandardDetailTags: FC<{
  standardData: IStandardDetailFront
}> = ({ standardData }) => {
  const { type } = useGetStandardDetailSearchParam()

  const mockLabel = useMemo(() => {
    const res: string[] = []
    if (type === STANDARD_URL_PARAM_MAP[EStandard.LOCAL]) {
      res.push('地方标准')
    }
    if (standardData?.standardLevel?.length) {
      res.push(standardData?.standardLevel)
    }
    if (standardData?.standardStatus?.length) {
      res.push(standardData?.standardStatus)
    }
    if (standardData?.standardNature?.length) {
      res.push(standardData?.standardNature)
    }
    return res
  }, [standardData])

  return (
    <p>
      {mockLabel.map((i, index) => {
        return (
          // @ts-expect-error ttt
          <Tag key={index} className={`${index % 2 === 0 ? 'tag__type1' : 'tag__type2'}`}>
            {i}
          </Tag>
        )
      })}
    </p>
  )
}
