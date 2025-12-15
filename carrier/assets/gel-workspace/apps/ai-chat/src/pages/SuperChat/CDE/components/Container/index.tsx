import { ArrowLeftO, ArrowRightO } from '@wind/icons'
import cn from 'classnames'
import { useState } from 'react'
import styles from './index.module.less'
// import { Result } from '@wind/wind-ui'
import Right from '../Right'

const PREFIX = 'super-chat-cde-container'
export const Container = () => {
  const [folded, setFolded] = useState(false)
  // if (!sheetList?.length) return <Result status="404" title="表格不存在" />
  return (
    <div className={styles[`${PREFIX}-container`]}>
      <div
        className={cn(styles[`${PREFIX}-container-left`], {
          [styles[`${PREFIX}-container-left-folded`]]: folded,
        })}
      >
        {/* <Left /> */}
      </div>
      <div className={styles[`${PREFIX}-container-resizer`]} onClick={() => setFolded(!folded)}>
        <div className={styles[`${PREFIX}-container-resizer-line`]}></div>
        <div
          className={cn(styles[`${PREFIX}-container-resizer-icon`], {
            [styles[`${PREFIX}-container-resizer-icon-folded`]]: folded,
          })}
          onClick={() => setFolded(!folded)}
        >
          {/* @ts-expect-error wind-ui */}
          {folded ? <ArrowRightO /> : <ArrowLeftO />}
        </div>
      </div>
      <div className={styles[`${PREFIX}-container-right`]}>
        <Right />
      </div>
    </div>
  )
}
