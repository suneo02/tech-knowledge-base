/**
 * Represents a generic node in a nested structure.
 */
interface NestedNode {
  // Allow any other properties, including the children array
  [key: string]: any
}

/**
 * Recursive helper to truncate nodes beyond a certain depth.
 * Modifies the nodes in place.
 * @param nodes Current nodes being processed.
 * @param maxDepth Max depth to keep.
 * @param currentDepth Current depth of traversal.
 * @param childrenKey The key used to access the children array within a node.
 */
const recursiveTruncateHelper = (
  nodes: NestedNode[] | null | undefined,
  maxDepth: number,
  currentDepth: number,
  childrenKey: string
): void => {
  if (!nodes) {
    return
  }

  nodes.forEach((item) => {
    if (currentDepth === maxDepth) {
      // At the max allowed depth, nullify children
      item[childrenKey] = null
    } else if (currentDepth < maxDepth) {
      // Below max depth, recurse into children
      // Ensure the children property exists and is an array before recursing
      const children = item[childrenKey]
      if (Array.isArray(children)) {
        recursiveTruncateHelper(children, maxDepth, currentDepth + 1, childrenKey)
      } else {
        // If children are not an array (or don't exist), treat as truncated
        item[childrenKey] = null
      }
    }
  })
}

/**
 * @function truncateNestedOptionsMutating
 * @description Truncates a nested node structure (like cascader options) **in place**,
 * keeping only nodes up to a specified maximum depth.
 *
 * @example
 * // Using default childrenKey ('node'): keep levels 1, 2, 3
 * truncateNestedOptionsMutating(myOptions, 3);
 * // Using custom childrenKey ('items'): keep levels 1, 2
 * truncateNestedOptionsMutating(myOptionsWithItems, 2, 'items');
 *
 * @param {NestedNode[]} options - The initial array of root nodes to modify.
 * @param {number} maxDepth - The maximum depth of nodes to keep (depth 1 is the root level). Must be >= 1.
 * @param {string} [childrenKey='node'] - The property name that holds the children array.
 */
export const truncateNestedOptionsMutating = (
  options: NestedNode[],
  maxDepth: number,
  childrenKey: string = 'node'
): void => {
  if (maxDepth < 1) {
    console.warn('truncateNestedOptionsMutating: maxDepth must be >= 1. No changes made.')
    return
  }
  if (!Array.isArray(options)) {
    console.warn("truncateNestedOptionsMutating: input 'options' must be an array. No changes made.")
    return
  }
  // Start recursion: initial nodes are at depth 1.
  recursiveTruncateHelper(options, maxDepth, 1, childrenKey)
}
