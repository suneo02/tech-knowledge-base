import styles from '../style/listConform.module.less'
import { CompanyCountStats } from './handle'

interface MatchStatsDisplayProps {
  cnNum: number
  hongkongNum: number
  twNum: number
  errNum: number
  isEn: boolean
}

// 新的接口，支持使用计数对象
interface MatchStatsDisplayWithCountStatsProps {
  countStats: CompanyCountStats
}

/**
 * Component to display statistics about matched companies
 */
const MatchStatsDisplay = ({ cnNum, hongkongNum, twNum, errNum, isEn }: MatchStatsDisplayProps) => {
  return isEn ? (
    <span>
      <span className={styles['list-confirm--text-black']}>{cnNum}</span>
      {' Mainland Enterprise(s) Matched, '}
      <span className={styles['list-confirm--text-black']}>{hongkongNum}</span>
      {' Hong Kong Enterprise(s) Matched,'}
      <span className={styles['list-confirm--text-black']}>{twNum}</span>
      {' Taiwan Enterprise(s) Matched,'}
      <span className={styles['list-confirm--text-red']}>{errNum}</span>
      {' Enterprise(s) Unmatched'}
    </span>
  ) : (
    <span>
      {'匹配成功 '}
      <span className={styles['list-confirm--text-black']}>{cnNum}</span>
      {' 家大陆企业，匹配成功 '}
      <span className={styles['list-confirm--text-black']}>{hongkongNum}</span>
      {' 家香港企业，匹配成功 '}
      <span className={styles['list-confirm--text-black']}>{twNum}</span>
      {' 家台湾企业，匹配失败 '}
      <span className={styles['list-confirm--text-red']}>{errNum}</span>
      {' 家企业'}
    </span>
  )
}

/**
 * 使用计数对象的统计显示组件
 */
export const MatchStatsDisplayWithCountStats = ({
  countStats,
  isEn,
}: MatchStatsDisplayWithCountStatsProps & {
  isEn: boolean
}) => {
  const { cnNum, hongkongNum, twNum, errNum } = countStats
  return <MatchStatsDisplay cnNum={cnNum} hongkongNum={hongkongNum} twNum={twNum} errNum={errNum} isEn={isEn} />
}

export default MatchStatsDisplay
