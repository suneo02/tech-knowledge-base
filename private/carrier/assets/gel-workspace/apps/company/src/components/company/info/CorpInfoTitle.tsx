import { CorpOrganizationType } from '@/api/corp/info/common.ts'
import { InfoCircleButton } from '@/components/icons/InfoCircle'
import { CorpArea } from '@/handle/corp/corpArea'
import intl from '@/utils/intl'
import { Tooltip } from '@wind/wind-ui'

import React, { FC, useMemo } from 'react'

const baseInfoLetter = intl('257642', '基本信息')
const businessInfoLetter = intl('257705', '工商信息')

export const CorpInfoTitle: FC<{ corpArea: CorpArea; orgType: CorpOrganizationType }> = ({ corpArea, orgType }) => {
  const tooltipTitle = useMemo<string>(() => {
    let title = null
    if (orgType === 'GOV') {
      title = intl(
        410933,
        '数据来源：国家企业信用信息公示系统，各级政府网站等公开数据源，部分信息根据大数据衍生计算生成'
      )
    } else if (['CO', 'PE', 'FPC', 'SPE', 'OE', 'FCP'].includes(orgType)) {
      title = intl(411313, '数据来源：国家企业信用信息公示系统，部分信息根据大数据衍生计算生成')
    } else if (orgType === 'SOE') {
      title = intl(
        410934,
        '数据来源：国家企业信用信息公示系统、机关赋码和事业单位登记管理平台等公开数据源，部分信息根据大数据衍生计算生成'
      )
    } else if (orgType === 'NGO') {
      title = intl(410956, '数据来源：全国社会组织信用信息公示平台等公开数据源，部分信息根据大数据衍生计算生成')
    } else if (corpArea === 'canada') {
      title = intl(0, '数据来源：加拿大政府网站')
    }
    return title
  }, [corpArea, orgType])

  const infoLetter = useMemo<string>(() => {
    try {
      if (corpArea || ['GOV', 'SOE'].includes(orgType)) {
        return baseInfoLetter
      } else if (orgType === 'NGO') {
        return intl(410955, '登记信息')
      }
      return businessInfoLetter
    } catch (e) {
      console.error(e)
      return businessInfoLetter
    }
  }, [corpArea, orgType])

  return (
    <span>
      {infoLetter}
      {tooltipTitle ? (
        <Tooltip title={tooltipTitle}>
          <InfoCircleButton />
        </Tooltip>
      ) : null}
    </span>
  )
}
