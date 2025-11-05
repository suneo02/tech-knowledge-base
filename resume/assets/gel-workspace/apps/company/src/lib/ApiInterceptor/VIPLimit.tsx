import React from 'react'
import { Modal } from '@wind/wind-ui'
import { getVipInfo } from '../utils'
import { VipPopup } from '../globalModal'
import global from '../global'

/**
 * TODO intl
 * @type {React.JSX.Element}
 */
export const LimitExceedHint = (
	<div className="no-data">{'您的查询数量已超限，请明日再试。若有疑问，请联系客户经理。'}</div>
)
/**
 * VIP 权益限制 处理
 * @param code
 * @constructor
 */
export const vipLimitInterceptor = (code) => {
	if (String(code) !== String(global.VIP_OUT_LIMIT)) {
		return
	}
	const vipInfo = getVipInfo()

	if (vipInfo.isVip) {
		Modal.info({
			content: LimitExceedHint,
		})
	} else {
		// 付费窗口
		VipPopup()
	}
}
