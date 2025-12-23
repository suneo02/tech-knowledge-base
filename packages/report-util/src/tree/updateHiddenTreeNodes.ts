import { TreeFns } from './type'

/**
 * 更新"raw 隐藏列表"以响应用户在 UI 上对某个节点的折叠/展开操作。
 *

## 2. 需要考虑的情况

1. **`targetId` 不存在于树中**
    
    - 不做任何修改，直接返回原 `hiddenNodes`。
        
2. **隐藏（`show = false`）**
    
    1. 将 `targetId` 加入 `hiddenNodes`。
        
    2. 将它的**所有后代**也加入 `hiddenNodes`。
        
    3. 向上检查祖先：如果某祖先的 **所有** 直接子节点都在 `hiddenNodes` 中，则也把该祖先加入 `hiddenNodes`。
        
    4. （可选扩展）如果你想"折叠整棵树"，对根节点调用一次即可。
        
3. **显示（`show = true`）**
    
    1. 从 `hiddenNodes` 中删除 `targetId`（若存在）。
        
    2. 将它的**所有后代**也从 `hiddenNodes` 中移除。
        
    3. 向上检查祖先：如果某祖先有任一直接子节点 **不** 在 `hiddenNodes` 中，则把该祖先从 `hiddenNodes` 中移除。
        
    4. （可选扩展）展开节点时会自动展开整棵子树。
        
4. **叶子节点操作**
    
    - 作为特殊折叠：没有后代，只有步骤 2.1 & 2.3。
        
    - 作为特殊展开：只需删除自身，并可能拉开祖先。
        
5. **根节点操作**
    
    - 折叠根 ⇒ 整棵树都会隐藏（因为所有后代都被折叠，祖先不存在）。
        
    - 展开根 ⇒ 根和所有后代都会移出 `hiddenNodes`。
        
 * @param root         整棵树的根
 * @param hiddenNodes  当前显式折叠的节点 ID 列表
 * @param targetId     要切换的节点 ID
 * @param show         true=展开（从隐藏中移除），false=折叠（加入隐藏）
 * @param fns          { getId, getChildren } —— 从 T 拿 ID/子节点
 * @returns            新的 hiddenNodes 列表
 */
export function updateHiddenTreeNodes<T>(
  root: T | T[],
  hiddenNodes: string[],
  targetId: string,
  show: boolean,
  fns: TreeFns<T>
): string[] {
  const { getId, getChildren } = fns
  // 1. 快速构造 parentMap & childrenMap
  const parentMap: Record<string, string | null> = {}
  const childrenMap: Record<string, string[]> = {}

  // 构建树结构关系的辅助函数
  function build(n: T, parent: T | null) {
    const id = getId(n)
    parentMap[id] = parent ? getId(parent) : null
    const kids = getChildren(n) ?? []
    childrenMap[id] = kids.map(getId)
    kids.forEach((c) => build(c, n))
  }

  // 处理根节点是数组的情况
  if (Array.isArray(root)) {
    root.forEach((node) => build(node, null))
  } else {
    build(root, null)
  }

  // 2. 检查 targetId 是否存在
  if (!(targetId in parentMap)) {
    const result = new Array(hiddenNodes.length)
    for (let i = 0; i < hiddenNodes.length; i++) {
      result[i] = hiddenNodes[i]
    }
    return result
  }

  // 3. 用数组做中间状态
  let result = new Array(hiddenNodes.length)
  for (let i = 0; i < hiddenNodes.length; i++) {
    result[i] = hiddenNodes[i]
  }

  // 辅助函数：检查数组是否包含某个值
  function arrayIncludes(arr: string[], value: string): boolean {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === value) return true
    }
    return false
  }

  // 辅助函数：从数组中移除某个值
  function arrayRemove(arr: string[], value: string): string[] {
    const newArr = new Array(0)
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] !== value) {
        newArr[newArr.length] = arr[i]
      }
    }
    return newArr
  }

  if (!show) {
    // —— 折叠逻辑 ——
    // a) 隐藏自己
    if (!arrayIncludes(result, targetId)) {
      result[result.length] = targetId
    }
    // b) 隐藏所有后代
    ;(function hideDescendants(id: string) {
      for (const cid of childrenMap[id] || []) {
        if (!arrayIncludes(result, cid)) {
          result[result.length] = cid
          hideDescendants(cid)
        }
      }
    })(targetId)
    // c) 向上检查祖先：若某祖先的所有直接子都隐藏，则隐藏它
    let p = parentMap[targetId]
    while (p) {
      const children = childrenMap[p] || []
      let allKidsHidden = true
      for (let i = 0; i < children.length; i++) {
        if (!arrayIncludes(result, children[i])) {
          allKidsHidden = false
          break
        }
      }
      if (allKidsHidden && !arrayIncludes(result, p)) {
        result[result.length] = p
      }
      p = parentMap[p]
    }
  } else {
    // —— 展示逻辑 ——
    // a) 展示自己
    result = arrayRemove(result, targetId)

    // b) 展示所有后代
    ;(function showDescendants(id: string) {
      for (const cid of childrenMap[id] || []) {
        result = arrayRemove(result, cid)
        showDescendants(cid)
      }
    })(targetId)

    // c) 向上检查祖先：若某祖先有任一直系子未隐藏，则展示它
    let p = parentMap[targetId]
    while (p) {
      const children = childrenMap[p] || []
      let anyKidVisible = false
      for (let i = 0; i < children.length; i++) {
        if (!arrayIncludes(result, children[i])) {
          anyKidVisible = true
          break
        }
      }
      if (anyKidVisible) {
        result = arrayRemove(result, p)
      }
      p = parentMap[p]
    }
  }

  // 4. 返回新的列表
  return result
}
