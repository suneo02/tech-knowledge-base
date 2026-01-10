import { pointBuriedNew } from '@/api/configApi'
import { commonBuryList } from '@/api/pointBuried/config'
import { MyIcon } from '@/components/Icon'
import { wftCommon } from '@/utils/utils'
import { AddStarO, FileTextO, FingerO, StarF, UndoO } from '@wind/icons'
import { Button, Dropdown, Menu, Tooltip, message } from '@wind/wind-ui'
import copy from 'copy-to-clipboard'
import { CorpCardInfo } from 'gel-types'
import { ProvidedByAI } from 'gel-ui'
import { intl, isEn } from 'gel-util/intl'
import { getCorpNameOriginalByBaseAndCardInfo, getCorpNameTransByCardInfo } from 'gel-util/misc'
import React, { FC } from 'react'
import { CorpBasicInfoFront } from '../../info/handle'
import { CHART_HASH } from '../charts'

const applyStateTxt = (headerInfo: Partial<CorpCardInfo>) => {
  try {
    const { state } = headerInfo

    let stateClass = ''
    let stateTxt = state
    if (state) {
      switch (stateTxt) {
        case '撤销':
          stateTxt = intl('2690', '撤销')
          break
        case '吊销':
          stateTxt = intl('271249', '吊销')
          break
        case '迁出':
          stateTxt = intl('134788', '迁出')
          break
        case '停业':
          stateTxt = intl('134791', '停业')
          break
        case '吊销,未注销':
          stateTxt = intl('134789', '吊销,未注销')
          break
        case '吊销,已注销':
          stateTxt = intl('134790', '吊销,已注销')
          break
        case '注销':
          stateTxt = intl('36489', '注销')
          break
        case '责令关闭':
          stateTxt = '责令关闭'
          break
        case '非正常户':
        case '已告解散':
        case '解散':
        case '廢止':
        case '已废止':
        case '歇業':
        case '破產':
        case '破產程序終結(終止)':
        case '合併解散':
        case '撤銷':
        case '已终止':
        case '解散已清算完結':
        case '该单位已注销':
        case '核准設立，但已命令解散':
          stateTxt = intl('257686', '非正常户')
          break
        case '成立':
        case '存续':
        case '在业':
        case '正常':
          stateTxt = intl('240282', '存续')
          stateClass = 'state-normal'
          break
        case '其他':
          stateTxt = intl('23435', '其他')
          break
        default:
          stateClass = 'state-normal'
          break
      }
      stateClass = stateClass || 'state-error'
    }
    return { stateClass, stateTxt }
  } catch (error) {
    return { stateClass: '', stateTxt: '' }
  }
}

export const CorpInfoMsg: FC<{
  baseInfo: Partial<CorpBasicInfoFront>
  headerInfo: Partial<CorpCardInfo>
  originalName: CorpCardInfo['former_name']
  isObjection: boolean
  isAIRight: boolean
  companycode: string
  companyname: string
  collectState: boolean
  canBack: boolean
  onClickReport: () => void
  onClickCollect: () => void
  onClickBack: () => void
}> = ({
  baseInfo,
  headerInfo,
  originalName,
  isObjection,
  isAIRight,
  collectState,
  companycode,
  companyname,
  canBack,
  onClickReport,
  onClickCollect,
  onClickBack,
}) => {
  const { state: corpState } = headerInfo ?? {}
  const { stateClass, stateTxt } = applyStateTxt(headerInfo)
  return (
    <>
      <div className="corpInfoTitle">
        <Tooltip placement="topLeft" title="点击复制企业名称">
          <span
            className="corpTitle"
            onClick={() => {
              copy(getCorpNameOriginalByBaseAndCardInfo(baseInfo, headerInfo))
              message.success('复制成功')
            }}
            data-uc-id="BkqqCVd6A2-"
            data-uc-ct="span"
          >
            {getCorpNameOriginalByBaseAndCardInfo(baseInfo, headerInfo)}
          </span>
        </Tooltip>
        {corpState ? <span className={stateClass}> {stateTxt} </span> : ''}

        {originalName.length > 0 && (
          <Dropdown
            overlay={
              // @ts-expect-error ttt
              <Menu className="originNameList" data-uc-id="vyntgM5heC" data-uc-ct="menu">
                {originalName.map((ele, index) => {
                  const use_from = ele.useFrom ? ele.useFrom : intl('448306', '日期不明')
                  const use_to = ele.useTo ? ele.useTo : intl('448306', '日期不明')
                  let time = use_from + (isEn() ? ' ~ ' : ' 至 ') + use_to
                  if (!ele.useFrom && !ele.useTo) {
                    time = intl('448306', '日期不明')
                  }
                  return (
                    <Menu.Item
                      key={index.toString()}
                      data-uc-id="OMK99EGbi"
                      data-uc-ct="menu"
                      data-uc-x={index.toString()}
                    >
                      {' '}
                      <div className="used-name-title"> {ele.formerName} </div>
                      <div className="used-name-time"> {time} </div>{' '}
                    </Menu.Item>
                  )
                })}
              </Menu>
            }
            data-uc-id="hJWYkLhFn4"
            data-uc-ct="dropdown"
          >
            <span className="state-normal originName">
              {`${intl(451194, '曾用名')}${originalName.length > 0 ? '(' + originalName.length + ')' : ''}`}
              <MyIcon className="arrowDown" name={'Arrow_Down@1x'} />
              <MyIcon className="arrowUp" name={'Arrow_Up_999@1x'} />
            </span>
          </Dropdown>
        )}
        {isObjection ? (
          <Tooltip placement="topLeft" title={isObjection}>
            <span className=" risk-tag-nojump">{intl('366153', '异议处理')}</span>
          </Tooltip>
        ) : null}
        {isAIRight ? null : (
          <div className="company-operation">
            <Button
              onClick={() => {
                const { moduleId, opActive, describe } = commonBuryList.find((res) => res.moduleId === 922602100187)
                pointBuriedNew(moduleId, { opActive, opEntity: describe })
                wftCommon.jumpJqueryPage(
                  `index.html?isSeparate=1&nosearch=1&companycode=${companycode}&companyname=${companyname}&activeKey=chart_ddycd#/${CHART_HASH}`
                )
              }}
              data-uc-id="52RtvQ0DkZ"
              data-uc-ct="button"
            >
              <FingerO
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                data-uc-id="ptYgetvK81"
                data-uc-ct="fingero"
              />
              <span>{intl('437412', '触达')}</span>
            </Button>
            <Button onClick={onClickReport} data-uc-id="BxOVPWBZ2z" data-uc-ct="button">
              <FileTextO
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                data-uc-id="f9chcfBzqT"
                data-uc-ct="filetexto"
              />
              <span>{intl('175211', '报告')}</span>
            </Button>

            <Button
              onClick={() => {
                const { moduleId, opActive, describe } = commonBuryList.find((res) => res.moduleId === 922602100273)
                pointBuriedNew(moduleId, { opActive, opEntity: describe })
                onClickCollect()
              }}
              data-uc-id="Past8C5Ayy"
              data-uc-ct="button"
            >
              {collectState ? (
                <StarF
                  className="corpCollectState"
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  data-uc-id="oXugMtbRZH"
                  data-uc-ct="starf"
                />
              ) : (
                <AddStarO
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  data-uc-id="_0MWgIV1sJ"
                  data-uc-ct="addstaro"
                />
              )}
              <span>{collectState ? intl('138129', '已收藏') : intl('143165', '收藏')}</span>
            </Button>
          </div>
        )}

        {canBack ? (
          <div className="company-operation">
            <Button onClick={onClickBack} data-uc-id="ZGy-VW5USr" data-uc-ct="button">
              <UndoO
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                data-uc-id="NpNgMMACU_"
                data-uc-ct="undoo"
              />
              <span>{intl('464221', '返回')}</span>
            </Button>
          </div>
        ) : null}
      </div>

      <div className="corp-info-title-trans-wrapper">
        {getCorpNameTransByCardInfo(headerInfo) && (
          <>
            <span className="corp-info-title-trans">{getCorpNameTransByCardInfo(headerInfo)}</span>
            {headerInfo?.corpNameAITransFlag ? <ProvidedByAI /> : null}
          </>
        )}
      </div>
    </>
  )
}
