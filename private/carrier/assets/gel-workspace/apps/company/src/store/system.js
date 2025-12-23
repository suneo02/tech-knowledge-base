/** @format */

import { create } from 'zustand'

export const TreeModuleName = {
  language: 'company',
  Group: 'group',
}

export const useGroupStore = create((set, get) => ({
  basicInfo: {},

  translate: (node) => {
    const keyArr = node.key.split('-')
    const treeData = get().treeData
    if (keyArr.length > 2) {
      const data = treeData
        .find((res) => res.key === `${keyArr[0]}-${keyArr[1]}`)
        .children.find((res) => res.key === node.key)
      Object.assign(data, node)
      set({ treeData })
    }
  },
  translateAll: () => {
    get().treeData.map(res => )
  }
}))
