import { t } from 'gel-util/intl'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import './TextLoading.less'
// 定义步骤类型接口
interface Step {
  text: string
  delay?: number
}

// 定义组件属性接口
interface TextLoadingProps {
  steps?: Step | Step[]
  onLoaded?: () => void
}

const stepLineHeight = 32 // 滚动文本的行高

// 生成随机时间间隔 (1000ms ~ 3000ms)
const getRandomDuration = () => Math.floor(Math.random() * 2000) + 1000

const defaultSteps = [
  { text: t('421484', '正在分析您的问题...') },
  { text: t('421591', '正在连接%查询数据...').replace('%', '万得企业库') },
]

const TextLoading: React.FC<TextLoadingProps> = ({ steps, onLoaded }) => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const stepsRef = useRef<Step[]>([])
  const currentIndexRef = useRef<number>(0)
  const [transY, setTransY] = useState<number>(0)
  const [stepList, setStepList] = useState<Step[]>(defaultSteps)

  useEffect(() => {
    // 更新内部步骤引用
    stepsRef.current = [...stepList]

    const startTimer = () => {
      const nextStep = () => {
        // 检查是否还有未显示的步骤
        if (currentIndexRef.current < stepsRef.current.length - 1) {
          const nextIndex = currentIndexRef.current + 1
          const step = stepsRef.current[nextIndex]

          if (step && step.text) {
            // 如果步骤有延迟，减少延迟计数
            if (step.delay) {
              stepsRef.current[nextIndex] = { ...step, delay: step.delay - 1 }
            } else {
              // 更新当前显示的步骤索引并滚动视图
              currentIndexRef.current = nextIndex
              setTransY(-nextIndex * stepLineHeight)
            }
          }

          // 设置下一步骤的定时器
          timer.current = setTimeout(nextStep, getRandomDuration())
        } else {
          // 当前所有步骤都已显示，但保持监听以等待新步骤
          timer.current = setTimeout(() => {
            // 再次检查是否有新步骤添加
            if (currentIndexRef.current < stepsRef.current.length - 1) {
              nextStep()
            } else {
              // 持续轮询检查新步骤
              timer.current = setTimeout(nextStep, 1000)
            }
          }, 1000)
        }
      }

      // 启动第一个步骤的定时器
      timer.current = setTimeout(nextStep, getRandomDuration())
    }

    // 如果定时器未启动，则启动定时器
    if (!timer.current) {
      startTimer()
    }

    // 组件卸载或依赖变化时清除定时器
    return () => {
      if (timer.current) {
        clearTimeout(timer.current)
        timer.current = null
      }
    }
  }, [stepList, onLoaded])

  // 组件卸载时的清理工作
  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current)
        timer.current = null
      }
      setStepList([])
      currentIndexRef.current = 0
    }
  }, [])

  // 添加新步骤的函数
  const appendSteps = useCallback((steps: Step | Step[]) => {
    setStepList((current) => {
      if (!Array.isArray(steps)) {
        steps = [steps]
      }
      return [...current, ...steps]
    })
  }, [])

  // 当接收到新的steps属性时，添加到步骤列表
  useEffect(() => {
    if (steps) {
      if (Array.isArray(steps)) {
        appendSteps(steps)
      } else {
        appendSteps([steps])
      }
    }
  }, [steps, appendSteps])

  return (
    <div className="typist-wrap no-steps">
      <div className="typist-inner" style={{ transform: `translateY(${transY}px)` }}>
        {stepList
          .filter((item) => !!item)
          .map(({ text: stepText }, index) => (
            <div className="ellipsis" key={`${stepText}-${index}`}>
              {stepText}
            </div>
          ))}
      </div>
    </div>
  )
}

export default TextLoading
