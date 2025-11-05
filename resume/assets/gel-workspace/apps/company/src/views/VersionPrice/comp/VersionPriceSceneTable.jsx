import { isValidElement } from 'react'
import intl from '../../../utils/intl'
import { VIPFunctionRatings } from '../config/basic'
import React from 'react'
import { HKInfoQueryAggreBtn } from '@/components/company/HKCorp/info/modal/HKInfoQueryAggre'
import { ContactManagerButton } from '@/components/company/ContactManager/ContactManagerButton'
const VersionPriceTableTD = ({ langKey, title, width, align, className, colspan, type, rowspan }) => {
  if (type === 'HKInfoQuery') {
    return (
      <HKInfoQueryTableTD
        langKey={langKey}
        title={title}
        width={width}
        align={align}
        className={className}
        colspan={colspan}
      />
    )
  }

  if (type === 'ContactManager') {
    return (
      <ContactManagerTableTD
        langKey={langKey}
        title={title}
        width={width}
        align={align}
        className={'contact-manager-table-td'}
        colspan={colspan}
      />
    )
  }
  let content = JSON.stringify(title)
  if ((typeof langKey === 'string' || typeof langKey === 'number') && typeof title === 'string') {
    content = intl(langKey, title)
  } else if (isValidElement(title)) {
    content = title
  }
  return (
    <td width={width} align={align} className={className} colSpan={colspan} rowSpan={rowspan ? rowspan : 1}>
      {content}
    </td>
  )
}

const HKInfoQueryTableTD = ({ langKey, title, width, align, className, colspan }) => {
  return (
    <td width={width} align={align} className={className} colSpan={colspan}>
      <HKInfoQueryAggreBtn title={title} />
    </td>
  )
}

const ContactManagerTableTD = ({ langKey, title, width, align, className, colspan }) => {
  return (
    <td width={width} align={align} className={className} colSpan={colspan}>
      <ContactManagerButton title={title} />
    </td>
  )
}

/**
 * 单个场景的 table
 * @param {*} param0
 * @returns
 */
export const VersionPriceSceneTable = ({ sceneContentCfg, sceneTitleCfg, id, className, ifHideVip }) => {
  return (
    <>
      <div className={`tit-price ${className}`} id={id}>
        <span className="after-tit-price">{intl(sceneTitleCfg.langKey, sceneTitleCfg.title)}</span>
      </div>
      <table className="price-table-con">
        <tbody>
          {sceneContentCfg.map((funcCfg, idx) => {
            if (funcCfg.other) {
              // colspan为3
              return (
                <tr className="price-table-other-row" key={idx}>
                  <VersionPriceTableTD langKey={funcCfg.function.langKey} title={funcCfg.function.title} />

                  <VersionPriceTableTD
                    langKey={funcCfg.other.langKey}
                    title={funcCfg.other.title}
                    colspan="3"
                    align="center"
                    type={funcCfg.other?.type}
                  />
                </tr>
              )
            } else {
              return (
                <tr key={idx}>
                  <VersionPriceTableTD langKey={funcCfg.function.langKey} title={funcCfg.function.title} />
                  <VersionPriceTableTD
                    langKey={funcCfg[VIPFunctionRatings.FREE].langKey}
                    title={funcCfg[VIPFunctionRatings.FREE].title}
                    width="240"
                    align="center"
                  />
                  {!ifHideVip && (
                    <VersionPriceTableTD
                      langKey={funcCfg[VIPFunctionRatings.VIP].langKey}
                      title={funcCfg[VIPFunctionRatings.VIP].title}
                      width="240"
                      align="center"
                      className="color-vip"
                    />
                  )}

                  {funcCfg[VIPFunctionRatings.SVIP].hide ? null : (
                    <VersionPriceTableTD
                      langKey={funcCfg[VIPFunctionRatings.SVIP].langKey}
                      title={funcCfg[VIPFunctionRatings.SVIP].title}
                      width="240"
                      align="center"
                      className="color-svip"
                      rowspan={funcCfg[VIPFunctionRatings.SVIP].rowspan}
                    />
                  )}
                </tr>
              )
            }
          })}
        </tbody>
      </table>
    </>
  )
}
