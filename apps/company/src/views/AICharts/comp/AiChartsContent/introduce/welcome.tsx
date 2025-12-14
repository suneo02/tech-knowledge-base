import React from 'react'
import alice from '@/assets/icons/icon-alice.png'
import { aliceChatHi } from '@/assets/gif'
import styles from './index.module.less'
import { t } from 'gel-util/intl'
import { MyIcon } from '@/components/Icon'
import { AI_GRAPH_TYPE } from '@/views/AICharts/contansts'

const list = [
  {
    title: t('', '供应链探查'),
    description: t('', '一键洞察企业供应链脉络，图谱清晰展现关键环节'),
    key: 'ai_graph_supply_chain',
    type: AI_GRAPH_TYPE.AI_GRAPH_SUPPLY_CHAIN,
  },
  {
    title: t('', '客户群探查'),
    description: t('', '深度挖掘客户结构，图谱直观揭示客户分布与关联'),
    key: 'ai_graph_customers',
    type: AI_GRAPH_TYPE.AI_GRAPH_CUSTOMERS,
  },
  {
    title: t('', '竞争对手探查'),
    description: t('', '快速锁定竞争对手格局，图谱助力精准决策'),
    key: 'ai_graph_competitors',
    type: AI_GRAPH_TYPE.AI_GRAPH_COMPETITORS,
  },
  {
    title: t('', 'Markdown文本生成图谱'),
    description: t('', '让你的笔记一秒变关系图谱，内容高效可视化'),
    key: 'ai_graph_markdown',
    type: AI_GRAPH_TYPE.AI_GRAPH_MARKDOWN,
  },
  {
    title: t('', '导入Excel生成图谱'),
    description: t('', '将数据表变身智能图谱，复杂关系一目了然'),
    key: 'ai_graph_excel',
    type: AI_GRAPH_TYPE.AI_GRAPH_EXCEL,
  },
]

const AiChartsExcelWelcome = (props) => {
  const { handleCardClick } = props
  return (
    <div>
      <div className={styles.graphChatHi}>
        <div className={styles.graphChatHiLogo}>
          <img className={styles.graphChatHiLogoImg} src={alice} alt="aliceChatLogo" />
        </div>
        <div className={styles.graphChatHiContent}>
          <img className={styles.graphChatHiContentImg} src={aliceChatHi} alt="aliceChatHi" />
          <div className={styles.graphChatHiContentText}>
            <span>{t('', '我是 ')}</span>
            {/* <span className={styles.graphChatHiContentTextImg}>{t('', '图谱智能生成助手')}</span> */}
            <MyIcon name="aiGraphHiAlice" className={styles.graphChatHiContentTextImg} />
            <span>{t('', '，帮您自动梳理企业各类数据，轻松生成可视化关系图谱，助力观察与决策！')}</span>
          </div>
        </div>
      </div>

      <div className={styles.cardList}>
        {list.map((l) => {
          return (
            <div key={l.key} className={styles.card} onClick={() => handleCardClick(l.type)}>
              <MyIcon name={l.key} className={styles.cardIcon} />
              <div className={styles.right}>
                <div className={styles.title}>{l.title}</div>
                <div className={styles.description}>{l.description}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AiChartsExcelWelcome
