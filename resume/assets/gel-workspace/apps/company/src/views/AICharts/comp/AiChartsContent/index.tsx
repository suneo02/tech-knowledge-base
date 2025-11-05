import React, { useState } from 'react'
import { Layout, Resizer } from '@wind/wind-ui'
import AIChartsLeft from '../AiChartsLeft'
import AIChartsRight from '../AiChartsRight'
import styles from './index.module.less'
import { useAIGraph } from '../../context'

const { Content, Sider } = Layout

/**
 * @description AI图谱内容组件
 * @author bcheng<bcheng@wind.com.cn>
 */
const AIChartsContent = () => {
    const [resizeWidth, setResizeWidth] = useState(552)
    const handleResize = (e, { deltaX }) => {
        setResizeWidth(resizeWidth + deltaX)
    }

    return (
        // @ts-ignore
        <Layout className={styles.aiChartsContent}>
            <>
                {/* @ts-ignore */}
                <Sider className={styles.aiChartsLeft} width={resizeWidth} style={{ height: '100%' }}>
                    <AIChartsLeft />
                </Sider>
                <Resizer unfoldedSize={290} onResize={handleResize} defaultFolded={false} />
            </>
            {/* @ts-ignore */}
            <Content className="" style={{ position: 'relative', height: '100%', overflowY: 'auto' }}>
                <AIChartsRight />
            </Content>
        </Layout>
    )
}

export default AIChartsContent