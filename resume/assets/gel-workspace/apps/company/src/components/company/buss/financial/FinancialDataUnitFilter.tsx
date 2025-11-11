import { Select } from '@wind/wind-ui'
import { intl } from 'gel-util/intl'
import React, { FC, useEffect } from 'react'
import { ICorpDetailModuleWithChildrenCfg } from '../../type'

export const FinancialDataUnitFilterOptions = [
  {
    label: intl('23334', '元'),
    value: 1,
  },
  {
    label: intl('19506', '千元'),
    value: 1e3,
  },
  {
    label: intl('286695', '万元'),
    value: 1e4,
  },
  {
    label: intl('1561', '百万元'),
    value: 1e6,
  },
  {
    label: intl('19493', '亿元'),
    value: 1e8,
  },
  {
    label: intl('19504', '十亿元'),
    value: 1e9,
  },
]

const defaultVal = FinancialDataUnitFilterOptions[2].value

export const FinancialDataUnitFilter: FC<{ corpModuleSubCfg: ICorpDetailModuleWithChildrenCfg }> = ({
  corpModuleSubCfg,
}) => {
  const handleChange = (val: number | string) => {
    try {
      corpModuleSubCfg.children[0].financialDataFilterFunc(val)
      corpModuleSubCfg.children[1].financialDataFilterFunc(val)
      corpModuleSubCfg.children[2].financialDataFilterFunc(val)
    } catch (e) {
      console.error(e)
    }
  }
  useEffect(() => {
    handleChange(defaultVal)
  }, [])

  return (
    <Select
      defaultValue={defaultVal}
      style={{ width: 120 }}
      onChange={(val) => {
        try {
          if (Array.isArray(val)) {
            return
          }
          handleChange(String(val))
        } catch (e) {
          console.error(e)
        }
      }}
      options={FinancialDataUnitFilterOptions}
      data-uc-id="z2IVpkH8Uq"
      data-uc-ct="select"
    ></Select>
  )
}
