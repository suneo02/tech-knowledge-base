import { TreeFns } from './type'

// —— 二、父隐藏 ⇒ 子隐藏（前序） ——
export function propagateHiddenToChildren<T>(nodeOrNodes: T | T[], hiddenNodes: string[], fns: TreeFns<T>): string[] {
  const { getId, getChildren } = fns
  const result: string[] = []

  const dfs = (n: T, parentHidden: boolean) => {
    const id = getId(n)
    // If parent is hidden, child must be hidden. Otherwise check if node is in hiddenNodes
    const hidden = parentHidden || hiddenNodes.indexOf(id) !== -1
    if (hidden) {
      result.push(id)
    }
    const kids = getChildren(n) ?? []
    for (const c of kids) dfs(c, hidden)
  }

  // Handle both single node and array of nodes
  const nodes = Array.isArray(nodeOrNodes) ? nodeOrNodes : [nodeOrNodes]

  // Process each node
  for (const node of nodes) {
    // Start with not hidden at root for each node
    dfs(node, false)
  }

  return result
}
