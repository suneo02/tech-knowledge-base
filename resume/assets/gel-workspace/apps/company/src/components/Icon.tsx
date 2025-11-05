import Icon from '@ant-design/icons'
import '../assets/common/hot@1x.svg'
import '../assets/common/New@1x.svg'
import '../assets/icons/add.svg'
import '../assets/icons/addColumn.svg'
import '../assets/icons/alert.svg'
import '../assets/icons/Alert_Fill.svg'
import '../assets/icons/Arrow_Down@1x.svg'
import '../assets/icons/arrow_right_small.svg'
import '../assets/icons/Arrow_Up_999@1x.svg'
import '../assets/icons/back.svg'
import '../assets/icons/bad.svg'
import '../assets/icons/Beta.svg'
import '../assets/icons/customerManagement.svg'
import '../assets/icons/customers.svg'
import '../assets/icons/delete.svg'
import '../assets/icons/delete2.svg'
import '../assets/icons/deleteColumn.svg'
import '../assets/icons/delSub@1x.svg'
import '../assets/icons/Down_999@1x.svg'
import '../assets/icons/down_fill.svg'
import '../assets/icons/download.svg'
import '../assets/icons/ExclamationCircle.svg'
import '../assets/icons/eye.svg'
import '../assets/icons/filter.svg'
import '../assets/icons/find.svg'
import '../assets/icons/good.svg'
import '../assets/icons/home.svg'
import '../assets/icons/hot_big.svg'
import '../assets/icons/import.svg'
import '../assets/icons/list.svg'
import '../assets/icons/nextpage.svg'
import '../assets/icons/Notification.svg'
import '../assets/icons/notvip.svg'
import '../assets/icons/post.svg'
import '../assets/icons/prepage.svg'
import '../assets/icons/rename.svg'
import '../assets/icons/save.svg'
import '../assets/icons/share.svg'
import '../assets/icons/star.svg'
import '../assets/icons/ToBottom_small_999@1x.svg'
import '../assets/icons/ToTop_small_999@1x.svg'
import '../assets/icons/Up_small_999@1x.svg'
import '../assets/icons/Upload.svg'
import '../assets/icons/user.svg'
import '../assets/icons/vip.svg'

import '../assets/icons/arrow_down.svg'
import '../assets/icons/Delete_666.svg'

import '../assets/icons/hot.svg'
import '../assets/icons/ToRight_small_Pri.svg'
import '../assets/icons/vip_filter.svg'
import '../assets/icons/vip_template.svg'
import '../assets/icons/winclose_666.svg'

import '../assets/icons/Arrow_close.svg'
import '../assets/icons/Arrow_left.svg'
import '../assets/icons/Arrow_right.svg'
import '../assets/icons/reset.svg'

import '../assets/imgs/svip.png'

import '../assets/common'
// 使用 index.js 导入所有 fcon 目录下的 SVG，而不是单独导入每个文件
import '../assets/fcon'
import '../assets/icons/doc_edit.svg'
import '../assets/icons/doc_excel.svg'
import '../assets/icons/doc_pdf.svg'
import '../assets/icons/doc_word.svg'

// 移除单独导入的 fcon SVG 文件，因为它们已经在 ../assets/fcon/index.js 中导入了
import '../assets/icons/home/AIRobert.svg'
import React from 'react'
import '../assets/icons/home/AISearchJump.svg'
import '../assets/imgs/chart/actor11.svg'
import '../assets/icons/miniApp.svg'
import '../assets/icons/Mobile.svg'
import '../assets/icons/QRCode.svg'
// 自定义图标
export const MyIcon = (props) => {
  return (
    <Icon
      component={() => {
        return (
          <svg className="myIcon" style={props.svgStyle}>
            <use xlinkHref={'#' + props.name} />
          </svg>
        )
      }}
      {...props}
    />
  )
}
