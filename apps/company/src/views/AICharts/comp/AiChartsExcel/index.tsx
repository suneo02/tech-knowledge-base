import React, { useState, useEffect } from 'react'
import { Result } from '@wind/wind-ui'
import Table from '@wind/wind-ui-table'
import { getTableLocale } from '@/components/company/table/handle'
import { useAIGraph } from '../../context'
import { useChartData } from '../../hooks/useChartData'
// import graphTxt from '@/assets/imgs/chart/graphTxt.svg'
import alice from '@/assets/icons/icon-alice.png'
import { aliceChatHi } from '@/assets/gif'
import styles from './index.module.less'
import { useAIChartData } from '../../hooks/useChartData'


const ExcelEmpty = () => (
    <Result
        status={'no-data'}
        title={'暂无数据'}
        style={{ textAlign: 'center', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
    />
)

/**
 * @description AI图谱Excel数据组件
 * @author bcheng<bcheng@wind.com.cn>
 */
const AIChartsExcel = () => {
    // const { companyCode } = useAIGraph()
    // const { loading, chartData, setChartData } = useChartData(companyCode)

    const { fetching, setFetching, chatData, setChatData } = useAIChartData()
    const [ready, setReady] = useState(false)


    useEffect(() => {
        console.log('fetching', fetching)
        if (fetching) {
            setReady(true)
        }
    }, [fetching])

    const locale = getTableLocale(!fetching)

    // 将图表数据转换为表格数据
    const tableData = React.useMemo(() => {
        console.log('chatData', chatData)
        const nodes = chatData?.nodeInfo?.list
        const relations = chatData?.relations
        if (!relations) return []

        const data = relations.map((relation: any) => {
            const source = nodes.find((node: any) => node.nodeId === relation.fromNodeId)
            const target = nodes.find((node: any) => node.nodeId === relation.toNodeId)
            return {
                id: relation.id,
                source: source?.nodeName || '--',
                sourceId: source?.nodeId || '--',
                sourceType: source?.nodeType || '--',
                target: target?.nodeName || '--',
                targetId: target?.nodeId || '--',
                targetType: target?.nodeType || '--',
                value: relation.lineText || '--',
            }
        })

        return data
    }, [chatData])

    /**
     * @description 删除关系
     * @param record 当前行数据
     */
    const deleteRelation = (record: any) => {
        if (!chatData?.relations) return

        // 过滤掉要删除的关系
        const newRelations = chatData.relations.filter((relation: any) => relation.fromNodeId !== record.sourceId && relation.toNodeId !== record.targetId)

        // 更新chartData
        setChatData({
            ...chatData,
            relations: newRelations
        })
    }

    const columns = [
        {
            title: '源节点ID',
            dataIndex: 'sourceId',
            key: 'sourceId',
        },
        {
            title: '源节点名称',
            dataIndex: 'source',
            key: 'source',
        },
        {
            title: '目标节点ID',
            dataIndex: 'targetId',
            key: 'targetId',
        },
        {
            title: '目标节点名称',
            dataIndex: 'target',
            key: 'target',
        },
        {
            title: '关系描述',
            dataIndex: 'value',
            key: 'value',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text: string, record: any) => {
                return <div className={styles.aiGraphExcelDelete} onClick={() => deleteRelation(record)}>删除</div>
            }
        }
    ]

    return (
        <>
            {!ready ? <div className={styles.graphChatHi}>
                <div className={styles.graphChatHiLogo}>
                    <img className={styles.graphChatHiLogoImg} src={alice} alt="aliceChatLogo" />
                </div>
                <div className={styles.graphChatHiContent}>
                    <img className={styles.graphChatHiContentImg} src={aliceChatHi} alt="aliceChatHi" />
                    <div className={styles.graphChatHiContentText}>
                        我是你的
                        <span className={styles.graphChatHiContentTextImg}>
                            图谱智能生成助手
                        </span>
                        ，输入描述，一键生成图谱！
                    </div>
                </div>
            </div> : (!fetching && (!chatData || !chatData.relations?.length) ?
                <ExcelEmpty />
                : (
                    <div>
                        <Table
                            pagination={false}
                            columns={columns}
                            loading={fetching}
                            dataSource={tableData}
                            style={{ width: '100%' }}
                            locale={locale}
                            bordered="dotted"
                        />
                    </div>)
            )}
        </>
    )
}

export default AIChartsExcel
