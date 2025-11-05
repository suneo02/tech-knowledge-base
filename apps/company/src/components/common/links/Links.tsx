import { createRequest } from '@/api/request'
import {
  LinksModule,
  TLinkOptions,
  getUrlByLinkModule,
  handleJumpTerminalCompatibleAndCheckPermission,
} from '@/handle/link'
import classNames from 'classnames'
import React from 'react'
import { pointBuriedByModule } from '../../../api/pointBuried/bury'
import { LinksComponent } from './components'
import './links.less'
import { titleDefault, useLinkTitle } from './titleHandle'

/** 添加企业详情的浏览记录 */
const addRecord = (entityId: string) => {
  const api = createRequest({ noExtra: true })
  api('operation/insert/companybrowsehistoryadd', { params: { entityId } })
}

const getLinkClassName = (info?: boolean, useUnderline?: boolean) =>
  classNames('links-container', {
    info: info,
    'links-underline': useUnderline,
  })

/**
 * 通用链接组件，用于处理各种类型的链接跳转
 *
 * @component
 * @example
 * ```tsx
 * // 基础用法
 * <Links
 *   title="公司名称"
 *   id="123"
 *   module={LinksModule.COMPANY}
 * />
 *
 * // 带埋点的链接
 * <Links
 *   title="产品详情"
 *   url="/product/123"
 *   bury={{ id: 1, type: 'product' }}
 * />
 *
 * // 自定义样式
 * <Links
 *   title="联系我们"
 *   url="/contact"
 *   info={true}
 *   useUnderline={true}
 *   className="custom-link"
 * />
 * ```
 *
 * @param {Object} props - 组件属性
 * @param {LinksModule} [props.module] - 链接模块类型，用于确定链接生成规则
 * @param {string} [props.subModule] - 子模块类型
 * @param {string} [props.type] - 链接类型
 * @param {string} [props.id] - 链接ID
 * @param {string} [props.title] - 链接显示文本
 * @param {string} [props.url] - 直接链接地址
 * @param {string} [props.value] - 链接值
 * @param {string} [props.extraId] - 额外ID
 * @param {string} [props.target] - 链接目标
 * @param {boolean} [props.info] - 是否为信息样式
 * @param {Object} [props.params] - 额外参数
 * @param {boolean} [props.ifOversea] - 是否为海外版本
 * @param {boolean} [props.useUnderline] - 是否使用下划线样式
 * @param {string} [props.standardLevelCode] - 标准等级代码
 * @param {Object} [props.bury] - 埋点配置，包含 id 和其他埋点参数
 * @param {string} [props.className] - 自定义类名
 * @param {string} [props.classNameWithJump] - 可点击时的自定义类名
 *
 * @returns {JSX.Element} 返回链接组件或纯文本
 *
 * @description
 * 该组件用于处理各种类型的链接跳转，支持：
 * 1. 根据模块类型自动生成链接地址
 * 2. 支持埋点统计
 * 3. 支持自定义样式
 * 4. 支持企业详情浏览记录
 * 5. 支持终端兼容性处理
 */
const Links = ({
  module,
  subModule,
  type,
  id,
  title,
  url,
  value,
  extraId,
  target,
  info,
  params,
  ifOversea,
  useUnderline,
  standardLevelCode,
  bury,
  className: classNameProp,
  classNameWithJump,
}: TLinkOptions & {
  module?: LinksModule
  info?: boolean
  useUnderline?: boolean
  bury?: {
    [key: string]: string
  } & { id: number }
  className?: string
  classNameWithJump?: string
}) => {
  const titleParsed = useLinkTitle(title, { module, type })
  const linksParams = {
    title: titleParsed,
    url:
      getUrlByLinkModule(module, {
        subModule,
        url,
        id,
        params,
        target,
        type,
        value,
        title,
        extraId,
        ifOversea,
        standardLevelCode,
      }) || url,
  }

  const ifShowLink = linksParams.url && linksParams.title && linksParams.title !== titleDefault
  if (!ifShowLink) {
    return <span className={classNameProp}>{linksParams.title}</span>
  } else {
    const onLinkClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
      e.preventDefault()
      // 添加埋点
      if (bury) {
        const { id, ...rest } = bury
        pointBuriedByModule(id, rest)
      }
      if (module === LinksModule.COMPANY) {
        addRecord(id)
      }
      handleJumpTerminalCompatibleAndCheckPermission(linksParams.url)
    }

    return (
      <LinksComponent
        className={classNames(getLinkClassName(info, useUnderline), classNameProp, {
          [classNameWithJump]: ifShowLink && classNameWithJump,
        })}
        onClick={onLinkClick}
        url={linksParams.url}
      >
        {title}
      </LinksComponent>
    )
  }
}

export default Links
