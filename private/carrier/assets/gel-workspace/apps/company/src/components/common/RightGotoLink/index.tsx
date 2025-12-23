import { RightO } from '@wind/icons'
import React from 'react'
import './index.less'

/**
 * @author 陆一新<yxlu@wind.com.cn>
 * @description 右侧带箭头的链接组件
 * @param {Object} props
 * @param {string} props.txt - 显示的文本内容
 * @param {any} props.func - 点击事件处理函数
 * @param {React.CSSProperties} [props.style] - 可选的样式属性
 */
export const RightGotoLink: React.FC<{
  txt: string
  func: any
  style?: React.CSSProperties
}> = ({ txt, func, style }) => {
  return (
    <div onClick={func} className="rightGotoLink-container" style={style} data-uc-id="9w339hTW-e" data-uc-ct="div">
      <span className="rightGotoLink">
        {txt}
        <RightO
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          data-uc-id="U45VN7T94F"
          data-uc-ct="righto"
        />
      </span>
    </div>
  )
}
