/** @format */

import { intlNoIndex } from '../../../utils/intl'
import { wftCommon } from '../../../utils/utils'
import { CHART_HASH } from '@/components/company/intro/charts'

/** 先放这里，未来需要换地方 */
export const notVipTips = (str) => {
  return `购买企业套餐，即可查看该企业${str}信息`
}

/**
 * router to web link (compatible jquery page)
 * @param {url: string; txt: string, openFunc} options
 * @returns react component jsx Element
 */
export const WebLinks = (options) => {
  console.log('WebLink', options)
  const { url, txt, openFunc } = options
  return url ? (
    <a
      style={options.style}
      onClick={() => {
        openFunc ? openFunc(url) : wftCommon.jumpJqueryPage(url)
      }}
    >
      {txt}
    </a>
  ) : (
    <span>{txt}</span>
  )
}

/**
 * router to company links (compatible jquery page)
 * @param { name, id, isBenifciary, isActCtrl, isChangeName, oldId, companyCode, benifciaryClickHandler} props
 * @returns react component jsx Element
 */
export const CompanyLinks = (props) => {
  const {
    name,
    id,
    benifciary,
    actContrl,
    nameChanged,
    oldId,
    // isCtrlCorp,
    companyCode,
    benifciaryClickHandler, // 最终受益人跳转
  } = props

  const gotoFun = () => {
    if (oldId)
      // 用公司oldid字段进行跳转（金融表id）
      return wftCommon.linkCompany('Bu3', '', oldId, '')

    id && wftCommon.linkCompany('Bu3', id)
  }

  const benifciaryStr = benifciary && (
    <span
      className="benifciary"
      onClick={() => {
        // 最终受益人跳转
        if (benifciaryClickHandler) benifciaryClickHandler(['showFinalBeneficiary'], { selected: true })
      }}
    >
      {intlNoIndex('138180')}
    </span>
  )

  const actCtrlStr = actContrl ? (
    <span
      className="benifciary"
      id="actCtrl"
      onClick={() =>
        wftCommon.jumpJqueryPage(
          `index.html?isSeparate=1&nosearch=1&companycode=${companyCode}&activeKey=chart_yskzr#/${CHART_HASH}`
        )
      }
    >
      {intlNoIndex('13270')}
    </span>
  ) : null

  const changeNameStr = nameChanged ? <span className="benifciary">{intlNoIndex('349497')}</span> : null

  //   const ctrlCorpStr = isCtrlCorp ? (
  //     <div>
  //       <span className='corp-ctrl-tag'>控股企业</span>
  //     </div>
  //   ) : null;

  // 无跳转
  if (!id || (id.length && id.length > 15))
    return (
      <span className={props.divCss || ''}>
        <span dangerouslySetInnerHTML={{ __html: name }}></span>
        {benifciaryStr} {actCtrlStr} {changeNameStr}
        {'\u00A0'}
      </span>
    )

  // 有跳转
  return (
    <span className={props.divCss || ''}>
      <a className={props.css || ''} onClick={gotoFun} dangerouslySetInnerHTML={{ __html: name }}></a>
      {benifciaryStr}
      {actCtrlStr}
      {changeNameStr}
      {'\u00A0'}
    </span>
  )
}
