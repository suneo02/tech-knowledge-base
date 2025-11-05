/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { BookmarkO } from '@wind/icons'
import { Layout } from '@wind/wind-ui'
import React, { useCallback, useState } from 'react'
const { Content } = Layout

import CompanyDetail from './comp/CompanyDetail'
import CompanySider from './CompanySider/CompanySider'
import { OperatorHeader } from './comp/OperatorHeader'

import { useDispatch, useSelector } from 'react-redux'
import * as companyActions from '../../actions/company'

import { AIConversationIframe } from './comp/AIConversationIframe'
import { AliceBitAnimation } from './comp/AIBitmapAnimation'
import './index.less'
import Menus from './Menus'

// 滚动容器类名
export const ScrollContainerClassName = 'CompanyDetailAI_ScrollContainer'

// 菜单组件接口定义
interface MenuComponentProps {
  treeDatas: any[]
  selectedKeys: string[]
  setSelectedKeys: (keys: string[]) => void
}

// AI对话组件接口定义
interface AIComponentProps {
  entityName: string
}

// 菜单项
const items = [
  {
    key: '目录',
    label: '目录',
    icon: <BookmarkO />,
    Component: ({ treeDatas, selectedKeys, setSelectedKeys }: MenuComponentProps) => (
      <Menus treeDatas={treeDatas} selectedKeys={selectedKeys} setSelectedKeys={setSelectedKeys} />
    ),
  },
  {
    key: 'chat',
    label: 'ALICE',
    icon: (
      <AliceBitAnimation
        style={{ transform: 'scale(0.5)', height: '22px', marginLeft: '-46px', transformOrigin: 'center' }}
      />
    ),
    Component: ({ entityName }: AIComponentProps) => <AIConversationIframe entityName={entityName} />,
  },
]

export default function CompanyDetailAI() {
  const [selectedKeys, setSelectedKeys] = useState([items[0]?.key])
  const [menuTreeDatas, setMenuTreeDatas] = useState([])
  const [menuSelectedKeys, setMenuSelectedKeys] = useState(['showCompanyInfo'])
  const dispatch = useDispatch()

  // 从 Redux 获取公司基本信息和收藏状态
  const companyState = useSelector((state: IState) => state.company)
  const { corp_name, corp_id } = companyState?.baseInfo || {}
  const collectState = companyState?.collectState || false
  const entityName = corp_name || ''
  const companyCode = corp_id || '' // 获取企业ID

  // 更新收藏状态的函数
  const setCollectState = (state) => {
    dispatch(companyActions.setCollectState(state))
  }

  const renderCompanyDetail = useCallback(() => {
    return <CompanyDetail setSelectedKeys={setMenuSelectedKeys} setMenuTreeDatas={setMenuTreeDatas} />
  }, [])

  return (
    <Layout style={{ height: '100%' }}>
      <Layout style={{ height: '100%' }}>
        <CompanySider selectedKeys={selectedKeys} setSelectedKeys={setSelectedKeys} items={items} />
        <Layout style={{ overflow: 'hidden' }}>
          <OperatorHeader
            entityName={entityName}
            collectState={collectState}
            companyCode={companyCode}
            setCollectState={setCollectState}
          />
          <Layout className="company-detail-ai__content">
            <div className="company-detail-ai__sider">
              {items.map((item) => {
                const isActive = item.key === selectedKeys[0]
                return (
                  <div
                    key={item.key}
                    className={`company-detail-ai__sider-item ${isActive ? 'company-detail-ai__sider-item--active' : 'company-detail-ai__sider-item--inactive'}`}
                  >
                    {item.key === '目录'
                      ? item.Component({
                          treeDatas: menuTreeDatas,
                          selectedKeys: menuSelectedKeys,
                          setSelectedKeys: setMenuSelectedKeys,
                        })
                      : item.Component({ entityName })}
                  </div>
                )
              })}
            </div>

            <Content className={`company-detail-ai__main`}>{renderCompanyDetail()}</Content>
          </Layout>
        </Layout>
      </Layout>
    </Layout>
  )
}
