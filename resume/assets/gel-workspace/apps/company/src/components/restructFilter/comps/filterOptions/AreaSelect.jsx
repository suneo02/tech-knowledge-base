import React, { useEffect, useMemo, useState } from 'react'
import { getAreaCodes } from '../../../../lib/utils'
import { useConditionFilterStore } from '../../../../store/cde/useConditionFilterStore'
import RegionCascader from '../../../myCascader/RegionCascader'
import intl from '../../../../utils/intl'
import { Button } from '@wind/wind-ui'

/**
 * @deprecated
 * 移步 ts 版
 */
const AreaSelect = (props) => {
  const { areaData = [], defaultOption = [], changeOptionCallback = () => null, fieldNames, showFooter } = props
  const { getTerritoryList, territoryList, setGeoFilters, geoFilters } = useConditionFilterStore()
  const currentLocation = useMemo(() => {
    const current = geoFilters.find((item) => !item?.id)
    console.log(current ? [current] : [])
    return current ? [current] : []
  }, [])

  const defaultValue = useMemo(() => {
    // 初始化默认数据
    let resArr = []
    defaultOption.forEach((option) => {
      resArr.push(getAreaCodes(option))
    })
    geoFilters.forEach((item) => {
      if (item?.id) {
        // 判断是地盘还是定位
        resArr.push(['territory', item.id])
      } else {
        resArr.push(['current_location'])
      }
    })
    return resArr
  }, [defaultOption])

  const [refresh, setRefresh] = useState(true) // 强制更新组件
  useEffect(() => {}, [defaultOption])

  const getTerritoryItem = (id) => {
    const preTerritory = territoryList.find((terr) => terr.id === id)
    return {
      id: preTerritory.id,
      territoryName: preTerritory.territoryName,
      areaType: preTerritory.areaType,
      areaJson: preTerritory.areaJson,
    }
  }

  const onChange = (value) => {
    console.log(value)
    let res = [] // filters
    let geoRes = [] // geoFilters
    let resLabel = []
    value.forEach((item) => {
      if (item[0] === 'territory') {
        // 处理geoFilters
        if (item.length === 1) {
          // 全部的地盘
          geoRes = [
            ...territoryList.map((item) => {
              return {
                id: item.id,
                territoryName: item.territoryName,
                areaType: item.areaType,
                areaJson: item.areaJson,
              }
            }),
          ]
        } else {
          // 单独添加地盘
          geoRes.push(getTerritoryItem(item[1]))
        }
      } else if (item[0] === 'current_location') {
        geoRes.push(currentLocation[0])
      } else {
        res.push(item[item.length - 1])

        resLabel.push(item)
      }
    })
    changeOptionCallback(res, resLabel)
  }

  return (
    <>
      <div
        style={{
          height: showFooter ? '450px' : 'auto',
        }}
      >
        {refresh && (
          <RegionCascader
            {...props}
            placeholder={intl('261969', '请选择查询地区')}
            open={true}
            options={areaData}
            hasLocation={false}
            current_location={currentLocation}
            hasTerritory={false}
            territoryList={territoryList}
            defaultValue={defaultOption.length === 0 && geoFilters.length === 0 ? [] : defaultValue}
            onChange={onChange}
          />
        )}
      </div>
      {showFooter ? (
        <div
          style={{
            right: '12px',
            bottom: '-12px',
            overflow: 'hidden',
            // position: 'absolute',
          }}
        >
          <Button
            style={{
              float: 'right',
              // marginTop: '12px',
            }}
            onClick={() => {
              showFooter.onSubmit && showFooter.onSubmit()
            }}
          >
            {intl('257693', '应用筛选')}
          </Button>
          <Button
            style={{
              // marginTop: '12px',
              // position:'absolute',
              float: 'right',
              marginRight: '12px',
            }}
            onClick={() => {
              setRefresh((pre) => !pre)
              setTimeout(() => {
                setRefresh((pre) => !pre)
              }, 20)
              showFooter.onCLear && showFooter.onCLear()
            }}
          >
            {intl('149222', '清空')}
          </Button>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

export default AreaSelect
