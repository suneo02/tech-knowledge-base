import React from 'react'
import intl from '../../../utils/intl'
import './ProductIntro.less'

/**
 * @author 张文浩<suneo@wind.com.cn>
 * 产品介绍标题组件
 * 用于显示"全球企业库 会员"标题
 */
export const ProductIntro: React.FC = () => {
  return (
    <div className="product-intro">
      <span>{intl('149697', '全球企业库')}</span>
      &nbsp;
      <span>{intl('33117', '会员')}</span>
    </div>
  )
}
