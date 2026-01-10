import { ConfigDetailCorpTechScore } from '@/components/layout/container/Integration/customModule.tsx'
import { Item } from '@/components/layout/renderItem.tsx'
import { ICfgDetailNodeCommonJson } from '@/types/configDetail/common.ts'
import { ICfgDetailCompJson, ICfgDetailSubMenu, IConfigDetailNodesJSON } from '@/types/configDetail/module.ts'
import { createIntersectionObserver } from 'gel-util/common'
import React, { FC, useEffect, useRef, useState } from 'react'
import CardHeader from '../../../common/card/header/Header'
import ApiContainer from '../ApiContainer'
import TabsContainer from '../TabsContainer'
import './index.less'

/** 布局 */
const LayoutHorizontal: FC<{
  children: any[]
  data?: any
}> = ({ children, data }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {children.map((res, index) => (
        <div style={res.width ? { width: res.width } : { flex: 1 }} key={index}>
          <Component {...res} data={data} />
        </div>
      ))}
    </div>
  )
}
const LayoutVertical: FC<{
  children: any[]
  data?: any
}> = ({ children, data }) => {
  return (
    <div style={{ width: '100%' }}>
      {children.map((res, index) => {
        return (
          <div key={index} style={index ? { marginBlockStart: 12 } : {}}>
            <Component {...res} data={data} />
          </div>
        )
      })}
    </div>
  )
}
export const Layout: FC<
  {
    data?: any
  } & IConfigDetailNodesJSON
> = (props) => {
  // @ts-expect-error ttt
  const _children = props.children?.filter((res) => !res.disabled)
  const render = () => {
    switch (props.layout) {
      case 'horizontal': // eslint-disable-next-line react/no-children-prop
        return <LayoutHorizontal children={_children} data={props.data} />
      case 'tabs':
        return (
          <TabsContainer tabs={_children as ICfgDetailCompJson[]}>
            {(res) => <Component {...res} data={props.data} hiddenTitle={true} />}
          </TabsContainer>
        )
      default: // eslint-disable-next-line react/no-children-prop
        return <LayoutVertical children={_children} data={props.data} />
    }
  }
  return <div className="layout-container">{render()}</div>
}

export const Component: FC<ICfgDetailCompJson & Pick<ICfgDetailSubMenu, 'treeKey'>> = ({ treeKey, ...props }) => {
  const [loading, setLoading] = useState(true)
  const { key, customId } = props

  const componentRef = useRef(null)
  const inCallback = () => {
    setLoading(false)
    if (componentRef.current) observable.unobserve(componentRef.current)
  }
  const { observable } = createIntersectionObserver(inCallback, undefined, {
    root: null,
    rootMargin: '0px',
    threshold: 0.9,
  })

  useEffect(() => {
    if (componentRef.current) observable.observe(componentRef.current)
    return () => {
      if (componentRef.current) observable.unobserve(componentRef.current)
    }
  }, [])
  const _list = 'children' in props ? props?.children?.filter((res) => !res.disabled) : null
  const renderLayout = () => {
    return (
      <FilterContainer {...props}>
        {(params) => {
          const api = props.api
          if (api == null) {
            return <Layout {...props} {...params} />
          } else {
            return (
              <ApiContainer {...props} api={api} params={params}>
                {(data) => {
                  return <Layout {...props} data={data} {...params} />
                }}
              </ApiContainer>
            )
          }
        }}
      </FilterContainer>
    )
  }

  if (customId) {
    switch (customId) {
      case 'corpTechScore':
        return <ConfigDetailCorpTechScore {...props} />
    }
  }
  return (
    <div ref={componentRef} key={`component-${key}`} style={{ width: '100%' }}>
      {/*目前 treekey 只会传递给无 children的情况下，否则会出现 children有同一个 key的情况*/}
      {!loading ? <div>{_list ? renderLayout() : <Item {...props} data={props.data} treeKey={treeKey} />}</div> : null}
    </div>
  )
}

export const Menu: FC<{
  component?: ICfgDetailCompJson
  children?: any[]
  treeKey: ICfgDetailNodeCommonJson['treeKey']
}> = ({ children, component, treeKey }) => {
  return (
    <div>
      {children && children.map((res, index) => <Component key={index} {...res} />)}
      {component && <Component {...component} treeKey={treeKey} />}
    </div>
  )
}

/** 针对组件集的筛选 */
export const FilterContainer: FC<{
  params?: any
  children?: any
}> = (props) => {
  const [params, setParams] = useState(props.params)
  useEffect(() => {
    setParams(props.params)
  }, [props.params])
  return (
    <>
      {<CardHeader {...props} onSearchChange={setParams} data-uc-id="SxsteGJp8" data-uc-ct="cardheader" />}
      {props?.children(params)}
    </>
  )
}
