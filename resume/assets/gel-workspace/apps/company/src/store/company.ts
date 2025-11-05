/** @format */

import { create } from 'zustand'
import { pointBuriedNew } from '@/api/configApi.ts'
import companyData from '@/mock/company/index.json'
import companyDataGov from '@/mock/company/gov.json'
import companyDataLawyer from '@/mock/company/lawyer.json'
import companyDataSocial from '@/mock/company/social.json'
import companyDataPublic from '@/mock/company/public.json'
import companyDataHongkong from '@/mock/company/hongkong.json'
import companyDataTaiwan from '@/mock/company/taiwan.json'
import { wftCommon } from '../utils/utils'

import { BuryCfgList } from '../api/pointBuried/config'
import { getCorpHeaderInfo, ICorpCardInfo } from '@/api/corp/info/cardInfo.ts'

import { handleConfigDetailNum, handleTreeData } from './handle'
import { getCompanyBasicNum } from '@/api/companyApi.ts'
import { ICorpBasicNumFront } from '../handle/corp/basicNum/type.ts'
import { getInitCorpPatentNum } from '../handle/corp/basicNum/patent.ts'
import { getInitCorpBidNum, getInitCorpBidPenetrationNum } from '../handle/corp/basicNum/bid.ts'
import { ICfgDetail, ICfgDetailJSON } from '@/types/configDetail/module.ts'

export interface ICorpStoreState {
  corpCode: string | null | undefined
  basicInfo: ICorpCardInfo | object
  basicNum: Partial<ICorpBasicNumFront>
  treeData: ICfgDetail
  expandedKeys: any[]
  selectedKeys: any[]
  autoExpandParent: boolean
  autoCompleteDataSource: any[]
  position: string

  init: (corpCode: string) => void
  getCompanyBasicInfo: (corpCode: string) => void
  setExpandedKeys: (keys) => void
  setSelectedKeys: (keys) => void
  setTreeData: (config, noHandleTree?: boolean, ifExpandAll?: boolean) => void
  appendBasicNum: (num: ICorpStoreState['basicNum']) => void
}

export const useCorpStore = create<ICorpStoreState>((set, get) => ({
  corpCode: null,
  basicInfo: {},
  basicNum: {},
  treeData: [],
  expandedKeys: [],
  selectedKeys: [],
  autoExpandParent: false,
  autoCompleteDataSource: [],
  position: '',

  init: async (corpCode) => {
    get().getCompanyBasicInfo(corpCode)
    set({ corpCode })
  },

  setTreeData: async (config, noHandleTree, ifExpandAll) => {
    const treeData = noHandleTree ? config : handleTreeData(config)
    set({ treeData })
    if (treeData.length) {
      let keys = treeData.filter((res) => res.showMenu !== 'hidden').map((res) => res.key)
      if (!ifExpandAll) {
        // 不展开全部，只取第一个
        keys = [keys[0]]
      }
      set({ expandedKeys: keys, selectedKeys: [keys[0]] })
    }
  },

  setSelectedKeys: (selectedKeys) => {
    if (!selectedKeys.length) return
    const keysArr = selectedKeys[0].split('-')
    const parentKey = keysArr.splice(0, keysArr.length - 1).join('-')
    get().setExpandedKeys(parentKey)
    set({ selectedKeys: selectedKeys })
  },

  getCompanyBasicInfo: async (corpCode) => {
    const { Data: basicInfo } = await getCorpHeaderInfo(corpCode)
    set({ basicInfo })
    if (basicInfo) {
      let treeData: ICfgDetailJSON = companyData
      switch (basicInfo.typeCode) {
        case 100001: // 境内企业
          treeData = companyData
          break
        case 912034101: // 律所
          treeData = companyDataLawyer
          break
        case 160300000: // 政府组织
          treeData = companyDataGov
          break
        case 160900000: // 社会组织
          treeData = companyDataSocial
          break
        case 160307000: // 事业单位
          treeData = companyDataPublic
          break
        case 298060000: // 中国香港
          treeData = companyDataHongkong
          break
        case 298001002: // 中国台湾
          treeData = companyDataTaiwan
          break
        default:
          break
      }
      get().setTreeData(treeData)
    }
    if (window.en_access_config) wftCommon.translateService(basicInfo, (v) => set({ basicInfo: v }))

    /** 企业数量 */
    getCompanyBasicNum(corpCode).then((res) => {
      get().appendBasicNum(res.Data)
    })

    /**
     * 这几个统计数字特殊处理 性能考虑
     */
    getInitCorpPatentNum(corpCode).then((res) => {
      get().appendBasicNum(res)
    })
    getInitCorpBidNum(corpCode).then((res) => {
      get().appendBasicNum(res)
    })
    getInitCorpBidPenetrationNum(corpCode).then((res) => {
      get().appendBasicNum(res)
    })
  },
  appendBasicNum: (numAppend) => {
    console.log('~ num append', numAppend)
    const numNew = { ...get().basicNum, ...numAppend }
    set({ basicNum: numNew })
    const numTreeData = handleConfigDetailNum(get().treeData, numNew)
    set({ treeData: numTreeData })
  },
  pointBuried: (props) => {
    const { moduleId, ...rest } = props
    const {
      moduleId: _moduleId,
      describe,
      ...buryItem
    } = BuryCfgList?.['company']?.find((res) => props.opActive === res.opActive)
    if (!(_moduleId || moduleId)) return
    pointBuriedNew(_moduleId || moduleId, { ...buryItem, ...rest })
  },

  /** 不处理逻辑，expand切换 */
  toggleExpanded: (expandedKeys) => set({ expandedKeys }),

  /** 如果重复则不添加 */
  setExpandedKeys: (keys) => {
    const expandedKeys = get().expandedKeys
    if (!expandedKeys.includes(keys)) {
      set({ expandedKeys: [...expandedKeys, keys] })
    }
  },
}))
