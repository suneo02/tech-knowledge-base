import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils'
import { TagWithModule, TagsModule } from 'gel-ui'
import React, { FC } from 'react'
import './style/companyLinks.less'

const CompanyLink: FC<{
  name: string
  id?: string
  isBenifciary?: boolean
  isActCtrl?: string
  isChangeName?: boolean
  oldId?: string
  stopPropagation?: boolean
  css?: string
  divCss?: string
}> = (props) => {
  if (!props) {
    console.error('~ company link props is null')
    return
  }
  const { name, id, isBenifciary, isActCtrl, isChangeName, oldId, stopPropagation } = props

  const gotoFun = () => {
    if (oldId) {
      // 用公司oldid字段进行跳转（金融表id）
      return wftCommon.linkCompany('Bu3', '', oldId, '')
    }
    id && wftCommon.linkCompany('Bu3', id)
  }

  const benifciaryStr = isBenifciary ? (
    <TagWithModule module={TagsModule.ULTIMATE_BENEFICIARY} styles={{ margin: 0, marginInlineStart: 6 }}>
      {intl('138180', '最终受益人')}
    </TagWithModule>
  ) : null
  const actCtrlStr = isActCtrl ? (
    <TagWithModule module={TagsModule.ACTUAL_CONTROLLER} styles={{ margin: 0, marginInlineStart: 6 }}>
      {isActCtrl == 'publish' ? intl('13270', '实际控制人') : intl('261456', '疑似实控人')}
    </TagWithModule>
  ) : null
  const changeNameStr = isChangeName ? (
    <TagWithModule module={TagsModule.IS_CHANGE_NAME} styles={{ margin: 0, marginInlineStart: 6 }}>
      {intl('349497', '已更名')}
    </TagWithModule>
  ) : null

  // 无跳转
  if (!id || (id.length && id.length > 15))
    return (
      <div className={props.divCss || ''}>
        <span dangerouslySetInnerHTML={{ __html: name ? name : '--' }}></span>
        {benifciaryStr}
        {actCtrlStr}
        {changeNameStr}
      </div>
    )

  // 有跳转

  return (
    <div className={props.divCss || ''}>
      <a
        className={props.css || ''}
        onClick={(e) => {
          if (stopPropagation) {
            e.stopPropagation()
          }
          gotoFun()
        }}
        dangerouslySetInnerHTML={{ __html: name ? name : '--' }}
        data-uc-id="6XtJ105as"
        data-uc-ct="a"
      ></a>
      {benifciaryStr}
      {actCtrlStr}
      {changeNameStr}
    </div>
  )
}

export default CompanyLink
