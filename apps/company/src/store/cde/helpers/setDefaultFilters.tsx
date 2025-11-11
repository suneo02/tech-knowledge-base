import intl from '@/utils/intl'

export const setDefaultFilters = (set, param) => {
  let defaultVal = null
  let multi = false // 是否有多个筛选参数同时生效
  let noNeedState = false // 是否不需要默认存续
  if (param) {
    switch (param.type) {
      case 'ipo': // 主板
        multi = true
        noNeedState = true
        defaultVal = [
          { field: 'market_type_code.keyword', itemId: 19, logic: 'bool', title: '是否上市/挂牌', value: ['true'] },
          { field: 'listing_tags_id', itemId: 60, logic: 'any', title: '上市企业', value: ['2010000008'] },
        ]
        break
      case 'snt': // 科创
        multi = true
        noNeedState = true
        defaultVal = [
          { field: 'market_type_code.keyword', itemId: 19, logic: 'bool', title: '是否上市/挂牌', value: ['true'] },
          { field: 'listing_tags_id', itemId: 60, logic: 'any', title: '上市企业', value: ['2010037380'] },
        ]
        break
      case '30x': // 创业板
        multi = true
        noNeedState = true
        defaultVal = [
          { field: 'market_type_code.keyword', itemId: 19, logic: 'bool', title: '是否上市/挂牌', value: ['true'] },
          { field: 'listing_tags_id', itemId: 60, logic: 'any', title: '上市企业', value: ['2010000010'] },
        ]
        break
      case 'bj': // 北交所
        multi = true
        noNeedState = true
        defaultVal = [
          { field: 'market_type_code.keyword', itemId: 19, logic: 'bool', title: '是否上市/挂牌', value: ['true'] },
          { field: 'listing_tags_id', itemId: 60, logic: 'any', title: '上市企业', value: ['2010037381'] },
        ]
        break
      case 'tnb': // 新三板
        multi = true
        noNeedState = true
        defaultVal = [
          { field: 'market_type_code.keyword', itemId: 19, logic: 'bool', title: '是否上市/挂牌', value: ['true'] },
          { field: 'listing_tags_id', itemId: 60, logic: 'any', title: '上市企业', value: ['2010000024'] },
        ]
        break
      case 'fnb': // 新四板
        multi = true
        noNeedState = true
        defaultVal = [
          { field: 'market_type_code.keyword', itemId: 19, logic: 'bool', title: '是否上市/挂牌', value: ['true'] },
          { field: 'listing_tags_id', itemId: 60, logic: 'any', title: '上市企业', value: ['2010000032'] },
        ]
        break
      case 'corporation_tags_1': // 中央企业
        noNeedState = true
        defaultVal = { field: 'corporation_tags', itemId: 59, logic: 'any', title: '央企国企', value: ['中央企业'] }
        break
      case 'corporation_tags_2': // 中央国有企业
        noNeedState = true
        defaultVal = { field: 'corporation_tags', itemId: 59, logic: 'any', title: '央企国企', value: ['中央国有企业'] }
        break
      case 'corporation_tags_3': // 地方国有企业
        noNeedState = true
        defaultVal = {
          field: 'corporation_tags',
          itemId: 59,
          logic: 'any',
          title: '央企国企',
          value: ['省级国有企业,市级国有企业,区县级国有企业'],
        }
        break
      case 'bank':
        noNeedState = true
        defaultVal = {
          field: 'finance_type_code',
          itemId: 106,
          logic: 'any',
          title: '金融机构',
          value:
            param.value && param.value !== '1'
              ? [param.value]
              : [
                  '1000034381000000',
                  '1000034408000000',
                  '1000034409000000',
                  '1000034410000000',
                  '1000034411000000',
                  '1000034414000000',
                  '1000034382000000',
                  '0409019900000000',
                  '1000048454000000',
                  '1000034412000000',
                  '1000034413000000',
                  '1000034416000000',
                  '1000048455000000',
                ],
        }
        break
      case 'insurance':
        noNeedState = true
        defaultVal = {
          field: 'finance_type_code',
          itemId: 106,
          logic: 'any',
          title: '金融机构',
          value:
            param.value && param.value !== '1'
              ? [param.value]
              : ['1000034384000000', '1000034385000000', '1000034386000000', '1000034387000000', '1000045100000000'],
        }
        break
      case 'security':
        noNeedState = true
        defaultVal = {
          field: 'finance_type_code',
          itemId: 106,
          logic: 'any',
          title: '金融机构',
          value: ['1000034377000000'],
        }
        break
      case 'future':
        noNeedState = true
        defaultVal = {
          field: 'finance_type_code',
          itemId: 106,
          logic: 'any',
          title: '金融机构',
          value: ['1000034378000000'],
        }
      case 'fund':
        noNeedState = true
        defaultVal = {
          field: 'finance_type_code',
          itemId: 106,
          logic: 'any',
          title: '金融机构',
          value:
            param.value && param.value !== '1'
              ? [param.value]
              : [
                  '1000034388000000',
                  '1000034389000000',
                  '1000034390000000',
                  '1000034391000000',
                  '1000034395000000',
                  '1000034392000000',
                  '1000034393000000',
                  '1000034394000000',
                ],
        }
        break
      case 'otherFinancial':
        noNeedState = true
        defaultVal = {
          field: 'finance_type_code',
          itemId: 106,
          logic: 'any',
          title: '金融机构',
          value:
            param.value && param.value !== 1
              ? [param.value]
              : [
                  '1000034399000000',
                  '1000034401000000',
                  '1000034402000000',
                  '1000034404000000',
                  '1000034405000000',
                  '1000034406000000',
                  '1000048456000000',
                ],
        }
        break
      case 'debt': // 发债
        defaultVal = { field: 'corp_tags|debt', itemId: 20, logic: 'bool', title: '有无发债信息', value: ['true'] }
        break
      case '生命周期':
        defaultVal = {
          field: 'corporation_tags3',
          itemId: 86,
          logic: 'any',
          title: '生命周期',
          value: ['生命周期:' + param.value],
        }
        break
      case '企业规模':
        defaultVal = {
          field: 'corporation_tags3',
          itemId: 84,
          logic: 'any',
          title: '企业规模',
          value: ['企业规模:' + param.value],
        }
        break
      /**@deprecated 企业性质已全部改为企业所有制性质*/
      case '企业性质':
        defaultVal = { field: 'corp_nature', itemId: 75, logic: 'any', title: '企业所有制性质', value: [param.value] }
        break
      case '企业所有制性质':
        defaultVal = { field: 'corp_nature', itemId: 75, logic: 'any', title: '企业所有制性质', value: [param.value] }
        break
      case '产品':
        defaultVal = { field: 'wkg_tags', itemId: 107, logic: 'any', title: '产品', value: [param.value] }
        break
      case 'gellist':
        let txt = ''
        const itemId = param.itemId ? param.itemId - 0 : ''
        if (itemId == 120) {
          txt = '科技型企业名录'
        }
        if (itemId == 121) {
          txt = '特色企业名录'
        }
        if (itemId == 122) {
          txt = '国企名录'
        }
        if (itemId == 123) {
          txt = '高校名录'
        }
        if (itemId == 124) {
          txt = '绿色名录'
        }
        if (itemId && txt) {
          defaultVal = {
            field: 'listing_tags_id',
            itemId: itemId || 120,
            logic: 'any',
            title: txt,
            value: [param.value],
          }
        }
        break
      case 'gelrank':
        defaultVal = {
          field: 'listing_tags_id',
          itemId: 83,
          logic: 'any',
          title: intl('259917', '上榜榜单'),
          itemType: '9',
          search: [
            {
              objectId: param.value,
              objectName: param.valueName,
            },
          ],
        }
        break
    }
  }

  let filtersNew = []

  const gobLevelDefault = {
    field: 'govlevel',
    itemId: 77,
    logic: 'any',
    title: intl('261971', '营业状态'),
    value: ['存续'],
  }
  if (defaultVal) {
    if (multi) {
      filtersNew = defaultVal
      if (!noNeedState) {
        filtersNew.unshift({
          field: 'govlevel',
          itemId: 77,
          logic: 'any',
          title: intl('261971', '营业状态'),
          value: ['存续'],
        })
      }
    } else {
      filtersNew = noNeedState ? [defaultVal] : [gobLevelDefault, defaultVal]
    }
  } else {
    filtersNew = [gobLevelDefault]
  }
  filtersNew = [
    {
      field: 'data_from',
      itemId: 78,
      logic: 'any',
      title: intl('31990', '机构类型'),
      value: ['298010000,298020000,298040000'],
    },
    ...filtersNew,
  ]

  set({ filters: filtersNew })
}
