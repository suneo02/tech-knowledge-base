/**
 * 这个是渲染之后的元素类型，type 区分用来 给 pdf page 渲染添加不同的元素
 */

export type TableSectionsElement = { type: 'heading' | 'table' | 'paragraph'; element: JQuery }

export type TableSectionsElementType = TableSectionsElement['type']

export type TableSectionsElements = TableSectionsElement[]
