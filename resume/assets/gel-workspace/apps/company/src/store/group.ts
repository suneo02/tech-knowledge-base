/** @format */

import { pointBuriedNew } from '@/api/configApi.ts'
import characterData from '@/mock/character/index.json'
import groupData from '@/mock/group/test.json'
import { create } from 'zustand'
import { getGroupDataApi } from '../api/groupApi'
import { hashParams } from '../utils/links'
import { wftCommon } from '../utils/utils'

import { BuryCfgList } from '@/api/pointBuried'
import { ICfgDetail, ICfgDetailJSON, ICfgDetailSubMenu } from '@/types/configDetail/module.ts'
import { handleConfigDetailNum, handleTreeData } from './handle'

const { getParamValue } = hashParams()

export const TreeModuleName = {
  Company: 'company',
  Group: 'group',
  Character: 'character',
}

export interface IGroupStore {
  module: string
  basicInfo: any
  treeData: ICfgDetail
  expandedKeys: string[]
  selectedKeys: string[]
  autoExpandParent: boolean
  autoCompleteDataSource: any[]
  position: string

  treeModeInit: (module?: string, treeData?: ICfgDetailJSON) => void
  handleModule: (module: string, treeData?: ICfgDetailJSON) => void
  setBasicInfo: (type: string) => void
  setTreeData: (config: ICfgDetailJSON, noHandleTree?: boolean, ifExpandAll?: boolean) => void
  setSelectedKeys: (selectedKeys: string[]) => void
  getGroupBasicInfo: () => void
  getCharacterBasicInfo: () => void
  pointBuried: (props: any) => void
  toggleExpanded: (expandedKeys: string[]) => void
  setExpandedKeys: (keys: string) => void
  setPosition: (position: string) => void
  updateNode: (node: Partial<ICfgDetailSubMenu> & Pick<ICfgDetailSubMenu, 'treeKey'>) => void
}

export const useGroupStore = create<IGroupStore>((set, get) => ({
  module: '',
  basicInfo: {},
  treeData: [],
  expandedKeys: [],
  selectedKeys: [],
  autoExpandParent: false,
  autoCompleteDataSource: [],
  position: '',

  treeModeInit: async (module, treeData) => {
    set({ module })
    get().handleModule(module, treeData)
  },

  handleModule: async (module, treeData) => {
    if (module === TreeModuleName.Group) {
      get().setTreeData(treeData || groupData)
    }
    if (module === TreeModuleName.Character) {
      get().setTreeData(characterData, undefined, true)
    }
    get().setBasicInfo(module)
  },
  setBasicInfo: async (type) => {
    switch (type) {
      case TreeModuleName.Group:
        get().getGroupBasicInfo()
        break
      case TreeModuleName.Character:
        get().getCharacterBasicInfo()
        break
      default:
        break
    }
  },

  /**
   *
   * @param config
   * @param noHandleTree
   * @param ifExpandAll 是否展开全部
   * @returns {Promise<void>}
   */
  setTreeData: async (config, noHandleTree, ifExpandAll) => {
    const treeData = noHandleTree ? config : handleTreeData(config)
    set({ treeData })
    if (treeData.length) {
      let keys = treeData.map((res) => res.key)
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

  getGroupBasicInfo: async () => {
    const { Data: basicInfo } = await getGroupDataApi('detail/group/groupBasicInfo')
    set({ basicInfo: { ...basicInfo, groupSystemId: getParamValue('id'), id: getParamValue('id') } })
    if (window.en_access_config) wftCommon.translateService(basicInfo, (v) => set({ basicInfo: v }))
  },
  getCharacterBasicInfo: async () => {
    const { Data: basicInfo } = await getGroupDataApi('detail/person/getPersonIntro')
    set({ basicInfo: { ...basicInfo, id: getParamValue('id') } })
    if (window.en_access_config) wftCommon.translateService(basicInfo, (v) => set({ basicInfo: v }))
    setTimeout(async () => {
      const { Data: numData } = await getGroupDataApi('detail/person/getPersonNum')
      const numTreeData = handleConfigDetailNum(get().treeData, numData)
      set({ treeData: numTreeData })
    }, 100)
  },
  pointBuried: (props) => {
    try {
      const { moduleId, ...rest } = props
      const {
        moduleId: _moduleId,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        describe,
        ...buryItem
      } = BuryCfgList[get().module].find((res) => props.opActive === res.opActive)
      if (!(_moduleId || moduleId)) return
      pointBuriedNew(_moduleId || moduleId, { ...buryItem, ...rest })
    } catch (e) {
      console.error(e)
    }
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

  setPosition: (position) => set({ position }),

  /**
   * 整个node参数可能都会替换的时候选择此方法
   * @param node
   */
  updateNode: (node) => {
    try {
      if (!node.treeKey) {
        console.error('updateNode: node.treeKey is undefined')
        return
      }

      const keyArr = node.treeKey.split('-')
      if (keyArr.length < 2) {
        console.error(`updateNode: Invalid treeKey format: ${node.treeKey}`)
        return
      }

      const treeData = get().treeData

      // 找到父节点
      const parentKey = `${keyArr[0]}-${keyArr[1]}`
      const parentNode = treeData.find((res) => res.treeKey === parentKey)

      if (!parentNode) {
        console.error(`updateNode: Parent node with treeKey ${parentKey} not found`)
        return
      }

      // 找到目标子节点
      const targetNode = parentNode.children.find((res) => res.treeKey === node.treeKey)

      if (!targetNode) {
        console.error(`updateNode: Target node with treeKey ${node.treeKey} not found`)
        return
      }

      // 创建新的子节点对象，避免直接修改
      const updatedTargetNode = { ...targetNode, ...node }

      // 创建新的父节点对象
      const updatedParentNode = {
        ...parentNode,
        children: parentNode.children.map((child) => (child.treeKey === node.treeKey ? updatedTargetNode : child)),
      }

      // 创建新的 treeData 数组
      const updatedTreeData = treeData.map((node) => (node.treeKey === parentKey ? updatedParentNode : node))

      // 更新状态
      set({ treeData: updatedTreeData })
    } catch (e) {
      console.error('updateNode: Unexpected error:', e)
    }
  },
}))
