/**
 * 展示详情页 可搭配快捷导航栏使用
 * Created by Calvin
 *
 * @format
 */

import VipComponent from '@/components/common/Vip'
import CardHeader from '@/components/common/card/header/Header'
import { Card, Skeleton } from '@wind/wind-ui'
import React, { forwardRef } from 'react'
import VipAccess from '../../../components/developer/VipAccess'
import { Menu } from '@/components/layout/container/Integration'
import { isArray, isNil } from 'lodash'
import { useUserVipState } from '@/handle/user.ts'
import { useCorpStore } from '@/store/company.ts'
import { ConfigDetailContext } from '@/components/layout/ctx.tsx'
import { ICfgDetailSubMenu } from '@/types/configDetail/module.ts'

export const CorpContent = forwardRef<HTMLDivElement, any>((_, contentRef) => {
  const treeData = useCorpStore((store) => store.treeData)
  const { vipState, setVipState } = useUserVipState()

  const checkHidden = (info) => {
    return (!info.num || info.num === '0') && info.enableHidden
  }

  const renderChild = (module: ICfgDetailSubMenu) => {
    const checkVip =
      (module.isSvip && !vipState.includes('svip')) ||
      (module.isVip && !(vipState.includes('vip') || vipState.includes('svip')))

    const treeKey = 'treeKey' in module ? module.treeKey : undefined
    if (treeKey === undefined) {
      console.error('treeKey is undefined', module)
    }
    return (
      <div id={module.key} key={module.key} className="node-item-children">
        {checkVip ? (
          <Card title={<CardHeader {...module} />} styleType="block">
            <VipComponent
              title={module.title}
              vipPopupSel={module.isSvip ? 'svip' : 'vip'}
              onlySvip={module.isSvip}
              data-uc-id="9S6bibLUiT"
              data-uc-ct="vipcomponent"
            />
          </Card>
        ) : checkHidden(module) ? null : (
          <Menu {...module} treeKey={treeKey} />
        )}
      </div>
    )
  }

  return (
    <ConfigDetailContext.Provider value={'company'}>
      <div className="content" ref={contentRef}>
        <VipAccess value={vipState} setValue={setVipState} />
        <div>
          {!treeData?.length ? (
            <div className="empty-container">
              <Skeleton loading animation />
            </div>
          ) : (
            treeData.map((moduleOut) => {
              // 非数组 或者 无children 或者 每个 child 都不展示
              if (
                isNil(moduleOut) ||
                !isArray(moduleOut.children) ||
                moduleOut.children.length === 0 ||
                moduleOut.children.every((module) => module.disabled)
              )
                return null

              return (
                <div className="node-item" key={moduleOut.key} id={moduleOut.key}>
                  <Card title={<CardHeader {...moduleOut} />}>
                    {moduleOut.children?.length
                      ? moduleOut.children.map((module) => !module.disabled && renderChild(module))
                      : null}
                  </Card>
                </div>
              )
            })
          )}
        </div>
      </div>
    </ConfigDetailContext.Provider>
  )
})

CorpContent.displayName = 'CorpContent'
