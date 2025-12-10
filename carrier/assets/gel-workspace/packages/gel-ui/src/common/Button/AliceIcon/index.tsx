import React from 'react'
import styles from './index.module.less'

interface AliceIconProps {
  children: React.ReactElement<SVGElement>
  hover?: boolean
  style?: React.CSSProperties
  gradientId?: string
}

/**
 * AliceAI图标组件 默认hover时，svg图标会渐变，需支持渐变 渐变id默认为wicon-svg-effect-alice-hover 同时添加 span.wicon-svg className给svg元素，解决svg宽高问题
 * @param children 子元素 svg图标  eg: <SendIcon />
 *<?xml version="1.0" encoding="UTF-8"?>
    <svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink">
        <title>输入</title>
        <defs>
            <linearGradient id="wicon-svg-effect-alice-hover" x1="0%" y1="0%" x2="100%" y2="85%">
                <stop offset="0%" stop-color="#5879fb" />
                <stop offset="85%" stop-color="#3ec0d3" />
            </linearGradient>
        </defs>
        <g id="输入" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <rect id="矩形" x="0" y="0" width="20" height="20"></rect>
            <path class="path-normal"
                d="M1.22628749,1.10977788 C1.26192679,1.09959522 1.29924767,1.09856551 1.3349027,1.10637762 L1.38671743,1.12468827 L18.7398177,9.8012384 C18.8495907,9.8561249 18.894085,9.9896078 18.8391985,10.0993808 C18.8248631,10.1280515 18.8045862,10.153107 18.7799184,10.1729962 L18.7398177,10.1987616 L1.38671743,18.8753117 C1.27694443,18.9301982 1.14346153,18.8857039 1.08857503,18.7759309 C1.07199886,18.7427786 1.06410897,18.7062867 1.06505719,18.6698027 L1.07366464,18.615501 L3.53523635,10 L1.07366464,1.38449901 C1.03994813,1.26649123 1.10827971,1.14349439 1.22628749,1.10977788 Z M16.1548813,9.99999184 L3.04951849,3.4467723 L4.7304903,9.33333333 L11,9.33333333 C11.102275,9.33333333 11.1884126,9.40242519 11.2142842,9.49648009 L11.2222222,9.55555556 L11.2222222,10.4444444 C11.2222222,10.5467194 11.1531304,10.6328571 11.0590755,10.6587287 L11,10.6666667 L4.73048618,10.6666667 L3.04951849,16.552131 L16.1548813,9.99999184 Z"
                id="形状-normal" fill="#707680" fill-rule="nonzero"></path>

        </g>
    </svg>
 * @param hover 是否hover 自定义hover状态
 * @param gradientId 渐变id 默认为wicon-svg-effect-alice-hover
 * @param childClassName 给子元素添加的类名
 * @returns
 * 
 * 
 * 
 *   
    ---  弃用该方案（外层元素包裹实现），会有布局样式问题。SVG 作为矢量图形，其实际尺寸取决于多种因素综合作用，包括元素属性和容器布局
    不同的容器上下文（直接渲染 vs 嵌套在 AliceIcon 中）导致了不同的尺寸计算结果
  
  <span className={hover ? styles['alice-icon-svg--hover'] : styles['alice-icon-svg']} style={style}>
    {childrenWithClass}
  </span> 

*/

export const AliceIcon = ({ children, hover, style, gradientId = 'wicon-svg-effect-alice-hover' }: AliceIconProps) => {
  const newStyle = { ...style, '--gradient-url': `url(#${gradientId})` } as React.CSSProperties

  // 如果有提供childClassName，则克隆children并添加类名
  const childrenWithClass = React.cloneElement(children, {
    className: hover ? styles['alice-icon-svg--hover'] : styles['alice-icon-svg'],
    // @ts-expect-error 类型错误
    style: newStyle as React.CSSProperties,
  })
  // 使用span包裹，避免svg元素的宽高问题,直接用svg做icon必须要用span.wicon-svg包裹，不然样式会错乱
  return <span className="wicon-svg">{childrenWithClass}</span>
}
