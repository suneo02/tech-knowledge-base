import { Links } from '@/components/common/links'
import { LinksModule, parseApiFieldModule } from '@/handle/link'
import { wftCommonType } from '@/utils/WFTCommonWithType'
import { ActCtrlTag, BeneficiaryTag, ChangeNameTag } from 'gel-ui'
import { isNil } from 'lodash'
import React, { FC, useMemo } from 'react'

/**
 * 根据 后端的整个对象 及 id 来得到该id 的类型 从而得到跳转
 * 有兜底方案 如果没有解析出来， 会根据 id 来判断是人物还是公司
 *
 *
 * @param nameKey
 * @param idKey
 * @param row
 * @constructor
 */
export const LinkByRowCompatibleCorpPerson: FC<{
  typeKey?: string
  idKey?: string
  nameKey: string
  row: Record<string, any>
  className?: string
  classNameWithJump?: string
  useUnderline?: boolean
}> = ({ nameKey, idKey, row, typeKey, className, classNameWithJump, useUnderline }) => {
  const idKeyParsed = useMemo(() => {
    try {
      if (idKey) {
        return idKey
      }
      return `${nameKey}Id`
    } catch (e) {
      console.error(e)
      return
    }
  }, [idKey])

  const id = useMemo(() => {
    try {
      return row[idKeyParsed]
    } catch (e) {
      console.error(e)
      return undefined
    }
  }, [row, idKeyParsed])

  const moduleByRow = useMemo(() => {
    return parseApiFieldModule(row, nameKey, typeKey)
  }, [row, nameKey])

  const module = useMemo(() => {
    try {
      let res = moduleByRow

      const typeById = wftCommonType.getIdIfCompanyOrPerson(id)
      // 如果类型被解析为 company, 或者没有被解析， 并且 id长度判断为 人物 id
      if (typeById === 'person' && (moduleByRow === LinksModule.COMPANY || moduleByRow == null)) {
        res = LinksModule.CHARACTER
      } else if (typeById === 'company' && (moduleByRow === LinksModule.CHARACTER || moduleByRow == null)) {
        res = LinksModule.COMPANY
      }
      return res
    } catch (e) {
      console.error(e)
      return undefined
    }
  }, [id, moduleByRow])

  if (isNil(row)) {
    return '--'
  }

  return (
    <Links
      className={className}
      classNameWithJump={classNameWithJump}
      module={module}
      id={id}
      title={row[nameKey]}
      useUnderline={useUnderline}
    />
  )
}

export const CorpOrPersonLinkWithTag: FC<{
  idKey?: string
  nameKey: string
  row: Record<string, any>
  isBeneficiary: string
  isActCtrl: string
  isChangeName: string
  className?: string
}> = ({ nameKey, idKey, row, isBeneficiary, isActCtrl, isChangeName, className }) => {
  const beneficiaryTag = isBeneficiary ? <BeneficiaryTag /> : null
  const actCtrlStr = isActCtrl ? <ActCtrlTag ctrlType={isActCtrl === 'publish' ? 'actual' : 'uncertain'} /> : null
  const changeNameStr = isChangeName ? <ChangeNameTag /> : null

  return (
    <div className={className}>
      <LinkByRowCompatibleCorpPerson idKey={idKey} nameKey={nameKey} row={row} />
      {beneficiaryTag}
      {actCtrlStr}
      {changeNameStr}
    </div>
  )
}
