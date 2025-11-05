import { useSearchOptionSplit } from '@/components/common/card/header/handle/searchOption.ts'
import ExtraLinks from '@/components/common/extraLinks/ExtraLinks'
import { CustomSelectByOptions } from '@/components/common/search/comp/customSelect.tsx'
import Search from '@/components/common/search/Search'
import { TOnSearchChange } from '@/components/common/search/type.ts'
import UpdateTime from '@/components/common/updateTime/UpdateTime'
import Vip from '@/components/common/vip/Vip'
import { InfoCircleButton } from '@/components/icons/InfoCircle'
import { ITableAggregationWithOption } from '@/handle/table/aggregation/type'
import { useGroupStore } from '@/store/group'
import { ICfgDetailNodeJson } from '@/types/configDetail/module.ts'
import intl from '@/utils/intl'
import { Tooltip } from '@wind/wind-ui'
import React, { FC, useEffect, useState } from 'react'
import { ExportDoc } from '../../exportDoc'
import './header.less'

/**
 * 集成头部
 * @param {Boolean} hiddenTxt
 * @param {Boolean} hiddenOptions
 * @returns
 */
const CardHeader: FC<
  Partial<ICfgDetailNodeJson> & {
    searchOptions?: ITableAggregationWithOption[] | ITableAggregationWithOption
    onSearchChange?: TOnSearchChange
    hiddenTxt?: any
    hideTableHeader?: any
    hiddenOptions?: any
    hot?: any

    [key: string]: any
  }
> = ({ onSearchChange, hiddenTxt, hideTableHeader, hiddenOptions, hot, ...node }) => {
  const basicInfo = useGroupStore((state) => state.basicInfo)
  const [savedNum, setSavedNum] = useState(null)
  useEffect(() => {
    if (savedNum == null || savedNum === 0) {
      setSavedNum(node.num)
    }
  }, [node.num])
  const TitleNum = () => (savedNum != null ? <span className="title-num">{`(${savedNum})`}</span> : null)
  const Title = () => (
    <span className={node.treeKey}>{node.titleId ? intl(node.titleId, node.title) : node.title || ''}</span>
  )
  const TitleRemark = () =>
    node.titleRemarkId || node.titleRemark ? (
      <span className="title-remark">{intl(node.titleRemarkId, node.titleRemark)}</span>
    ) : null

  const { nonCustomOptions, customOptionsInHeader, customOptionsInSearch } =
    useSearchOptionSplit<ITableAggregationWithOption>(node.searchOptions)

  if (hideTableHeader) {
    return null
  }
  return (
    <div className="card-header-title">
      {hiddenTxt ? (
        <div></div>
      ) : (
        <div className="title">
          <Title />
          {node?.tooltip ? (
            /** 这里因为是本地的，无需做安全处理 */
            <Tooltip title={<div dangerouslySetInnerHTML={{ __html: node?.tooltip.replace(/\n/g, '<br>') }}></div>}>
              <InfoCircleButton />
            </Tooltip>
          ) : null}
          {hot ? <div className="svg" /> : null}
          {node.isVip ? <Vip /> : null}
          <TitleNum />
          <TitleRemark />
        </div>
      )}
      {hiddenOptions ? null : (
        <div className="card-header-options">
          {node.updateTimeOptions ? <UpdateTime UpdateTime={node.corp_update_time} /> : null}
          {node.extraLinks ? <ExtraLinks {...node} {...basicInfo} /> : null}

          <CustomSelectByOptions options={customOptionsInHeader} onSearchChange={onSearchChange} />
          <div className={'search-filters-container'}>
            {nonCustomOptions ? (
              <Search
                {...node}
                searchOptions={nonCustomOptions}
                customSearchOptions={customOptionsInSearch}
                onSearchChange={onSearchChange}
              />
            ) : null}
            {node.downDocType || node.downDocTypeApi ? <ExportDoc {...node} /> : null}
          </div>
        </div>
      )}
    </div>
  )
}

export default CardHeader
