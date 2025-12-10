import styles from './index.module.less'
import { flattenTree, getIndustryTreeByField } from '@/pages/SuperChat/CDE/utils/cascadeUtils'

const PREFIX = 'cascade-display'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CascadeDisplay = ({ value, field }: { value: any; field?: string }) => {
  const options = getIndustryTreeByField(field)
  const allNodes = flattenTree(options)
  const selectedNodes = allNodes.filter((item) => value?.value?.includes(item.value))

  return (
    <div className={styles[`${PREFIX}-container`]}>
      {selectedNodes.map((item) => (
        <div key={item.value} className={styles[`${PREFIX}-item`]}>
          {item.label}
        </div>
      ))}
    </div>
  )
}

export default CascadeDisplay
