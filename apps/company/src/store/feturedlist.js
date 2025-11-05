import { create } from 'zustand'
import { cloneDeep } from 'lodash'
import { corplistpresearch, getCorpListTree, selectbycompcodeV2, selectbykeywordV2 } from '../api/feturedlist'
import intl from '../utils/intl'
import { DefaultSearchType } from '../views/Fetured/featuredList'
import { wftCommon } from '../utils/utils'
import { ranklisttitle } from '../api/feturedcompany'
import { getPreCorpSearchNew } from '../api/homeApi'

const rebuildTree = function (data) {
  var tree = cloneDeep(data)
  let rank = {}
  let rankMap = {
    currentCode: '01030000',
    description: intl('437191', '企业榜单（按地区）'),
    leaf: false,
    level: 2,
    objectName: intl('437191', '企业榜单（按地区）'),
    parentCode: '01000000',
    priority: 0.5,
    total: 0,
    type: 'rank',
    children: [],
  }
  let personMap = {
    currentCode: '01040000',
    description: intl('437192', '人物榜单'),
    leaf: false,
    level: 2,
    objectName: intl('437192', '人物榜单'),
    parentCode: '01040000',
    priority: 2,
    total: 0,
    type: 'rank',
    children: [],
  }
  let list = {}
  for (var i = 0; i < tree.length; i++) {
    if (tree[i].currentCode === '01020000') {
      rank = tree[i]
    } else {
      list = tree[i]
    }
  }
  let newList = [],
    newTotal = 0
  if (rank?.children?.length) {
    for (var i = 0; i < rank.children.length; i++) {
      if (['90000257' /*中国排名*/, '90000260' /*全球排名*/].indexOf(rank.children[i].currentCode) > -1) {
        rankMap.children.push(rank.children[i])
        rankMap.total += rank.children[i].total
      } else if (['90000270' /*富豪榜*/].indexOf(rank.children[i].currentCode) > -1) {
        personMap.children.push(rank.children[i])
        personMap.total += rank.children[i].total
      } else {
        newList.push(rank.children[i])
        newTotal += rank.children[i].total
      }
    }
  }
  rank.children = newList
  rank.total = newTotal
  rank.description = intl('437868', '企业榜单（按行业）')
  rank.objectName = intl('437868', '企业榜单（按行业）')
  let res = [list, rankMap, rank, personMap]
  // 格式化数据供wTree使用
  const format = (arr) => {
    for (let i of arr) {
      i.title = i.objectName
      i.key = i.currentCode
      if (i?.children?.length) {
        format(i.children)
      }
    }
  }
  format(res)
  return res
}

export const useFeturedListStore = create((set, get) => ({
  feturedTree: [], //树
  feturedList: [], //榜单名录列表
  preSearchList: [], //预搜索数据
  selectedKeys: [],
  feturedTreeNum: {},
  headerInfo: {},
  feturedInfoInit: (keword) => {
    get().getFeturedTreeInfo()
    return get().getFeturedList(
      {
        keyword: keword || '',
        pageNo: 0,
        category: keword ? '' : get().selectedKeys[0],
        pageSize: 16,
      },
      keword
    )
  },
  feturedDetailInit: (id) => {
    get().getfeturedDetailHeaderInfo(id)
  },
  getfeturedDetailHeaderInfo: async (id) => {
    let res = await ranklisttitle({
      corpListId: id,
    })
    wftCommon.translateService(wftCommon.deepClone(res.Data), (newData) => {
      let zhDate = {
        ...res.Data,
        ...newData,
      }
      zhDate &&
        set({
          headerInfo: zhDate,
        })
    })
  },
  getCorplistpresearch: async (keyword) => {
    if (!keyword) {
      return set({
        preSearchList: [],
      })
    }
    const res = await corplistpresearch({
      pageno: 0,
      pagesize: 5,
      keyword,
    })
    wftCommon.zh2enAlwaysCallback(res.Data, (data) => {
      set({
        preSearchList: data,
      })
    })
  },
  getCorpNamepresearch: async (keyword) => {
    if (!keyword) {
      return set({
        preSearchList: [],
      })
    }
    const res = await getPreCorpSearchNew({
      queryText: keyword,
    })
    set({
      preSearchList: res.Data?.corplist,
    })
    // wftCommon.zh2enAlwaysCallback( res.Data?.search,(data)=>{
    //   set({
    //     preSearchList: data,
    //   })
    // })
  },
  getFeturedTreeInfo: async () => {
    let { Data: feturedTree } = await getCorpListTree()
    feturedTree = rebuildTree(feturedTree[0]?.children)
    // console.log('🚀 ~getFeturedTreeInfo: ~ feturedTree:', feturedTree)
    set({ feturedTree })
  },
  getFeturedList: async (data, isUpdateTree, type = DefaultSearchType) => {
    // console.log('🚀 ~getFeturedList: ~ data, isUpdateTree, type:', data, isUpdateTree, type)
    let res
    if (type == DefaultSearchType) {
      res = await selectbykeywordV2(data)
    } else {
      res = await selectbycompcodeV2(data)
    }
    const { Data: feturedList } = res
    if (!feturedList) {
      return set({ feturedList: [] })
    }
    if (isUpdateTree) {
      set({ feturedList: feturedList.list, feturedTreeNum: feturedList.aggregations })
    } else {
      set({ feturedList: feturedList.list })
    }
    wftCommon.zh2enAlwaysCallback(feturedList.list, (newData) => {
      feturedList.list = newData
      if (isUpdateTree) {
        set({ feturedList: feturedList.list, feturedTreeNum: feturedList.aggregations })
      } else {
        set({ feturedList: feturedList.list })
      }
    })

    return feturedList.list
  },
  addFeturedList: async (data, type = DefaultSearchType) => {
    let res
    if (type == DefaultSearchType) {
      res = await selectbykeywordV2(data)
    } else {
      res = await selectbycompcodeV2(data)
    }
    const { Data: feturedList } = res
    let newArr = feturedList?.list || []
    let newList = [...get().feturedList, ...newArr]
    set({ feturedList: newList })
    wftCommon.zh2enAlwaysCallback(get().feturedList, (data) => {
      set({ feturedList: data })
    })
    return newArr
  },

  setSelectedKeys: (selectedKeys) => {
    set({ selectedKeys })
  },
}))
