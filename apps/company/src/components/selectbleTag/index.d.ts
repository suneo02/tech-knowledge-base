// Products.d.ts

import React from 'react'

// 定义产品数据类型
interface ProductData {
  key: string
  doc_count?: string | number
}

export interface ProductsProps {
  data: ProductData[]
  type?: 'filter' | string
  selectedTags?: ({ key: string } | React.Key)[]
  onChange?: (item: ProductData, checked: boolean) => void
  maxLines?: number
}

/**
 * // TODO perf
 * 此组件待优化 目前只能受控
 */
declare const Products: React.FC<ProductsProps>

export default Products
