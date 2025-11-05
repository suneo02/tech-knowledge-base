import vipLogo from '@/assets/imgs/svip.png'
import { flattenWindCascadeValue, parseFlattenedWindCascadeValue } from '@/components/cascade'
import { WIndCascadeOptionCommon, WindCascadeFieldNamesCommon } from '@/components/cascade/type'
import { WindCascade } from '@/components/cascade/WindCascade'
import { industryTree as allIndustryTrees } from '@/utils/config'
import React, { FC, useMemo, useState } from 'react'
import { useConditionFilterStore } from '../../../../store/cde/useConditionFilterStore'
import { globalAreaTreeCn } from '../../../../utils/areaTree'
import { globalIndustryOfNationalEconomy4 } from '../../../../utils/industryOfNationalEconomyTree'
import { ConfidenceEnum, ConfidenceSelector, ConfidenceSelectorProps } from '../filterOptions/ConfidenceSelector'
import styles from './styles/cityOrIndustry.module.less'

const PREFIX = 'city-or-industry'

export const CityOrIndusty: FC<{
  item: {
    itemId?: number
    logicOption?: string
    itemField?: string
    labels4see?: string[]
    itemName?: string
    extraOptions?: {
      label: string
      value: string
    }[]
    confidence?: string
    isVip?: boolean
  }
  parent: any
}> = ({ item = {}, parent }) => {
  console.log('🚀 ~ item1111:', item)
  const { itemId, logicOption, itemName, extraOptions, confidence, isVip } = item //itemId:89地区，90行业
  const { updateFilters, getFilterById, filters } = useConditionFilterStore()

  const filter = useMemo(() => getFilterById(itemId), [itemId, filters]) // 寻找是否存在filter

  const [confidenceValue, setConfidenceValue] = useState(filter?.confidence || confidence)

  const changeOptionCallback = (value: string[][]) => {
    const valueFlattened = flattenWindCascadeValue(value)
    updateFilters({
      filter: item,
      value: valueFlattened,
      logic: logicOption,
      confidence: confidenceValue,
    })
  }

  const options = useMemo<WIndCascadeOptionCommon[]>(() => {
    if (itemId === 89) {
      return globalAreaTreeCn
    }
    switch (item?.itemField) {
      case 'strategicNewIndustry': // 战略性新兴产业
        return allIndustryTrees.StrategicEmergingIndustryTree
      case 'highTechManufacturingIndustry': // 高技术产业（制造业）
        return allIndustryTrees.HighTechManufacturingIndustryTree
      case 'highTechServiceIndustry': // 高技术产业（服务业）
        return allIndustryTrees.HighTechServiceIndustryTree
      case 'intellectualPropertyIndustry': // 知识产权（专利）密集型产业
        return allIndustryTrees.IntellectualIndustryTree
      case 'greenIndustry': // 绿色低碳转型产业
        return allIndustryTrees.GreenIndustryTree
      case 'agricultureIndustry': // 农业及相关产业
        return allIndustryTrees.AgricultureRelatedIndustryTree
      case 'agingCareIndustry': // 养老产业
        return allIndustryTrees.AgingCareIndustryTree
      case 'digitalEconomyIndustry': // 数字经济及其核心产业
        return allIndustryTrees.DigitalIndustryTree
      case 'industry_wind_code': // wind行业
        return allIndustryTrees.WindIndustryTree
      case 'track_id': // 来觅赛道
        return allIndustryTrees.RimeTrackIndustryTree
      default:
        return globalIndustryOfNationalEconomy4
    }
  }, [item?.itemField, parent, itemId])

  const value = parseFlattenedWindCascadeValue(
    filter ? filter.value : [],
    options,
    WindCascadeFieldNamesCommon.value,
    WindCascadeFieldNamesCommon.children
  ) as string[][]

  // value变化
  const onConfidenceChange = (newConfidenceValue: ConfidenceEnum) => {
    setConfidenceValue(newConfidenceValue)
    if (!value.length) return
    const currentFilter = getFilterById(itemId)
    const _filter = {
      filter: item,
      value: currentFilter ? currentFilter.value : [], // 使用已有的filter.value或空数组
      logic: logicOption, // 保持与 changeOptionCallback 一致
      confidence: newConfidenceValue,
    }
    updateFilters(_filter)
  }

  return (
    <div className={styles[`${PREFIX}-container`]} key={itemId}>
      <div className={styles[`${PREFIX}-title`]}>
        {' '}
        {itemName} {isVip ? <img className={styles[`${PREFIX}-title-logo`]} src={vipLogo} /> : null}{' '}
      </div>
      <div>
        <ConfidenceSelector // 添加置信度组件
          options={extraOptions as ConfidenceSelectorProps['options']}
          defaultValue={filter?.confidence || confidence}
          industryTitle={item.itemName}
          onChange={(value) => onConfidenceChange(value as ConfidenceEnum)}
        />
        <div>
          <WindCascade
            className={styles[`${PREFIX}-cascade`]}
            dropdownMatchSelectWidth
            fieldNames={WindCascadeFieldNamesCommon}
            value={value}
            onChange={changeOptionCallback}
            options={options}
            size="large"
            expandTrigger={itemId === 89 ? 'hover' : 'click'}
          />
        </div>
      </div>
    </div>
  )
}

export default CityOrIndusty
