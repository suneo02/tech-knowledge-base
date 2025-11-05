import React, { FC, useMemo } from 'react'

import mockImg from '@/assets/imgs/hkCorp/mockData.jpg'
import { TableForHKCorp } from '@/components/company/HKCorp/info/content/tableComp.tsx'
import { useHKCorpInfoCtx } from '@/components/company/HKCorp/info/ctx.tsx'
import directorInfo from '@/handle/corpModuleCfg/base/HKCorpInfo/cfg/directorInfo.json'
import secretarialInfo from '@/handle/corpModuleCfg/base/HKCorpInfo/cfg/secretarialInfo.json'
import shareholderInfo from '@/handle/corpModuleCfg/base/HKCorpInfo/cfg/shareholderInfo.json'
import shareholdingStructure from '@/handle/corpModuleCfg/base/HKCorpInfo/cfg/shareholdingStructure.json'
import { ICfgDetailTableJson } from '@/types/configDetail/table.ts'
import intl from '@/utils/intl'
import { Card } from '@wind/wind-ui'
import cn from 'classnames'
import { HKCorpInfoModal } from '../modal'
import styles from '../style/content.module.less'

const hkCorpContentCfg: {
  key: string
  children: ICfgDetailTableJson[]
} = {
  key: 'hkCorpCorpInfo',
  children: [shareholdingStructure, shareholderInfo, directorInfo, secretarialInfo],
}

export const HKCorpInfoContent: FC = () => {
  const { state } = useHKCorpInfoCtx()

  const cfgComputed = useMemo<typeof hkCorpContentCfg>(() => {
    try {
      if (state.bussStatus === 2) {
        return hkCorpContentCfg
      }
      // 如果订单状态为未完成，那么去除配置中的api字段，不发送请求获取数据
      // mock 一条 data source 数据
      return {
        ...hkCorpContentCfg,
        children: hkCorpContentCfg.children.map((child) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { api, columns, ...rest } = child
          return {
            ...rest,
            dataSource: [{}],
            // 对 mock 数据自定义 render
            columns: columns.map((column) => {
              return {
                ...column,
                render: () => {
                  return <img src={mockImg} />
                },
              }
            }),
            showIndex: false,
          }
        }),
      }
    } catch (e) {
      console.error(e)
      return hkCorpContentCfg
    }
  }, [state.bussStatus])

  return (
    <Card
      className={cn(styles.hkCorpContent)}
      title={
        <div className="has-child-table">
          <span className="corp-module-title">{intl(414513, '公司资料')}</span>
        </div>
      }
    >
      <div className={cn(styles.hkCorpContentInner)}>
        {cfgComputed.children.map((item) => (
          <TableForHKCorp key={item.key} {...item} type={'table'} />
        ))}
      </div>
      <HKCorpInfoModal />
    </Card>
  )
}
