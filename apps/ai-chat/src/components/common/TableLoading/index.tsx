import { LoadingO } from '@wind/icons'
import { t } from 'gel-util/intl'
import React, { useEffect, useState } from 'react'
import './index.less'

interface TableLoadingProps {
  loadingText?: string
  style?: React.CSSProperties
}

const STRINGS = {
  TITLE: t('464183', '正在加载表格数据...'),
  STEPS: [
    t('', '初始化表格引擎'),
    t('', '获取数据配置'),
    t('', '加载表格数据'),
    t('', '渲染表格结构'),
    t('', '优化显示效果'),
  ],
}

const TableLoading: React.FC<TableLoadingProps> = ({ loadingText = STRINGS.TITLE, style }) => {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = STRINGS.STEPS

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100
        const newProgress = prev + Math.random() * 15

        // 根据进度更新步骤
        if (newProgress > 20 && currentStep < 1) setCurrentStep(1)
        else if (newProgress > 40 && currentStep < 2) setCurrentStep(2)
        else if (newProgress > 60 && currentStep < 3) setCurrentStep(3)
        else if (newProgress > 80 && currentStep < 4) setCurrentStep(4)

        return Math.min(newProgress, 100)
      })
    }, 200)

    return () => clearInterval(timer)
  }, [currentStep])

  return (
    <div className="table-loading-container" style={style}>
      {/* 背景动画 */}
      {/* <div className="loading-background">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
      </div> */}

      {/* 主要内容 */}
      <div className="loading-content">
        {/* Logo 和标题 */}
        <div className="loading-header">
          <div className="loading-icon">
            <div className="table-icon">
              <div className="table-row">
                <div className="table-cell active"></div>
                <div className="table-cell"></div>
                <div className="table-cell"></div>
                <div className="table-cell"></div>
              </div>
              <div className="table-row">
                <div className="table-cell"></div>
                <div className="table-cell active"></div>
                <div className="table-cell"></div>
                <div className="table-cell"></div>
              </div>
              <div className="table-row">
                <div className="table-cell"></div>
                <div className="table-cell"></div>
                <div className="table-cell active"></div>
                <div className="table-cell"></div>
              </div>
              <div className="table-row">
                <div className="table-cell"></div>
                <div className="table-cell"></div>
                <div className="table-cell"></div>
                <div className="table-cell active"></div>
              </div>
            </div>
          </div>
          <h2 className="loading-title">{loadingText}</h2>
        </div>

        {/* 进度条 */}
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}>
              <div className="progress-shine"></div>
            </div>
          </div>
        </div>

        {/* 步骤指示器 */}
        <div className="steps-container">
          <div className="current-step">
            <div className="step-icon">
              <LoadingO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            </div>
            <span className="step-text">{steps[currentStep]}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TableLoading
