import { CorpBasicInfo } from 'gel-types'
import { intl } from 'gel-util/intl'
import React, { FC } from 'react'
import { CompanyCardTag } from './CompanyCardTag'

export const OverseaTagComp: FC<{
  corpBasicInfo: CorpBasicInfo
}> = ({ corpBasicInfo }) => {
  const corptypeid = corpBasicInfo.corp_type_id || '--'
  const ishk = corptypeid && String(corptypeid) == '298060000'
  const istw = corpBasicInfo.areaCode == '030407'

  if (ishk) {
    return (
      <CompanyCardTag
        key={'oversea-tag-hk'}
        size="large"
        content={intl('261972', '中国香港企业')}
        data-uc-id="m0_aWfzsXk7"
        data-uc-ct="companycardtag"
        data-uc-x={'oversea-tag-hk'}
      />
    )
  }
  if (istw) {
    return (
      <CompanyCardTag
        key={'oversea-tag-tw'}
        size="large"
        content={intl('224478', '中国台湾企业')}
        data-uc-id="dBSD5ngo1SF"
        data-uc-ct="companycardtag"
        data-uc-x={'oversea-tag-tw'}
      />
    )
  }
  return null
}
