import { InfoCircleButton } from '@/components/icons/InfoCircle'
import { HorizontalTableCol } from '@/types/WindUI/horizontalTable.ts'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils'
import { Link, Tooltip } from '@wind/wind-ui'
import React, { FC } from 'react'
import { ICorpBasicInfoFront } from '../handle'
import { ParkBox } from './Park'

/**
 *
 * @param {*} content 小微企业 大型企业 等
 * @returns
 */
const CompanyScaleTooltipTitle: FC<{
  content?: string
  onClickFeedback: () => void
}> = ({ content, onClickFeedback }) => {
  const FeedBack = (
    <Link
      // @ts-expect-error ttt
      style={{
        color: '#00aec7',
      }}
      onClick={onClickFeedback}
      data-uc-id="1A_UMIUNSM"
      data-uc-ct="link"
    >
      {intl('142975', '反馈')}
    </Link>
  )
  if (content == '小微企业') {
    return (
      <>
        <p>{intl('361294', '依据国家市场监督管理总局公布的小微企业库，结合万得大数据模型进行判定。')}</p>
        <br />
        <p>{intl('361315', '小微企业库建库依据：')}</p>
        <p>{intl('361295', '1.工商总局关于进一步做好小微企业名录建设有关工作的意见（工商个字〔2015〕172号）')}</p>
        <p>{intl('361296', '2.国家统计局关于印发《统计上大中小微型企业划分办法（2017）》的通知')}</p>
        <p>
          {intl(
            '361316',
            '3.中国人民银行、中国银行业监督管理委员会、中国证券监督管理委员会、中国保险监督管理委员会、国家统计局关于印发《金融业企业划型标准规定》的通知 '
          )}
        </p>
        <br />
        <p>
          {intl('361313', '该结果仅供参考，并不代表万得的任何观点或保证。如有异议请点击')}
          {FeedBack}
          {intl('361314', '。')}
        </p>
      </>
    )
  } else {
    return (
      <>
        <p>
          {intl(
            '361293',
            '依据《统计上大中小微型企业划分办法（2017）》，结合万得大数据模型估算出大型企业、中型企业、小型企业和微型企业共四类企业规模分类。'
          )}
        </p>
        <br />
        <p>
          {intl('361313', '该结果仅供参考，并不代表万得的任何观点或保证。如有异议请点击')}
          {FeedBack}。
        </p>
      </>
    )
  }
}

export const getCorpInfoScaleRow = (onClickFeedback: () => void): HorizontalTableCol<ICorpBasicInfoFront> => ({
  title: (
    <>
      {intl('219343', '企业规模')}
      <Tooltip
        title={
          <CompanyScaleTooltipTitle
            onClickFeedback={onClickFeedback}
            data-uc-id="FhVtIF0f7-"
            data-uc-ct="companyscaletooltiptitle"
          />
        }
      >
        <InfoCircleButton />
      </Tooltip>
    </>
  ),
  dataIndex: 'scale',
  render: (txt) => {
    return txt == null || txt === '' ? '--' : txt
  },
})

export const corpInfoEmployeeScaleRow: HorizontalTableCol<ICorpBasicInfoFront> = {
  title: intl('257664', '人员规模'),
  dataIndex: 'employee_num',
  render: (txt) => {
    //人员规模, 精确匹配，0精确展示
    if (txt === '0' || txt === 0) {
      return 0
    } else {
      return txt ? txt : '--'
    }
  },
}

export const corpInfoEndowmentNumRow: HorizontalTableCol<ICorpBasicInfoFront> = {
  title: intl('145878', '参保人数'),
  dataIndex: 'endowment_num',
  render: (txt) => {
    if (txt === '0' || txt === 0) {
      //参保人数, 精确匹配，0精确展示
      return 0
    }
    let person_security = txt
    if (person_security) {
      person_security = wftCommon.formatMoneyComma(person_security)
    }
    return person_security || '--'
  },
}

export const corpInfoRegAddressRow: HorizontalTableCol<ICorpBasicInfoFront> = {
  title: intl('35776', '注册地址'),
  dataIndex: 'reg_address',
  colSpan: 5,
  render: (title, row) => (
    <ParkBox title={title} parkTitle={row?.registerPark} row={row} parkId={row?.registerParkId} isBusAddress={false} />
  ),
}

export const corpInfoBusAddressRow: HorizontalTableCol<ICorpBasicInfoFront> = {
  title: intl('1588', '办公地址'),
  dataIndex: 'bus_address',
  colSpan: 5,
  render: (title, row) => (
    <ParkBox title={title} parkTitle={row?.officePark} row={row} parkId={row?.officeParkId} isBusAddress={true} />
  ),
}
export const corpInfoBussScopeRow: HorizontalTableCol<ICorpBasicInfoFront> = {
  title: intl('9177', '经营范围'),
  dataIndex: 'business_scope',
  colSpan: 5,
}
