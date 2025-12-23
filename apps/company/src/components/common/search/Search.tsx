import { convertSelectOptionByCount } from '@/components/common/search/comp/OptionRender'
import { CustomSelectByOptions } from '@/components/common/search/comp/customSelect'
import { checkSelectOption } from '@/components/common/search/handle/optionCheck'
import intl, { intlNoIndex } from '@/utils/intl'
import { InputNumber, Select } from '@wind/wind-ui'
import classNames from 'classnames'
import { WindCascade } from 'gel-ui'
import { isArray } from 'lodash'
import React from 'react'
import { pointBuriedByModule } from '../../../api/pointBuried/bury'
import WindSearch from '../../wind/windDataEntry/search/Search'
import './search.less'

const widthDefault = 180
const Search = ({
  className,
  onSearchChange,
  customSearchOptions,
  ...nodes
}: {
  className?: string
  onSearchChange: (filter: Record<string, string>) => void
  customSearchOptions?: any
  [key: string]: any
}) => {
  const handleChange = (value, key) => {
    updateChanged({ [key]: value })
  }

  const handleCascaderChange = (value: any[][], key) => {
    // 只需要 value 二维数组中 每个 一维数组 的最后一位
    const lastValue = value.map((item) => item[item.length - 1])
    updateChanged({ [key]: lastValue.join(',') })
  }

  const handleKeyDown = (ev, node) => {
    if (ev.key === 'Enter') {
      updateChanged({ [node.key || node.searchKey]: ev.target.value })
    }
  }

  const handleSearch = (value, node) => {
    updateChanged({ [node.key]: value })
  }

  const updateChanged = (filter) => {
    onSearchChange(filter)
  }

  const renderSearchOptions = (optionsCfg) => {
    const { optionsKey, options, bury } = optionsCfg
    const _options = options?.map(convertSelectOptionByCount)
    const widthCalculate = `${optionsCfg.width || widthDefault}px`
    switch (optionsCfg.type) {
      case 'select':
        return (
          <Select
            size="large"
            style={{ width: widthCalculate }}
            onChange={(value) => {
              if (bury) {
                const { id, ...rest } = bury
                pointBuriedByModule(id, rest)
              }
              handleChange(value, optionsCfg.key)
            }}
            defaultValue={
              options?.find((res) => res.default)?.key || intlNoIndex(optionsCfg.defaultId, optionsCfg.default)
            }
            options={checkSelectOption(
              _options
                ? optionsCfg.default
                  ? [
                      {
                        label: optionsCfg.default,
                        value: null,
                      },
                      ..._options,
                    ]
                  : [..._options]
                : [{ label: '', key: '' }]
            )}
            data-uc-id="LDmcwbOPm8"
            data-uc-ct="select"
          ></Select>
        )
      case 'inputNumber':
        return (
          <InputNumber
            style={{ width: widthCalculate }}
            placeholder={optionsCfg?.placeholderId ? intlNoIndex(optionsCfg.placeholderId) : optionsCfg?.placeholder}
            onKeyDown={(ev) => {
              if (bury) {
                const { id, ...rest } = bury
                pointBuriedByModule(id, rest)
              }
              handleKeyDown(ev, optionsCfg)
            }}
            data-uc-id="rG0i2v5Vil"
            data-uc-ct="inputnumber"
          />
        )
      case 'search':
        return (
          <WindSearch
            style={{ width: widthCalculate }}
            placeholder={optionsCfg?.placeholderId ? intlNoIndex(optionsCfg.placeholderId) : optionsCfg?.placeholder}
            // allowClear
            onSearch={(ev) => {
              if (bury) {
                const { id, ...rest } = bury
                pointBuriedByModule(id, rest)
              }
              handleSearch(ev, optionsCfg)
            }}
            data-uc-id="4cvyepucVj"
            data-uc-ct="windsearch"
          />
        )
      case 'cascader':
        console.log(optionsCfg)
        return (
          <WindCascade
            style={{ width: widthCalculate }}
            optionsKey={optionsKey}
            options={options}
            placeholder={optionsCfg?.placeholderId ? intl(optionsCfg.placeholderId) : optionsCfg?.placeholder}
            fieldNames={{
              label: window.en_access_config ? 'nameEn' : 'name',
              value: 'code' as any,
              children: 'node',
            }}
            onChange={(v) => {
              if (bury) {
                const { id, ...rest } = bury
                pointBuriedByModule(id, rest)
              }
              handleCascaderChange(v, optionsCfg.key)
            }}
            data-uc-id="jYhwOoNC-X"
            data-uc-ct="windcascade"
          />
        )
      default:
        return null
    }
  }

  return (
    <div className={classNames('search-container', className)}>
      <CustomSelectByOptions
        options={customSearchOptions}
        onSearchChange={onSearchChange}
        data-uc-id="yIUQ1yLOwLJ"
        data-uc-ct="customselectbyoptions"
      />
      {isArray(nodes.searchOptions) &&
        nodes.searchOptions.map((searchOption, index) => {
          if (!searchOption) {
            console.error('searchOptions is null', nodes.searchOptions, searchOption)
            return null
          }
          return (
            <div className="options-container" key={`${searchOption.labelId}_${index}`}>
              {intlNoIndex(searchOption.labelId, searchOption.label) || ''}
              {renderSearchOptions(searchOption)}
              {searchOption.suffix || ''}
            </div>
          )
        })}
    </div>
  )
}

Search.displayName = 'ConfigDetailSearch'
export default Search
