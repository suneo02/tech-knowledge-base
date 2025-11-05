/**
 * DataIndex 方法集
 * Created by Calvin
 *
 * @format
 */

import { wftCommon } from '../../utils/utils'

export const useDataIndex = () => {
  /**
   * DataIndex 方法集
   * 未来所有关于dataIndex的放这里！！！
   * 不过未来这块需要优化下，因为只涉及展示的字段，没有什么太多业务
   */
  const handleDataIndex = (col) => {
    if (!col.dataIndex) return
    if (col.dataIndex === 'NO.') {
      handleNo(col)
    } else if (col.dataIndex.includes('+')) {
      handleRichTxt(col)
    } else if (col.dataIndex.includes('|')) {
      handleSplit(col)
    } else {
      col.render = (txt) => txt || col.noDataIndex || '--'
    }
  }

  /** 序号处理 根据优化前的代码进行优化，未来需要迭代 */
  const handleNo = (col) => {
    col.width = '40px'
    col.align = 'center'
    col.render = (_, __, index, s) => {
      // console.log(col, __, index, s)
      return index + 1
    }
  }

  /** 数据是否需要格式化，ep: 百分号，科学计数法等... */
  const handleSplit = (col) => {
    const splitColumns = col.dataIndex.split('|')
    // console.log('handleSplit', handleSplit)
    col.render = (_, row) => (row[splitColumns[0]] && wftCommon[splitColumns[1]] ? wftCommon[splitColumns[1]](row[splitColumns[0]]) : col.noDataIndex || '--')
  }

  /** 是否是多参数数据 */
  const handleRichTxt = (col) => {
    const params = col.dataIndex.split('+')
    col.render = (_, row) => {
      const txt = params.map((par) => {
        if (par.includes('|')) {
          const splitColumns = par.split('|')
          return row[splitColumns[0]] ? wftCommon[splitColumns[1]](row[splitColumns[0]]) : col.noDataIndex || '--'
        }
        return row[par] || col.noDataIndex || '--'
      })
      return txt.includes('--') ? '--' : txt
    }
  }
  return {
    handleDataIndex,
  }
}
