import React from 'react'
import { Tabs as WindTabs } from '@wind/wind-ui'
import { TabsSafe } from '@/components/windUISafe'
import AIChartsExcel from '../AiChartsExcel'
import AIChartsGraph from '../AiChartsGraph'
import { useAIGraph } from '../../context'
import AIChartsUpload from '../AiChartsUpload'
import { useAIChartData } from '../../hooks/useChartData'
const TabPane = WindTabs.TabPane;

/**
 * @description AI图谱右侧内容组件
 * @author bcheng<bcheng@wind.com.cn>
 */
const AIChartsRight = () => {

    const { chatId, historyChatId } = useAIChartData()

    return (
        <>
            <TabsSafe defaultActiveKey="1">
                {/* @ts-expect-error wind-ui */}
                <TabPane tab="数据" key="1">
                    <AIChartsExcel />
                </TabPane>
                {/* @ts-expect-error wind-ui */}
                <TabPane tab="图谱" disabled={!chatId && !historyChatId} key="2">
                    <AIChartsGraph />
                </TabPane>
                {/* <TabPane tab="上传" key="3">
                    <AIChartsUpload />
                </TabPane> */}

            </TabsSafe>
        </>
    )
}

export default AIChartsRight