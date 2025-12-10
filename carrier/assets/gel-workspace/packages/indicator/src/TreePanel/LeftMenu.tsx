import { Menu } from '@wind/wind-ui'
import { IndicatorTreeClassification } from 'gel-api'
import { useCallback } from 'react'
import styles from './style/leftMenu.module.less'
export const IndicatorLeftMenu: React.FC<{
  selectedFirstLevel: string
  setSelectedFirstLevel: (key: string) => void
  data: IndicatorTreeClassification[]
}> = ({ selectedFirstLevel, setSelectedFirstLevel, data }) => {
  const handleMenuSelect = useCallback(
    ({ key }: { key: string }) => {
      setSelectedFirstLevel(key)
    },
    [setSelectedFirstLevel]
  )

  return (
    // @ts-expect-error wind-ui
    <Menu className={styles.menu} mode="vertical" selectedKeys={[selectedFirstLevel]} onSelect={handleMenuSelect}>
      {data.map((item) => (
        <Menu.Item key={item.key.toString()}>{item.title}</Menu.Item>
      ))}
    </Menu>
  )
}
