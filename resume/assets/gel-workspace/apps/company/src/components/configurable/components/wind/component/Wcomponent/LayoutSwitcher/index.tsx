import { Flex, Tabs, Typography } from 'antd'
import { LayoutStateEnum } from '../../../../../types/emun'
import Header from '../../../../Header'
import { renderChildren } from '../render/renderChildren'
import { renderComponent } from '../render/renderComponent'
import './index.scss'
import React from 'react'
const LayoutHorizontal = (props: any) => {
  return (
    <Flex gap={12}>
      {/* <IntegrationChildren {...props} />
       */}
      {renderChildren({ ...props })}
    </Flex>
  )
}

const LayoutVertical = (props: any) => {
  // return <IntegrationChildren {...props} />
  return renderChildren({ ...props })
}

/**
 * todo 根据接口获取对应的tabs是否展示
 * @param props
 * @returns
 */
const LayoutTabs = (props: any) => {
  console.log('🚀 ~ LayoutTabs ~ props:', props)
  const items = props?.list?.map((res: any, index: number) => {
    const uniqueKey = res.id || res.key || `tab-${index}`
    return {
      key: uniqueKey,
      label: (res.title || res.name) + (res?.num ? `(${res.num})` : ''),
      children: <div key={uniqueKey}>{renderComponent({ ...res, isTab: true })}</div>,
    }
  })
  return (
    <Tabs
      className="configurable-layout-tabs"
      items={items}
      animated={{ inkBar: true, tabPane: true }}
      tabBarExtraContent={{
        left: (
          <Typography.Title level={5} style={{ marginInlineEnd: 32, marginBlock: 0 }}>
            {props.title}
          </Typography.Title>
        ),
      }}
    />
  )
}

/**
 * 布局容器
 * todo 添加类型定义
 * @param props
 * @returns
 */
const LayoutSwitcher = (props: any & { layout: LayoutStateEnum; parentId?: React.Key }) => {
  const { layout, title, list, filter, updateFilter, integrationParent } = props
  let childrenNode: React.ReactNode
  switch (layout) {
    case LayoutStateEnum.HORIZONTAL:
      childrenNode = <LayoutHorizontal {...{ title, list, filter, updateFilter, integrationParent }} />
      break
    case LayoutStateEnum.VERTICAL:
      childrenNode = <LayoutVertical {...{ title, list, filter, updateFilter, integrationParent }} />
      break
    case LayoutStateEnum.TABS:
      childrenNode = <LayoutTabs {...{ title, list, filter, updateFilter, integrationParent }} />
      break
    default:
      childrenNode = <LayoutVertical {...{ title, list, filter, updateFilter, integrationParent }} />
      break
  }
  return layout === LayoutStateEnum.TABS ? (
    childrenNode
  ) : (
    <div className="layout-container">
      <Header
        {...props}
        onSearch={(v) => {
          if (props?.updateFilter) props.updateFilter(v)
          if (props?.updateParams) props.updateParams(v) // 接口
        }}
      />
      {childrenNode}
    </div>
  )
}

export default LayoutSwitcher
