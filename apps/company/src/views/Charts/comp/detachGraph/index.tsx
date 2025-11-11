import WindBDGraph from '@wind/Wind.Base.Enterprise.Graph'
import React, { useState, useEffect, useRef } from 'react'
import { getWindBDGraphData } from '@/api/graph'
import { Button, message, Spin } from '@wind/wind-ui'
import intl from '@/utils/intl'
import { Layout, Resizer } from '@wind/wind-ui'
import './index.less'
import PreInput from '@/components/common/search/PreInput'
import demoImg from '@/assets/imgs/detach.jpg'
import demoImgMulti from '@/assets/imgs/detach_multi.jpg'
import demoEnImg from '@/assets/imgs/detachEn.jpg'
import demoEnImgMulti from '@/assets/imgs/detachMultiEn.jpg'
import { parseQueryString } from '@/lib/utils'
import { MinusCircleO, PlusO } from '@wind/icons'
import { DetachGraphProps, MulitListItem } from './type'
import { exampleCodesOneMulti, exampleCodesTwoMulti, exampleCodesOne, exampleCodesTwo } from './extra'
import SpinLoading from '../spin-loading'
import { translateGraphData } from '../extra'
import global from '@/lib/global'
import { VipPopup } from '@/lib/globalModal'
import { pointBuriedByModule } from '@/api/pointBuried/bury'
import { GRAPH_MENU_TYPE } from '../../types'

const { Content, Sider } = Layout

const DetachGraph: React.FC<DetachGraphProps> = ({
  companyCode,
  waterMask,
  config,
  saveImgName,
  width,
  height,
  apiParams,
  graphMenuType,
  linkSourceRIME = false,
  enableFit = true,
  ...props
}) => {
  const isMulti = graphMenuType === GRAPH_MENU_TYPE.MULTI_TO_ONE // 多对一
  const isFirstRender = useRef(true) // 用于区分url进来后的首次渲染
  const qsParam = parseQueryString()
  // 从url带入的左右企业
  const leftUrlCode = isMulti
    ? qsParam?.companycode && qsParam?.companyname
      ? {
          id: qsParam.companycode?.length === 15 ? qsParam.companycode.substr(2, 10) : qsParam.companycode,
          name: qsParam?.companyname ? decodeURIComponent(qsParam?.companyname) : '',
        }
      : null
    : qsParam?.lc && qsParam?.lcn
      ? {
          id: qsParam.lc?.length === 15 ? qsParam.lc.substr(2, 10) : qsParam.lc,
          name: qsParam?.lcn ? decodeURIComponent(qsParam?.lcn?.replace(/\+/g, ' ')) : '',
        }
      : null
  const rightUrlCode =
    qsParam?.rc && qsParam?.rcn
      ? {
          id: qsParam.rc?.length === 15 ? qsParam.rc.substr(2, 10) : qsParam.rc,
          name: qsParam?.rcn ? decodeURIComponent(qsParam?.rcn?.replace(/\+/g, ' ')) : '',
        }
      : null
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [resizeWidth, setResizeWidth] = useState(290)
  const [showSlide, setShowSlide] = useState(true)
  const [showDemo, setShowDemo] = useState(true)
  const [companyInfo, setCompanyInfo] = useState(leftUrlCode)
  const [companyInfoRight, setCompanyInfoRight] = useState(rightUrlCode)
  const [mulitList, setMulitList] = useState<MulitListItem[]>(
    rightUrlCode
      ? [{ ...rightUrlCode, key: Date.now() }]
      : [
          {
            id: '',
            name: '',
            key: Date.now(),
          },
        ]
  )
  const [inputKey, setInputKey] = useState(Date.now()) // 添加 inputKey 状态
  const [isDemoClicked, setIsDemoClicked] = useState(false)
  const [noFoundNodes, setNoFoundNodes] = useState([])
  const preInputRefLeft = useRef(null)
  const preInputRefRight = useRef(null)

  const demoImgUrlCn = isMulti ? demoImgMulti : demoImg
  const demoImgUrlEn = isMulti ? demoEnImgMulti : demoEnImg
  const demoImgUrl = window.en_access_config ? demoImgUrlEn : demoImgUrlCn

  const createMulitListItem = (id = '', name = ''): MulitListItem => ({
    id,
    name,
    key: Date.now() + Math.random(),
  })

  useEffect(() => {
    if (leftUrlCode?.id && rightUrlCode?.id && !data) {
      setShowDemo(false)
      getData()
    }
  }, [leftUrlCode?.id, rightUrlCode?.id])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    // 非首次加载时才重置状态
    setData(null)
    setLoading(false)
    setShowDemo(true)
    setCompanyInfo(null)
    !isMulti && setCompanyInfoRight(null)
    isMulti &&
      setMulitList([
        {
          id: '',
          name: '',
          key: Date.now(),
        },
      ])
    // 更新 inputKey 以强制重新渲染输入框
    setInputKey(Date.now())

    if (isMulti) {
      // 多对一埋点
      pointBuriedByModule(922602101005)
    } else {
      // 查关系埋点
      pointBuriedByModule(922602100990)
    }
  }, [graphMenuType])

  useEffect(() => {
    if (isDemoClicked) {
      getData()
      setIsDemoClicked(false)
    }
  }, [isDemoClicked])

  async function getData() {
    const mainEntity = isMulti
      ? mulitList
          .map((item) => {
            if (!item?.id) {
              return null
            }
            return {
              entityId: item.id,
              entityType: 'company' as const,
            }
          })
          .filter((item) => item !== null)
      : [
          {
            entityId: companyInfoRight?.id,
            entityType: 'company' as const,
          },
        ]
    apiParams.mainEntity = mainEntity
    apiParams.subEntity = {
      entityId: companyInfo?.id,
      entityType: 'company' as const,
    }
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
      // 处理特殊情况：担保关系
      res.Data?.relations?.map((t) => {
        if (t?.relationshipType === 'guarantee') {
          t.relationshipType = intl('27494', '担保')
        }
      })
      let finalData = res.Data
      if (window.en_access_config) {
        finalData = await translateGraphData(res.Data)
      }

      setData(finalData)

      isMulti && noFoundNodesSet(finalData?.nodeInfo)
    } catch (err) {
      setData({})
    } finally {
      setLoading(false)
    }
  }

  const noFoundNodesSet = (data) => {
    const endNodes = data?.endNodes || []
    const noFoundNodesName = []
    mulitList.forEach((item) => {
      if (item.id) {
        const foundNode = endNodes.find((endNode) => endNode.nodeId === item.id)
        if (!foundNode) {
          noFoundNodesName.push(item.name)
        }
      }
    })
    setNoFoundNodes(noFoundNodesName)
  }

  const handleResize = (e, { deltaX }) => {
    setResizeWidth(resizeWidth + deltaX)
    setShowSlide(!showSlide)
  }

  const onSearch = () => {
    if (isMulti) {
      if (!companyInfo?.id) {
        preInputRefLeft?.current?.focus()
        message.error(intl('417238', '请选择触达目标企业'))
        return
      }
      if (mulitList.length === 0) {
        message.error(intl('417239', '请选择触达关联企业'))
        return
      }
      if (mulitList.length === 1 && !mulitList[0].id) {
        message.error(intl('417239', '请选择触达关联企业'))
        return
      }
      pointBuriedByModule(922602101006)
    } else {
      if (!companyInfo?.id || !companyInfoRight?.id) {
        message.error(intl('416944', '请选择一个企业'))
        if (!companyInfo?.id) {
          preInputRefLeft?.current?.focus()
        } else {
          preInputRefRight?.current?.focus()
        }
        return
      }
      pointBuriedByModule(922602100991)
    }
    showDemo && setShowDemo(false)
    getData()
  }

  const onDemoSearch = () => {
    if (isMulti) {
      setCompanyInfo(exampleCodesOneMulti[0])
      setMulitList(exampleCodesTwoMulti)
    } else {
      setCompanyInfo(exampleCodesTwo[0])
      setCompanyInfoRight(exampleCodesTwo[1])
    }
    setShowDemo(false)
    setIsDemoClicked(true)
  }

  return (
    <div className={`detach-graph-container ${showSlide ? 'detach-graph-container-slide' : ''}`}>
      {/* @ts-ignore */}
      <Layout>
        <>
          {/* @ts-ignore */}
          <Sider width={resizeWidth}>
            <div className="detach-graph-left-title">
              {isMulti ? intl('422045', '多对一触达') : intl('422046', '查关系')}
            </div>
            <div className="detach-graph-left-content">
              <div className="detach-graph-left-content-item">
                <div className="detach-graph-left-content-title">
                  {isMulti ? intl('437662', '触达目标企业') : intl('440314', '主体') + 1}
                </div>
                <PreInput
                  ref={preInputRefLeft}
                  key={`company-input-${inputKey}`}
                  needRealCode={true}
                  type="text"
                  placeholder={intl('315909', '请输入公司名称')}
                  className="input-search-relation"
                  defaultValue={companyInfo?.name}
                  width={'100%'}
                  style={{
                    display: 'inline-block',
                  }}
                  autocomplete="off"
                  maxlength="32"
                  selectItem={(t) => {
                    setCompanyInfo({
                      name: t.name,
                      id: t?.id,
                    })
                  }}
                  emptyCallback={() => {
                    setCompanyInfo(null)
                  }}
                />
              </div>
              <div className={`detach-graph-left-content-item ${isMulti ? 'detach-graph-left-content-item-max' : ''}`}>
                <div className="detach-graph-left-content-title">
                  {isMulti ? intl('440316', '我的关联企业') : intl('440314', '主体') + 2}
                  {isMulti && <span>（{intl('440317', '最多选择10家')}）</span>}
                </div>

                {/* 普通查关系 */}
                {!isMulti && (
                  <PreInput
                    ref={preInputRefRight}
                    key={`company-right-input-${inputKey}`}
                    needRealCode={true}
                    type="text"
                    defaultValue={companyInfoRight?.name}
                    placeholder={intl('315909', '请输入公司名称')}
                    className="input-search-relation"
                    width={'100%'}
                    style={{
                      display: 'inline-block',
                    }}
                    autocomplete="off"
                    maxlength="32"
                    selectItem={(t) => {
                      setCompanyInfoRight({
                        name: t.name,
                        id: t?.id,
                      })
                    }}
                    emptyCallback={() => {
                      setCompanyInfoRight(null)
                    }}
                  />
                )}

                {/* 多对一触达 */}
                {isMulti &&
                  mulitList?.length &&
                  mulitList.map((item) => (
                    <div
                      key={item.key}
                      className={` detach-graph-left-content-multi 
                        ${mulitList?.length <= 1 ? 'detach-graph-left-content-multi-single' : ''}  `}
                    >
                      <PreInput
                        key={`company-multi-input-${inputKey}-${item.key}`}
                        needRealCode={true}
                        type="text"
                        defaultValue={item.name}
                        placeholder={intl('315909', '请输入公司名称')}
                        className="input-search-relation"
                        width={isMulti ? 'calc(100% - 20px)' : '100%'}
                        style={{
                          display: 'inline-block',
                        }}
                        autocomplete="off"
                        maxlength="32"
                        selectItem={(t) => {
                          const newList = mulitList.map((listItem) =>
                            listItem.key === item.key ? { ...listItem, name: t.name, id: t?.id } : listItem
                          )
                          setMulitList(newList)
                        }}
                        emptyCallback={() => {
                          setCompanyInfo(null)
                        }}
                      />
                      <MinusCircleO
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                        onClick={() => {
                          if (mulitList?.length <= 1) {
                            return
                          }
                          setMulitList(mulitList.filter((listItem) => listItem.key !== item.key))
                        }}
                        data-uc-id="aLm02j_Au"
                        data-uc-ct="minuscircleo"
                      />
                    </div>
                  ))}
              </div>

              {isMulti && (
                <div
                  className={`detach-graph-left-content-add ${mulitList.length >= 10 ? 'detach-graph-left-content-add-disabled' : ''}`}
                  onClick={() => {
                    if (mulitList.length >= 10) {
                      return
                    }
                    if (mulitList.find((item) => item.id === '')) {
                      message.error(intl('', '请先完成上一个关联企业选择'))
                      return
                    }
                    setMulitList([...mulitList, createMulitListItem()])
                  }}
                  data-uc-id="QegJYdy2M9"
                  data-uc-ct="div"
                >
                  <PlusO
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    data-uc-id="Y_5FeV5qUo"
                    data-uc-ct="pluso"
                  />
                  <span>{intl('440318', '添加我的关联企业')}</span>
                </div>
              )}

              <Button onClick={onSearch} className="detach-graph-left-btn" data-uc-id="ET1MQH0pWG" data-uc-ct="button">
                {isMulti ? intl('437664', '查触达路径') : intl('437668', '关系透查')}
              </Button>
            </div>
          </Sider>
          <Resizer
            unfoldedSize={290}
            onResize={handleResize}
            defaultFolded={false}
            data-uc-id="rcrv7Ivz7_"
            data-uc-ct="resizer"
          />
        </>
        {/* @ts-ignore */}
        <Content className="" style={{ position: 'relative' }}>
          {showDemo && (
            <div className="detach-graph-right-demo" onClick={onDemoSearch} data-uc-id="AAut8rwxRV" data-uc-ct="div">
              <div className="detach-graph-right-demo-title">
                <div>
                  {isMulti
                    ? intl('437149', '深度探寻我的关系企业与触达目标企业之间的最短触达路径')
                    : intl('417234', '深度探寻任意两个企业之间的关联关系')}
                </div>
                <span>{intl('437665', '点击查看样例')}</span>
              </div>
              <img src={demoImgUrl} alt="detach-graph-right-demo" />
            </div>
          )}

          {!showDemo && (
            <>
              {loading && <SpinLoading />}
              {!loading && data ? (
                <WindBDGraph
                  config={config}
                  data={data?.relations ? data : null}
                  waterMask={waterMask}
                  saveImgName={saveImgName}
                  emptyText={intl('421499', '暂无数据')}
                  width={width - resizeWidth}
                  height={height}
                  enableFit={enableFit}
                  {...props}
                  data-uc-id="x2WZYLhaBY"
                  data-uc-ct="windbdgraph"
                ></WindBDGraph>
              ) : null}

              {!loading && data?.relations && data?.relations?.length && isMulti && noFoundNodes.length ? (
                <div className="chart-graph-nofound">
                  {noFoundNodes.map((t, idx) => {
                    return (
                      <span>
                        {idx ? '、' : ''}
                        {t}
                      </span>
                    )
                  })}
                  {noFoundNodes.length > 1 ? noFoundNodes.length + ('' + intl('138213', '家企业')) : ''}{' '}
                  {intl('437676', '未找到最短路径')}
                </div>
              ) : null}

              {!loading && data?.relations && (
                <div className="chart-graph-bottom">
                  {intl('437654', '计算结果基于公开信息和第三方数据利用大数据技术独家计算生成')}
                </div>
              )}
            </>
          )}
        </Content>
      </Layout>
    </div>
  )
}

export default DetachGraph
