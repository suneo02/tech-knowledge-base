// —— 一、工具类型 ——
type IdGetter<T> = (node: T) => string
type ChildrenGetter<T> = (node: T) => T[] | undefined

export interface TreeFns<T> {
  /** 从节点上拿到它的唯一 ID */
  getId: IdGetter<T>
  /** 拿到它的子节点数组 */
  getChildren: ChildrenGetter<T>
}
