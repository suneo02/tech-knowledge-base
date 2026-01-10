import { HomeContent } from '@/components/SuperList/HomeContent'
import React, { useEffect, useState } from 'react'
import styles from './index.module.less'
import { WelcomeModal } from './components/WelcomeModal'
import { t } from 'gel-util/intl'
import { useHomeTracking } from './hooks/useHomeTracking'

const SuperHome: React.FC = () => {
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false)

  useHomeTracking()

  useEffect(() => {
    document.title = t('464234', '一句话找企业')
    const welcome = localStorage.getItem('welcome')
    if (!welcome) {
      setIsWelcomeModalOpen(true)
      localStorage.setItem('welcome', 'true')
    }
  }, [])

  const handleCloseWelcomeModal = () => {
    setIsWelcomeModalOpen(false)
  }

  return (
    <div className={styles['super-home-content']}>
      <HomeContent />
      <WelcomeModal open={isWelcomeModalOpen} onClose={handleCloseWelcomeModal} />
    </div>
  )
}

export default SuperHome
