import React, { memo, useEffect, useState } from 'react'
import styled from 'styled-components'

/**
 * 一个记忆化的组件，用于创建一个数字范围选择器。
 *
 * @param {string|number} [props.min=''] - 范围的最小值。
 * @param {string|number} [props.max=''] - 范围的最大值。
 * @param {function} [props.changeOptionCallback={() => null}] - 当失焦时的回调函数。
 * @param {function} [props.changeInputAlert={() => {}}] - 当输入改变时的警告回调函数。
 * @param {boolean} [props.fromBid] - 是否来源于出价。
 * @param {string} [props.className] - 组件的样式类名。
 * @param {string} [props.unit] - 单位。
 * @param {number} [props.maxVal] - 最大差值限制。
 * @returns {React.ReactNode} 返回一个数字范围输入组件。
 */
const NumberRangeOption = memo(
	({
		min = '',
		max = '',
		changeOptionCallback = () => null,
		changeInputAlert = () => {},
		fromBid,
		className,
		unit,
		maxVal,
	}) => {
		const [_min, setMin] = useState(min)
		const [_max, setMax] = useState(max)

		useEffect(() => {
			// if (min) {
			setMin(min)
			// }
		}, [min])

		useEffect(() => {
			// if (max) {
			setMax(max)
			// }
		}, [max])
		const inputHandle = (e) => {
			const isMin = e.target.name === 'min' // 是否是min
			const val = parseInt(e.target.value)
			isMin ? setMin(val) : setMax(val)
			if (fromBid) {
				changeInputAlert()
			}
		}

		// 失去焦点处理
		const onBlur = () => {
			if (maxVal) {
				if (_max - _min > maxVal) {
					// setMin(1)
					// setMax(_min)
					let value = `${_min}-${_max}`
					changeOptionCallback(value)
					return
				}
			}

			if (_min && _max && _min > _max) {
				//   setMin(_max)
				let value = `${_min}-${_max}`
				changeOptionCallback(value)
				return
			}
			let value = `${_min ? _min : ''}-${_max ? _max : ''}`

			changeOptionCallback(value)
		}

		return (
			<Box className={className}>
				<input name="min" onBlur={onBlur} value={_min} onChange={inputHandle} type="number" />
				&nbsp;-&nbsp;
				<input name="max" onBlur={onBlur} value={_max} onChange={inputHandle} type="number" />
				&nbsp;{unit ? unit : ''}
			</Box>
		)
	}
)

const Box = styled.div`
	display: flex;
	align-items: center;

	input {
		width: 63px;
		height: 30px;
		outline: none;
		padding: 0 8px;
		font-size: 14px;
		border: 1px solid #d9d9d9;
		border-radius: 2px;

		&:focus {
			border: 1px solid #3dc1d4;
		}

		&[type='number']::-webkit-inner-spin-button,
		&[type='number']::-webkit-outer-spin-button {
			-webkit-appearance: none;
		}
	}
`

export default NumberRangeOption
