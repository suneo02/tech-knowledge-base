import WindBDGraph from '@wind/Wind.Base.Enterprise.Graph'
import React, { useState, useEffect } from 'react'
import { getWindBDGraphData } from '@/api/graph'
import { myWfcAjax } from '@/api/common'
import global from '@/lib/global'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils'
import './index.less'
import { linkToCompany } from '../../handle'
import SpinLoading from '../spin-loading'
import { translateGraphData } from '../extra'
import { VipPopup } from '@/lib/globalModal'
import { GRAPH_MENU_TYPE } from '../../types'
import { pointBuriedByModule } from '@/api/pointBuried/bury'

interface CtrlGraphProps {
  companyCode: string
  waterMask: string
  filter?: any
  config?: any
  saveImgName?: string
  width?: number
  height?: number
  apiParams?: any
  graphMenuType?: string
  linkSourceRIME?: boolean
  emptyText?: string
}

type CtrlInfo = {
  ActControId: string
  ActControName: string
  ActInvestRate: string | number
  [key: string]: any
}

type ApiResponse<T = any> = {
  ErrorCode: string | number
  Data: T
}

const CtrlGraph: React.FC<CtrlGraphProps> = ({
  companyCode,
  waterMask,
  config,
  saveImgName,
  width,
  height,
  apiParams,
  graphMenuType,
  linkSourceRIME = false,
  emptyText,
  ...props
}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [ctrlInfo, setCtrlInfo] = useState<CtrlInfo[]>([]) // 控制人info
  const [isStitution, setIsStitution] = useState(false) // 机构类型
  const [isCtrl, setIsCtrl] = useState(false) // 需要显示实际控制人label

  async function getData() {
    try {
      setLoading(true)
      const res = await getWindBDGraphData({ ...apiParams, noForbiddenWarning: true })

      if (res?.ErrorCode == global.USE_FORBIDDEN) {
        // 无权限，需要弹出vip付费弹框
        VipPopup()
        setData({})
        return
      }

      if (!res?.Data) {
        setData({})
        return
      }

      let finalData = res.Data
      if (window.en_access_config) {
        finalData = await translateGraphData(res.Data)
      }

      setData(finalData)
    } catch (err) {
      console.error('Failed to get data:', err)
      setData({})
    } finally {
      setLoading(false)
    }
  }

  const getActCtrlInfo = () => {
    myWfcAjax(`graph/company/getactcontroinfo/${companyCode}`, { companycode: companyCode }).then(
      (res: ApiResponse<CtrlInfo[]>) => {
        if (res.ErrorCode === global.SUCCESS && res.Data?.length) {
          if (window.en_access_config) {
            wftCommon.zh2en(
              res.Data,
              (endata) => {
                setCtrlInfo(endata)
              },
              null,
              () => {
                setCtrlInfo([])
              }
            )
          } else {
            setCtrlInfo(res.Data)
          }
        } else {
          setCtrlInfo([])
        }
      },
      () => {
        setCtrlInfo([])
      }
    )
  }

  const handleClick = (id: string, type: string, linkSourceRIME: boolean) => {
    return linkToCompany(id, type === 'company', type === 'person', linkSourceRIME)
  }

  useEffect(() => {
    // 更新状态
    const newIsStitution = graphMenuType === GRAPH_MENU_TYPE.BENEFICIARY_ORG
    const newIsCtrl = graphMenuType === GRAPH_MENU_TYPE.ACTUAL_CONTROLLER

    setIsStitution(newIsStitution)
    setIsCtrl(newIsCtrl)

    // 获取数据
    getData()

    // 如果是实际控制人图谱，获取控制人信息
    if (newIsCtrl) {
      getActCtrlInfo()
      // 实控人埋点
      pointBuriedByModule(922602100364, {
        currentId: companyCode,
        opId: companyCode,
      })
    } else {
      // 受益人埋点
      pointBuriedByModule(922602100993, {
        currentId: companyCode,
        opId: companyCode,
      })
    }
  }, [companyCode, graphMenuType])

  return (
    <>
      {loading && <SpinLoading />}
      {!loading && data ? (
        <WindBDGraph
          config={config}
          data={data?.relations ? data : null}
          waterMask={waterMask}
          saveImgName={saveImgName}
          leftInfo={
            isCtrl ? (
              <div className="graph-left-info">
                {ctrlInfo.map((item) => (
                  <div key={item.ActControId}>
                    <span> {intl('419991', '实际控制人')}：</span>
                    <span
                      className={item.ActControId ? 'graph-left-info-name' : ''}
                      style={{ marginRight: '20px' }}
                      onClick={() => {
                        if (!item.ActControId) return
                        if (item.ActControId?.length > 15) {
                          handleClick(item.ActControId, 'person', linkSourceRIME)
                        } else {
                          handleClick(item.ActControId, 'company', linkSourceRIME)
                        }
                      }}
                      data-uc-id="nxA0ID3MWE"
                      data-uc-ct="span"
                    >
                      {item.ActControName}
                    </span>
                    <span> {intl('420007', '实际持股比例')}：</span>
                    <span className="">
                      {Number(item.ActInvestRate) > 0
                        ? wftCommon.formatPercent(Number(item.ActInvestRate))
                        : item.showShareRate
                          ? `${item.showShareRate}%`
                          : '--'}
                    </span>
                  </div>
                ))}
              </div>
            ) : null
          }
          emptyText={emptyText}
          width={width}
          height={height}
          institutionShow={isStitution}
          {...props}
          data-uc-id="WmXQf09pB"
          data-uc-ct="windbdgraph"
          maxPath={20}
        />
      ) : null}
    </>
  )
}

export default CtrlGraph
