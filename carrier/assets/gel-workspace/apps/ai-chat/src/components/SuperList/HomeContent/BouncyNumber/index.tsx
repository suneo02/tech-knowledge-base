import { useSpring, animated } from 'react-spring'
import styles from './index.module.less'

interface BouncyNumberProps {
  number: number
}

const BouncyNumber = ({ number }: BouncyNumberProps) => {
  const props = useSpring({
    from: { transform: 'scale(0.5)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
    config: {
      tension: 300,
      friction: 10,
    },
    reset: true,
  })

  return (
    <animated.span style={props} className={styles.bouncyNumber}>
      {number}
    </animated.span>
  )
}

export default BouncyNumber
