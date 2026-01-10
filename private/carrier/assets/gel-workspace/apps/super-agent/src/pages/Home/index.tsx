import { Modal, Skeleton } from '@wind/wind-ui'
import { useTitle } from 'ahooks'
import React, { useEffect, useMemo, useState } from 'react'
import { Dashboard } from '../Dashboard'
import { Introductory } from '../Introductory'
import { t } from 'gel-util/intl'
import styles from './index.module.less'
import { DebugPanel } from 'gel-ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchSplAgentTaskList, selectSplTasksLoading, selectSplTasks } from '@/store/superAgent'
import { isDev } from '@/utils/env'

const PREFIX = 'home'

export const Home: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const [firstInit, setFirstInit] = useState(false)
  console.log('🚀 ~ Home ~ firstInit:', firstInit)
  useTitle(t('222402', '超级名单'))

  const dispatch = useAppDispatch()
  const list = useAppSelector(selectSplTasks)
  const loading = useAppSelector(selectSplTasksLoading)

  useEffect(() => {
    // if (!loading && list?.length === 0) {
    //   setVisible(true)
    //   setFirstInit(true)
    // }
  }, [list, loading])

  useEffect(() => {
    dispatch(
      fetchSplAgentTaskList({
        pageNum: 1,
        pageSize: 50,
      })
    )
  }, [dispatch])

  const hasData = useMemo(() => Array.isArray(list) && list.length > 0, [list])

  useEffect(() => {
    setFirstInit(!hasData)
  }, [hasData])

  return (
    <div className={styles[`${PREFIX}-container`]}>
      {isDev && <DebugPanel />}
      {loading && <Skeleton animation />}
      <Dashboard onCTA={() => setVisible(true)} />
      {/* @ts-expect-error windUI */}
      <Modal
        visible={visible}
        width="920"
        style={{ minWidth: 920, maxWidth: 1280, width: '60vw' }}
        footer={null}
        closable={true}
        onCancel={() => setVisible(false)}
      >
        <Introductory />
      </Modal>
    </div>
  )
}
