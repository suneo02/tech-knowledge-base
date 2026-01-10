import React, { useState, useEffect, useRef } from 'react'
import { FileTextO, SaveO, FullscreenO, ReductionO, MinusO, PlusO } from '@wind/icons'
import { Switch, Divider, Slider, InputNumber } from '@wind/wind-ui'
import intl from '@/utils/intl'
import { OPERATOR_RIGHT_MENU_LIST } from '../constants'
import { WIND_BDG_GRAPH_OPERATOR_RIGHT_TYPE, GRAPH_MENU_TYPE } from '../../types'
import './index.less'
import { isFromRimePEVC } from 'gel-util/link'

/**
 * 操作组件属性
 * @interface OperatorProps
 * @param {Function} onAction - 点击操作的回调函数
 * @param {boolean} [waterMask] - 是否显示水印
 * @param {boolean} [resetSize] - 是否重置大小
 */
interface OperatorProps {
  onAction: (type: string, value?: number) => void
  waterMask?: boolean
  resetSize?: boolean
  zoomFactor?: number
}

/**
 * 操作组件属性
 * @interface OperatorRightProps
 * @param {any} menu - 菜单
 * @param {Function} onOperatorAction - 操作回调函数
 * @param {boolean} [waterMask] - 是否显示水印
 * @param {boolean} [resetSize] - 是否重置大小
 * @param {boolean} [hideSize] - 是否隐藏缩放按钮
 */
interface OperatorRightProps {
  menu?: any
  onOperatorAction?: (type: string, value?: number) => void
  waterMask?: boolean
  resetSize?: boolean
  zoomFactor?: number
  hideSize?: boolean
}

interface OperatorButtonProps extends OperatorProps {
  type: string
  icon: React.ReactNode
  text: string
  intlCode?: string
}

/**
 * 通用操作按钮组件
 * @param {OperatorButtonProps} props - 组件属性
 * @returns {JSX.Element} 操作按钮组件
 */
const OperatorButton: React.FC<OperatorButtonProps> = ({ type, icon, text, intlCode, onAction }) => {
  return (
    <span onClick={() => onAction(type)} className="operator-item" data-uc-id="lRX_nOaQtLL" data-uc-ct="span">
      {icon}
      {intlCode ? intl(intlCode, text) : text}
    </span>
  )
}

/**
 * 去水印组件
 * @param {OperatorProps} props - 组件属性
 * @param {Function} props.onAction - 点击操作的回调函数
 * @param {boolean} props.waterMask - 是否显示水印
 * @returns {JSX.Element} 去水印按钮组件
 */
const RemoveWaterMark: React.FC<OperatorProps> = ({ onAction, waterMask = true }) => {
  const [checked, setChecked] = useState(waterMask)

  const onChange = (checked: boolean) => {
    setChecked(checked)
    onAction(checked ? 'addWaterMark' : 'removeWaterMark')
  }
  return (
    <span className="operator-item" onClick={() => onChange(!checked)} data-uc-id="1E86g7AjdIp" data-uc-ct="span">
      <Switch size="small" checked={!checked} data-uc-id="ZnvM-TA372" data-uc-ct="switch" />
      {intl('440334', '去水印')}
    </span>
  )
}

/**
 * 缩放组件
 * @param {OperatorProps} props - 组件属性
 * @param {Function} props.onAction - 点击操作的回调函数
 * @param {boolean} props.resetSize - 是否重置大小
 * @returns {JSX.Element} 缩放按钮组件
 */
const Size: React.FC<OperatorProps> = ({ onAction, resetSize = false, zoomFactor }) => {
  const [size, setSize] = useState(100)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setSize(zoomFactor ? zoomFactor : 100)
  }, [zoomFactor])

  console.log('zoomFactor', zoomFactor)

  // 重置至初始状态
  useEffect(() => {
    if (resetSize && size !== 100) {
      setSize(100)
    }
  }, [resetSize])

  const handleMinus = () => {
    if (size === 25) {
      return
    }
    const minusSize = size - 25 <= 25 ? 25 : size - 25

    onAction('size', minusSize)
    setSize(minusSize)
  }

  const handlePlus = () => {
    if (size === 200) {
      return
    }
    const plusSize = size + 25 >= 200 ? 200 : size + 25
    onAction('size', plusSize)
    setSize(plusSize)
  }

  const handleInputChange = (value: number) => {
    // 清除之前的定时器
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // 设置新的定时器，500ms 后执行
    debounceTimerRef.current = setTimeout(() => {
      let finalValue = value
      if (!value || !Number(value)) {
        finalValue = 100
      }
      if (value < 25) {
        finalValue = 25
      } else if (value > 200) {
        finalValue = 200
      }
      setSize(finalValue)
      onAction('size', finalValue)
    }, 500)
  }

  // 组件卸载时清除定时器
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  return (
    <>
      <span className={`operator-item-minus ${size === 25 ? 'operator-item-disabled' : ''}`} title="缩小">
        <MinusO
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          onClick={handleMinus}
          data-uc-id="nrlWNbHI9y"
          data-uc-ct="minuso"
        ></MinusO>
      </span>
      <span className="operator-item-number-input">
        <InputNumber
          value={size}
          min={25}
          max={200}
          onChange={handleInputChange}
          size="small"
          formatter={(value) => `${Number(value).toFixed(0)}`}
          data-uc-id="yL6F1gsG2kt"
          data-uc-ct="inputnumber"
        />
        <span className="operator-item-percent">%</span>
      </span>
      <span className={`operator-item-plus ${size === 200 ? 'operator-item-disabled' : ''}`} title="放大">
        <PlusO
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          onClick={handlePlus}
          data-uc-id="s8rCqMgu1E"
          data-uc-ct="pluso"
        ></PlusO>
      </span>
    </>
  )
}

// 简单按钮配置
const buttonConfigs = {
  exportReport: {
    icon: (
      <FileTextO
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        data-uc-id="eZiZHn6CAU"
        data-uc-ct="filetexto"
      />
    ),
    text: '导出报告',
    intlCode: '440315',
  },
  saveImage: {
    icon: (
      <SaveO
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        data-uc-id="Vp_w0bA2zI"
        data-uc-ct="saveo"
      />
    ),
    text: '保存图片',
    intlCode: '421570',
  },
  fullScreen: {
    icon: (
      <FullscreenO
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        data-uc-id="3YiiIseCU9"
        data-uc-ct="fullscreeno"
      />
    ),
    text: '全屏',
    intlCode: '',
  },
  restore: {
    icon: (
      <ReductionO
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        data-uc-id="8wh5wzlFA1"
        data-uc-ct="reductiono"
      />
    ),
    text: '还原',
    intlCode: '414174',
  },
}

/**
 * 组件映射
 * @type {Record<string, React.ComponentType<OperatorProps>>}
 */
const componentMap = {
  ...(isFromRimePEVC()
    ? {}
    : {
        exportReport: (props: OperatorProps) => (
          <OperatorButton type="exportReport" {...buttonConfigs.exportReport} {...props} />
        ),
      }),
  saveImage: (props: OperatorProps) => <OperatorButton type="saveImage" {...buttonConfigs.saveImage} {...props} />,
  fullScreen: (props: OperatorProps) => <OperatorButton type="fullScreen" {...buttonConfigs.fullScreen} {...props} />,
  restore: (props: OperatorProps) => <OperatorButton type="restore" {...buttonConfigs.restore} {...props} />,
  removeWaterMark: RemoveWaterMark,
  size: Size,
}

/**
 * 操作组件
 * @param {OperatorRightProps} props - 组件属性
 * @param {any} props.menu - 菜单
 * @param {Function} props.onOperatorAction - 操作回调函数
 * @param {boolean} props.waterMask - 是否显示水印
 * @param {boolean} props.resetSize - 是否重置大小
 * @returns {JSX.Element} 操作组件
 */
const OperatorRight: React.FC<OperatorRightProps> = ({
  menu,
  onOperatorAction,
  waterMask = true,
  resetSize = false,
  zoomFactor,
  hideSize = false,
}) => {
  const [size, setSize] = useState(zoomFactor ? zoomFactor * 100 : 100)

  useEffect(() => {
    console.log('zoomFactor~size', zoomFactor)
    setSize(zoomFactor ? zoomFactor * 100 : 100)
  }, [zoomFactor])

  const handleAction = (type: string, value?: number) => {
    onOperatorAction?.(type, value)
  }

  let operatorList: WIND_BDG_GRAPH_OPERATOR_RIGHT_TYPE[] = [...OPERATOR_RIGHT_MENU_LIST] // 默认显示的按钮

  if (hideSize) {
    operatorList.pop()
  }
  // 一般的图不需要导出报告
  if (menu?.exportAction) {
    operatorList = [WIND_BDG_GRAPH_OPERATOR_RIGHT_TYPE.ExportReport, ...operatorList]
  }
  // 主要针对外部的图
  if (menu?.noAction) {
    return null
  }
  // 持股路径
  if (menu?.key === GRAPH_MENU_TYPE.SHAREHOLDING_PATH) {
    operatorList = [WIND_BDG_GRAPH_OPERATOR_RIGHT_TYPE.SaveImage, WIND_BDG_GRAPH_OPERATOR_RIGHT_TYPE.Restore]
  }
  return (
    <div className="charts-operator-right">
      {operatorList.map((item, index) => {
        const Component = componentMap[item]
        return (
          <React.Fragment key={item}>
            {index > 0 && <Divider type="vertical" />}
            <Component
              onAction={handleAction}
              waterMask={waterMask}
              resetSize={resetSize}
              zoomFactor={size}
              data-uc-id="e7R6JlP4Pbd"
              data-uc-ct="component"
            />
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default OperatorRight
