import { InfoCircleButton } from '@/components/icons/InfoCircle'
import { HorizontalTableCol } from '@/types/WindUI/horizontalTable'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils'
import { Tooltip } from '@wind/wind-ui'
import React, { FC } from 'react'
import { ICorpBasicInfoFront } from '../handle'

const mapStateToTips = (val: ICorpBasicInfoFront['state_zh']) => {
  let res = ''

  switch (val) {
    case '存续':
      res = intl('419601', '存续一般指企业依法存在并继续正常营业')
      break
    case '迁入':
      res = intl('419620', '企业登记主管机关的变更，迁入新主管机关')
      break
    case '迁出':
      res = intl('419621', '企业登记主管机关的变更，迁离某主管机关')
      break
    case '注销':
      res = intl('419602', '企业自行通过法定流程申请注销营业执照以终止公司法人资格')
      break
    case '吊销':
      res = intl(
        '437890',
        '工商局对违法企业作出的行政处罚。企业被吊销执照后，应当依法进行清算，清算结束并办理工商注销登记。'
      )
      break
    case '停业':
      res = intl('437891', '由某种原因，企业在期末处于停止生产经营活动待条件改变后仍恢复生产。')
      break
    case '撤销':
      res = intl(
        '437892',
        '是指工商行政主管部门或者上级行政机关根据利害关系人的请求或者依据职权、作出的撤销行政行为的决定。'
      )
      break
    case '吊销,未注销':
    case '吊销，未注销':
      res = intl('419623', '企业已被工商部门吊销营业执照，但尚未完成注销程序的状态')
      break
    case '吊销,已注销':
    case '吊销，已注销':
      res = intl('419624', '企业营业执照被依法吊销，并且已经完成了注销登记')
      break
    case '责令关闭':
      res = intl('437869', '是对企事业单位的行政处罚，即人民政府依法作出决定命令其关闭。')
      break

    default:
      break
  }
  return res
}

const RenderComp: FC<{
  txt: string
  backData: ICorpBasicInfoFront
}> = ({ txt, backData }) => {
  const title = mapStateToTips(window.en_access_config ? backData.state_zh : txt)
  return (
    <>
      {txt}
      {title && (
        <Tooltip overlayClassName="corp-tooltip" title={title}>
          <InfoCircleButton />
        </Tooltip>
      )}
      {backData.revokeOrCancelDate ? wftCommon.formatTime(backData.revokeOrCancelDate) : null}
    </>
  )
}
export const corpInfoBussStateRow: HorizontalTableCol<ICorpBasicInfoFront> = {
  title: intl('138416', '经营状态'),
  dataIndex: 'state',
  render: (txt, backData) => {
    return <RenderComp txt={txt} backData={backData} />
  },
}
