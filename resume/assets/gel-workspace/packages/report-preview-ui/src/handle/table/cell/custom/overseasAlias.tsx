import { CorpBasicInfo } from 'gel-types'
import { CorpAnotherName } from 'gel-ui'
import type { ReactNode } from 'react'

/**
 * 渲染海外别名
 * @returns ReactNode
 */
export const renderOverseasAlias = (anotherNames: CorpBasicInfo['anotherNames']): ReactNode => {
  return <CorpAnotherName anotherNames={anotherNames} />
}
