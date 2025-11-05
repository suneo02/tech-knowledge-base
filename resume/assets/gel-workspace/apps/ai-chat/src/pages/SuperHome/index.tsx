import { HomeContent } from '@/components/SuperList/HomeContent'
import React from 'react'
import styles from './index.module.less'

const SuperHome: React.FC = () => {
  return (
    <div className={styles['super-home-content']}>
      <HomeContent />
    </div>
  )
}

export default SuperHome
