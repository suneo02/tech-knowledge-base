import { ComponentTypeEnum, ComponentTypeNumEnum } from '../../../../../types/emun'
import ApiContainer from '../../../../container/ApiContainer'
import { TreeConfigProps } from '../../../../container/type'
import React from 'react'

const ApiContainerChecker = (props: TreeConfigProps) => {
  const { children, apiParams, autoChangeTablePagination, ...rest } = props
  let _initialParams: Record<string, unknown> = { ...props?.initialParams, ...props?.filter }

  /** 针对table格式特殊处理 */
  if (props.type === ComponentTypeEnum.TABLE || props.type === (ComponentTypeNumEnum.TABLE as any)) {
    _initialParams = { pageNo: 0, pageSize: 10, ..._initialParams }
  }
  if (typeof children !== 'function') return null
  const enableDisplay = !rest.displayKey || _initialParams?.[rest.displayKey]
  if (!enableDisplay) return null

  if (props?.api) {
    return (
      <ApiContainer
        title={props.title}
        api={props.api}
        initialParams={_initialParams}
        apiParams={apiParams}
        autoChangeTablePagination={autoChangeTablePagination}
      >
        {({ response, params, updateParams }) => {
          console.log('🚀 ~ props:', props)
          let filterList: {}[] = []
          if ((response?.Data as any)?.aggregations) {
            Object.entries((response?.Data as any).aggregations).forEach(([key, value]) => {
              if (Array.isArray(value) && value.length) {
                const defaultItem = { label: '全部', value: '', default: true }
                const _data = {
                  key: key.replace('aggs_', ''),
                  options: [
                    defaultItem,
                    ...value.map((res) => ({
                      ...res,
                      label: `${res.key}${res.doc_count ? `(${res.doc_count})` : ''}`,
                      value: res.key,
                    })),
                  ],
                }
                filterList.push(_data)
              }
            })
          }
          const total = response?.Page?.Records
          return children({ ...rest, response, params, updateParams, filterList, total })
        }}
      </ApiContainer>
    )
  } else {
    return children(rest)
  }
}

export default ApiContainerChecker
