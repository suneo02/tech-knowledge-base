import { useHKCorpInfoCtx } from '@/components/company/HKCorp/info/ctx.tsx'
import { Button } from '@wind/wind-ui'
import classNames from 'classnames'
import React, { FC } from 'react'

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // 月份从0开始，所以需要加1
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const HKCorpInfoBoughtTip: FC = () => {
  const { state, dispatch } = useHKCorpInfoCtx()
  if (state.bussStatus !== 2 || !state.lastedProcessTime) {
    // 不是已购买，或者没有最后更新时间
    return null
  }

  const timeText = formatTimestamp(state.lastedProcessTime)

  const BuyBtn: FC<{
    text: string
  }> = ({ text }) => (
    <Button
      type={'text'}
      className={classNames('color-primary', 'p-0', 'border-0')}
      onClick={() => {
        dispatch({
          type: 'SET_MODAL_TYPE',
          payload: 'instruction',
        })
        dispatch({
          // 再次购买时 ，可以关闭弹窗
          type: 'SET_SHOW_MODAL_CLOSE',
          payload: true,
        })
      }}
      data-uc-id="lbLcmcTZ5a"
      data-uc-ct="button"
    >
      {text}
    </Button>
  )
  // 当前为截至XXXX的最新数据，点此重新购买。重新购买后会重新进行查询，但是不保证相对于当前数据有更新。
  // The current data is up to date as of XXXX. Click here to repurchase. Upon repurchase, a new query will be conducted, but there is no guarantee of updates relative to the current data.
  return (
    <div>
      {window.en_access_config
        ? `The current data is up to date as of ${timeText}.`
        : `当前为截至${timeText}的最新数据，`}
      {window.en_access_config ? `Click here to ` : `点此`}
      <BuyBtn text={window.en_access_config ? `repurchase` : `重新购买`} />
      {window.en_access_config ? '. ' : '。'}
      {window.en_access_config
        ? `Upon repurchase, a new query will be conducted, but there is no guarantee of updates relative to the current data.`
        : `重新购买后会重新进行查询，但是不保证相对于当前数据有更新。`}
    </div>
  )
}
