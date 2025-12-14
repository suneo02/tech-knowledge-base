import { handleJumpTerminalCompatibleAndCheckPermission } from '@/handle/link'
import { isDev } from '@/utils/env'
import { GSTabsEnum } from '@/views/GlobalSearch/types'
import { getCompanyStateColor } from '@/views/SearchFunc/state'
import { Tag } from '@wind/wind-ui'
import { CorpTag } from 'gel-api/*'
import { CorpTagInSearch } from 'gel-ui'
import { getCorpTagClickHandler } from 'gel-util/biz'
import React, { FC, useCallback } from 'react'

type SearchResultTagProps = {
  tags: CorpTag[]
  type: GSTabsEnum
  statusAfter?: string
}

export const SearchResultTag: FC<SearchResultTagProps> = (props) => {
  const getTagClickHandler = useCallback((corpTag: CorpTag) => {
    return getCorpTagClickHandler(corpTag, {
      onJumpTerminalCompatible: handleJumpTerminalCompatibleAndCheckPermission,
      isDev: isDev,
    })
  }, [])
  return (
    <div className="global_state">
      {props?.statusAfter ? (
        <Tag
          type="secondary"
          style={{
            lineHeight: '20px',
            height: '20px',
            fontSize: '13px',
            padding: '0 8px',
          }}
          data-uc-id="RU4KB7eXXa"
          data-uc-ct="tag"
          color={getCompanyStateColor(props.statusAfter)}
        >
          {props.statusAfter}
        </Tag>
      ) : null}
      {Array.isArray(props?.tags) && props?.tags?.length ? (
        props.tags.map((item) => (
          <CorpTagInSearch
            style={{ marginBlockEnd: 8 }}
            smallMicroEnterpriseWrapperStyle={{ marginBlockEnd: 8, verticalAlign: 'unset', marginRight: 8 }}
            corpTag={item}
            tagNameOriginal={item.name}
            onClick={getTagClickHandler(item)}
          />
        ))
      ) : (
        <></>
      )}
    </div>
  )
}
