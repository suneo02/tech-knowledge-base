import { CDEFilterCategory } from 'gel-api'

/**
 * {
        searchPlaceholder: '请输入细分赛道名称',
        itemType: '9',
        itemEn: '',
        selfDefine: 0,
        itemOption: [],
        hasExtra: false,
        parentId: 0,
        isVip: 0,
        itemId: 141,
        itemName: '来觅赛道',
        hoverHint:
          '由RimeData来觅数据根据一级市场的投资特征，基于被投企业的官网信息、主营构成、产品业务、上榜信息、新闻报道进行精准分类，目前仅覆盖有PEVC投融事件的中国大陆企业',
        itemField: 'track_id',
        logicOption: 'any',
      },
      {
        searchPlaceholder: '请输入所属园区名称',
        itemType: '9',
        itemEn: '',
        selfDefine: 0,
        itemOption: [],
        hasExtra: false,
        parentId: 0,
        isVip: 0,
        itemId: 140,
        itemName: '所属园区',
        itemField: 'park_id',
        logicOption: 'any',
      },

      去除 百分的两个筛选项
 * @param cfg 
 */
export const filterCDECfg = (cfg: CDEFilterCategory[]) => {
  return cfg.map((category) => ({
    ...category,
    newFilterItemList: category.newFilterItemList?.filter((item) => item.itemId !== 141 && item.itemId !== 140),
  }))
}
