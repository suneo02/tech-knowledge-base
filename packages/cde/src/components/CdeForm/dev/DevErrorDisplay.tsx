import React from 'react'

type DevErrorDisplayProps = {
  type: 'unregistered-component' | 'missing-options-tree'
  itemType?: string
  originalItemType?: string
  itemName?: string
}

const ERROR_STYLE: React.CSSProperties = {
  color: 'red',
  border: '1px dashed red',
  padding: 8,
  margin: '8px 0',
}

// 开发环境提示，无需多语言
const DevErrorDisplay: React.FC<DevErrorDisplayProps> = ({ type, itemType, originalItemType, itemName }) => {
  return (
    <div style={ERROR_STYLE}>
      <p>
        <strong>[FilterForm Dev Error]</strong>
      </p>
      {type === 'unregistered-component' && (
        <p>
          组件类型 '{itemType}' (来自原始类型: '{originalItemType}') 未在 registry.ts 中注册。
        </p>
      )}
      {type === 'missing-options-tree' && (
        <p>
          组件 '{itemName}' (itemType: {itemType}) 需要一个有效的 'options'
          树，但是在预处理步骤(preprocessFilterItem)中未能生成。
        </p>
      )}
    </div>
  )
}

export default DevErrorDisplay
