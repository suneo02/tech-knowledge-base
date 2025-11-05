import intl from '@/utils/intl'
import { cloneDeep } from 'lodash'
import { TCascadeOptionItem } from '@/components/cascade/type'

export interface IRegionCascadeOptionCfg {
  hasLocation?: boolean
  hasTerritory?: boolean
  current_location?: {
    territoryName: string
  }[]

  territoryList?: {
    territoryName: string
    id: string
  }[]

  regions?: TCascadeOptionItem[]
}

export const convertRegionCascadeOptionByCfg = (
  optionsProp: TCascadeOptionItem[] | null,
  { hasLocation, hasTerritory, current_location = [], territoryList, regions }: IRegionCascadeOptionCfg
) => {
  const options = optionsProp || cloneDeep(regions)
  // 地区暂处理前两级
  if (options.length > 0) {
    if (
      // @ts-expect-error ttt
      ['我的地盘', 'My Zone', '当前定位', intl(261970)].includes(options[1].name) ||
      (typeof options[1].name === 'object' && options[1].name.type === 'a')
    ) {
      options.splice(1, 1)
    }
    if (
      // @ts-expect-error ttt
      ['我的地盘', 'My Zone', '当前定位', intl(261970)].includes(options[0].name) ||
      (typeof options[1].name === 'object' && options[1].name.type === 'a')
    ) {
      options.splice(0, 1)
    }
  }
  if (hasTerritory && territoryList.length > 0) {
    const territories = territoryList.map((item) => {
      return {
        name: item.territoryName,
        code: item.id,
        node: [],
      }
    })
    options.unshift({
      name: window.en_access_config ? 'My Zone' : '我的地盘',
      code: 'territory',
      node: territories,
    })
  }
  if (hasLocation && current_location.length > 0) {
    const name = current_location[0].territoryName
    options.unshift({
      name: '当前定位',
      code: 'current_location',
      node: [
        {
          name,
          code: 'current_location_1',
        },
      ],
    })
  } else if (hasLocation && current_location.length === 0) {
    options.unshift({
      name: intl(261970),
      code: 'current_location',
      disabled: true,
      node: [],
    })
  }
  return options
}
