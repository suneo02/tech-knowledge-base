import { Tag } from '@wind/wind-ui'
import React, { useMemo } from 'react'
import TextExpandable from '../common/expandable/textExpandable/TextExpandable'
import './index.less'
import InnerHtml from '../InnerHtml'

/**
 * 产品词组件，用于根据不同的类型和筛选条件渲染产品列表。
 *
 * @param {Object} props - 组件的属性对象。
 * @param {Array} props.data - 产品数据数组。
 * @param {string} props.type - 渲染类型，可以是 'filter' 或其他。
 * @param {Array} props.selectedTags - 选中的标签数组。
 * @param {Function} props.onChange - 当标签的选择状态改变时调用的回调函数。
 * @returns {JSX.Element|null} - 根据类型和条件返回相应的JSX元素，或者在没有数据或不符合条件时返回null。
 */
const Products = ({ data, type, selectedTags, onChange: handleChange, maxLines = 1 }) => {
  const content = useMemo(() => {
    if (type === 'filter' && data?.length) {
      return (
        <>
          {data.map((t, index) => {
            let doc_count = t?.doc_count || ''
            return (
              doc_count && (
                <Tag.CheckableTag
                  size="samll"
                  className="selected-tag-item"
                  checked={selectedTags?.find((i) => {
                    if (typeof i === 'object') {
                      return i.key === t.key
                    } else {
                      return i === t.key
                    }
                  })}
                  onChange={(checked) => {
                    if (handleChange) {
                      handleChange(t, checked)
                    }
                  }}
                  key={index}
                  data-uc-id="w3Q8fL-Nwp"
                  data-uc-ct="tag"
                  data-uc-x={index}
                >
                  #{t?.key || ''}
                  {/* <FireO style={{ color: '#832728', fontSize: '16px' }} /> */}({doc_count})
                </Tag.CheckableTag>
              )
            )
          })}
        </>
      )
    }
  }, [JSON.stringify(data), JSON.stringify(selectedTags)])
  if (type === 'filter') {
    return !window.en_access_config && data && data.length && data.some((i) => i.doc_count) ? (
      <div className="selected-tag-box">
        <TextExpandable
          content={content}
          maxLines={1}
          marginBottom="-23px"
          data-uc-id="rIFgMjHsRO"
          data-uc-ct="textexpandable"
        ></TextExpandable>
      </div>
    ) : null
  }
  return !window.en_access_config && data && data.length ? (
    <div className="tag-box" title={data.map((i) => '#' + i).join(' ')}>
      {data.map((t, index) => {
        return (
          <span key={index} className="tag-item">
            #<InnerHtml html={t}></InnerHtml>
          </span>
        )
      })}{' '}
    </div>
  ) : null
}

export default Products
