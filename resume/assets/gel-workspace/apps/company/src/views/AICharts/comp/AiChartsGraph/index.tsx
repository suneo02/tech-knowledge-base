import React, { useState, useEffect, useRef, useCallback } from 'react'
import ChartContent from '@/views/Charts/comp/chartContent'
import { GRAPH_MENU_TYPE } from '@/views/Charts/comp/constants'
import OperatorRight from '@/views/Charts/comp/operatorRight'
import { useAIGraph } from '../../context'
import { useAIChartData } from '../../hooks/useChartData'
import WindBDGraph from '@wind/Wind.Base.Enterprise.Graph'
import '@wind/Wind.Base.Enterprise.Graph/lib/index.css'
import SpinLoading from '@/views/Charts/comp/spin-loading'


const AIChartsGraph = () => {

    const { companyCode, companyName } = useAIGraph()
    const [menu, setMenu] = useState({ type: GRAPH_MENU_TYPE.ACTUAL_CONTROLLER, title: '实控人图' })
    const [actions, setActions] = useState({
        triggerSave: 0,
        triggerRefresh: 0,
        triggerLarge: 0,
        triggerSmall: 0,
        zoomFactor: 1,
        onZoom: (scale: number) => {
            setActions((prev) => ({ ...prev, zoomFactor: scale }))
        },
    })
    const [waterMask, setWaterMask] = useState(true)
    const [menuCollapsed, setMenuCollapsed] = useState(false)

    const { fetching, setFetching, chatData, setChatData } = useAIChartData()
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

    const [config, setConfig] = useState(null)
    const containerRef = useRef(null)

    useEffect(() => {
        if (chatData?.config) {
            const configJson = JSON.parse(chatData?.config)
            if (configJson?.type === 'dagre') {
                configJson.type = 'detach'
            }
            setConfig(configJson)
        }
    }, [chatData])

    // 更新尺寸的函数
    const updateDimensions = useCallback(() => {
        // 使用setTimeout确保在DOM更新后获取新的尺寸
        setTimeout(() => {
            if (containerRef.current) {
                const { offsetWidth, offsetHeight } = containerRef.current
                console.log('offsetWidth after menu collapse:', offsetWidth)
                console.log('offsetHeight after menu collapse:', offsetHeight)
                setDimensions({
                    width: offsetWidth,
                    height: offsetHeight,
                })
            }
        }, 100) // 100ms延迟确保DOM已更新
    }, [])

    // 初始化和尺寸变化时更新
    useEffect(() => {
        // 初始获取尺寸
        updateDimensions()

        // 监听窗口大小变化
        window.addEventListener('resize', updateDimensions)

        // 清理函数
        return () => {
            window.removeEventListener('resize', updateDimensions)
        }
    }, [updateDimensions])


    return (
        <div style={{ width: '100%', height: '100vh' }} ref={containerRef}>

            {fetching ? <SpinLoading /> :
                <WindBDGraph
                    config={config}
                    width={dimensions.width}
                    height={dimensions.height}
                    data={chatData?.relations ? chatData : null}
                />
            }

            {/* <OperatorRight
                menu={menu}
                onOperatorAction={() => { }}
            /> */}
            {/* <ChartContent companyCode={companyCode} actions={actions} waterMask={waterMask} menu={menu} companyName={companyName} linkSourceRIME={false} menuCollapsed={menuCollapsed} /> */}

        </div>
    )
}

export default AIChartsGraph
