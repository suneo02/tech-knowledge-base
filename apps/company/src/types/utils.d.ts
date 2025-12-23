/**
 * 美化类型显示的工具类型
 * 用于展开交叉类型，使类型提示更清晰
 */
declare type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

type ValidateKey<T, U = React.Key> = {
  [K in keyof T]-?: T[K] extends U ? K : never
}[keyof T] extends infer R
  ? R extends U
    ? R
    : never
  : never

type TreeNodeWithKey<T, K = React.Key> = T & { key: K } & {
  children?: TreeNodeWithKey<T, K>[]
}
