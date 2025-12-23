import { useEffect, useState } from 'react'
import MainContent from './ApplyModal'

export default function ApplyModal() {
  const [modalVisible, setModalVisible] = useState(false)

  function applyAccountEventHandler(e) {
    setModalVisible(true)
  }

  useEffect(() => {
    document.addEventListener('apply_account', applyAccountEventHandler)

    return () => {
      document.removeEventListener('apply_account', applyAccountEventHandler)
    }
  }, [])

  return (
    <MainContent
      visible={modalVisible}
      onCancel={() => setModalVisible(false)}
      maskClosable={false}
      data-uc-id="XNfhAeJhs7W"
      data-uc-ct="maincontent"
    ></MainContent>
  )
}
