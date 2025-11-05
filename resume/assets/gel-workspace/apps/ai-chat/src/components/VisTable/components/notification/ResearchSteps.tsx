import { Timeline } from '@wind/wind-ui'
import { ReactNode } from 'react'

interface ResearchStepsProps {
  steps: string[]
}

export const ResearchSteps = ({ steps }: ResearchStepsProps): ReactNode => {
  if (!steps || steps.length === 0) {
    return null
  }

  return (
    <div
      style={{
        marginBlockStart: 12,
        backgroundColor: '#f9f9f9',
        padding: '12px 12px 0',
        borderRadius: 4,
        width: '100%',
      }}
    >
      <h4>研究步骤</h4>
      <div style={{ marginBlockStart: 12 }}>
        <Timeline>
          {steps.map((step, index) => (
            // @ts-expect-error timeline.item 类型错误
            <Timeline.Item key={index} color="blue">
              {step}
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
    </div>
  )
}
