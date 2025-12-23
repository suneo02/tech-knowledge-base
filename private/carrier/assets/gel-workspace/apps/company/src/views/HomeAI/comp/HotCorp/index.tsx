import { getCompanyHotView } from '@/api/searchListApi'
import { Links } from '@/components/common/links'
import { LinksModule } from '@/handle/link'
import { wftCommon } from '@/utils/utils'
import { t } from 'gel-util/intl'
import React, { useEffect, useState } from 'react'
import styles from './style.module.less'

/**
 * HotCop - 热门浏览企业组件
 * 展示热门浏览企业，取接口返回的前三个企业，横向排列，顿号分割
 */

const intlMap = {
  hotCorp: t('455537', '热门企业'),
}

export const HotCorp: React.FC = () => {
  // 热门企业列表
  const [hotList, setHotList] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(false)
  const Num = 5 // 只取前三个
  // 获取热门企业数据
  const getHotList = async () => {
    setLoading(true)
    try {
      const { Data } = await getCompanyHotView()
      if (window.en_access_config) {
        wftCommon.zh2en(Data, (endata) => {
          // 只取前三个
          setHotList(endata?.slice(0, Num) || [])
        })
      } else {
        if (Data?.length) {
          // 只取前三个
          setHotList(Data.slice(0, Num) || [])
        }
      }
    } catch (error) {
      console.error('Failed to fetch hot companies:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getHotList()
  }, [])

  if (loading || hotList.length === 0) {
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>{intlMap.hotCorp}：</div>
      <div className={styles.content}>
        {hotList.map((item, index) => (
          <React.Fragment key={item.id}>
            <Links module={LinksModule.COMPANY} id={item.id} title={item.name} className={styles.link} />
            {index < hotList.length - 1 && <span>、</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
