/**
 * Represents a single route in the hierarchy.
 */
export interface Route {
  /** The child nodes under this route. */
  childNode: Route[]
  /** The direct ratio value associated with this route. */
  directRatioValue: number
  /** The indirect ratio value associated with this route. */
  indirectRatioValue: number
  /** The level of this node in the hierarchy. */
  level: number
  /** The unique identifier for the node. */
  nodeId: string
  /** The name of the node. */
  nodeName: string
  /** The type of the node (e.g., "1" for a specific type). */
  nodeType: string
  /** The parent node's identifier, if applicable. */
  parentNode: string | null
  /** The path to this node, if applicable. */
  path: string | null
  /** The descriptive type of the node (e.g., "董事长"). */
  typeName: string
}

/**
 * Represents the main structure of a hierarchical data object.
 */
export interface IUltimateBeneficiaryShareRoute {
  /** The level of the node in the hierarchy. */
  level: number
  /** The ratio associated with this node. */
  ratio: number
  /** The array of route objects representing the hierarchy. */
  route: Route[]
}
