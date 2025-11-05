import React, { useState } from 'react'
import useComponent from '../../../../../utils/hooks/component/useComponent'
import { useOnViewportEnter } from '../../../../../utils/hooks/useOnViewportEnter'
import Header from '../../../../Header'
import ApiContainerChecker from '../ApiContainerChecker'
import ComponentSwitcher from '../ComponentSwitcher'
import FilterContainerChecker from '../FilterContainerChecker'

export const renderComponent = (node: any) => {
  let component = node
  // 预检
  if (!node.type) {
    if (node.componentId) {
      const getComponentById = useComponent()
      component = getComponentById()
    }
  }
  if (component?.children) component.list = component.children
  Object.freeze(component)

  const [show, setShow] = useState(node.isTab)
  const elementRef = useOnViewportEnter(() => {
    // 触发加载逻辑
    setShow(true)
  })

  return (
    <div ref={elementRef} style={!show ? { minHeight: 100 } : {}}>
      {show ? (
        <FilterContainerChecker {...component}>
          {(props: any) => {
            return (
              <ApiContainerChecker {...props}>
                {({ updateParams, ...res }: any) => {
                  const { title, ...rest } = res
                  return (
                    <>
                      <Header
                        {...res}
                        onSearch={(v: any) => {
                          if (rest?.updateFilter) rest.updateFilter(v)
                          if (updateParams) updateParams(v) // 接口
                        }}
                      />
                      <ComponentSwitcher {...rest} updateParams={updateParams} updateFilter={props?.updateFilter} />
                    </>
                  )
                }}
              </ApiContainerChecker>
            )
          }}
        </FilterContainerChecker>
      ) : null}
    </div>
  )
}
