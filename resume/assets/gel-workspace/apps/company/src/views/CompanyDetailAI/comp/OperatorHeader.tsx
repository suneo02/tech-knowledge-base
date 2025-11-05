import { DownloadO, PhoneO } from '@wind/icons'
import { Button, Divider, Layout } from '@wind/wind-ui'
import React from 'react'

const { Operator } = Layout

import { GELSearchParam, getUrlByLinkModule, KGLinkEnum, LinksModule, UserLinkEnum } from '@/handle/link'
import ToolsBar from '../../../components/toolsBar'
import intl from '@/utils/intl'

interface OperatorHeaderProps {
  entityName: string // 企业名称
  companyCode: string // 企业编码
  collectState: boolean // 收藏状态
  setCollectState: (state: boolean) => void // 设置收藏状态
}

export const OperatorHeader: React.FC<OperatorHeaderProps> = ({
  entityName,
  collectState,
  companyCode,
  setCollectState,
}) => {
  const operationMainTool = () => {
    return (
      <div className="company-detail-ai__operation-main-tool">
        <ToolsBar
          isHorizon={true}
          isShowCollect={true}
          isShowFeedback={true}
          backTopWrapClass="CompanyDetailAI_ScrollContainer"
          collectState={collectState}
          setCollectState={setCollectState}
          companyCode={companyCode}
        />
      </div>
    )
  }

  return (
    // @ts-expect-error
    <Operator style={{ padding: '16px 24px' }}>
      <div className="company-detail-ai__operation-main">
        <div>
          <span style={{ color: '#333', fontWeight: 'bolder' }}>{entityName}</span>
          <span style={{ color: '#999' }}> | {intl('', '企业详情')}</span>
        </div>

        <div className="company-detail-ai__operation-main-right">
          <div className="company-detail-ai__operation-main-func">
            <Button
              type="text"
              size="small"
              // @ts-expect-error
              icon={<DownloadO style={{ fontSize: 16 }} />}
              onClick={() => {
                window.open(
                  getUrlByLinkModule(LinksModule.USER, {
                    subModule: UserLinkEnum.MyData,
                  })
                )
              }}
            >
              {intl('437448', '下载报告')}
            </Button>
            <Divider type="vertical" />
            <Button
              type="text"
              size="small"
              // @ts-expect-error
              icon={<PhoneO style={{ fontSize: 16 }} />}
              onClick={() => {
                window.open(
                  getUrlByLinkModule(LinksModule.KG, {
                    subModule: KGLinkEnum.chart_ddycd,
                    params: {
                      [GELSearchParam.NoSearch]: 1,
                    },
                  })
                )
              }}
            >
              {intl('261180', '触达')}
            </Button>
          </div>
          {operationMainTool()}
        </div>
      </div>
    </Operator>
  )
}
