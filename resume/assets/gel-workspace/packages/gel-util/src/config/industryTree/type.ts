export interface IndustryTreeNode {
  code: string
  level: number
  name: string
  nameEn?: string
  node?: IndustryTreeNode[]
  oldCode?: string
}
