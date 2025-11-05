import React from 'react'
import { Switch } from '@wind/wind-ui'
import { Form } from 'antd' // Form.Item is used for layout consistency with Home.tsx
import { CoinsIcon } from '@/assets/icon'
import styles from './index.module.less'

const STRINGS = {
  LIMITED_FREE_TAG: '限时免费',
}

// Define SuperListTool interface based on index.json and Home.tsx usage
export interface SuperListTool {
  key: string
  name: string
  credits: number
  description: string
}

interface ToolsDisplayProps {
  toolsData: SuperListTool[]
  values: { [key: string]: boolean | undefined } // e.g., { enableLinkTool: true, ... }
  isEditable: boolean
  onToolToggle?: (toolKey: string, enabled: boolean) => void
}

const PREFIX = 'tools-display'

export const ToolsDisplay: React.FC<ToolsDisplayProps> = ({ toolsData, values, isEditable, onToolToggle }) => {
  return (
    <>
      {toolsData.map((tool) => (
        <div key={tool.key} className={styles[`${PREFIX}-tool-item`]}>
          <div className={styles[`${PREFIX}-tool-header`]}>
            <div className={styles[`${PREFIX}-tool-info`]}>
              <span className={styles[`${PREFIX}-tool-name`]}>{tool.name}</span>
              {tool.credits > 0 ? (
                <span className={styles[`${PREFIX}-tool-credits`]}>
                  <CoinsIcon style={{ width: 16, height: 16, marginInlineStart: 8, marginInlineEnd: 4 }} />
                  {tool.credits}
                </span>
              ) : (
                <span className={styles[`${PREFIX}-limited-free-tag`]}>{STRINGS.LIMITED_FREE_TAG}</span>
              )}
            </div>
            {isEditable ? (
              <Form.Item
                name={tool.key} // name prop for Antd Form.Item, though not strictly form-controlled here externally for Home
                className={styles[`${PREFIX}-switch-form-item`]}
                valuePropName="checked" // Important for Switch with Form.Item
              >
                <Switch
                  size="small"
                  checked={!!values[tool.key]}
                  onChange={(checked) => onToolToggle && onToolToggle(tool.key, checked)}
                />
              </Form.Item>
            ) : (
              // Read-only display: show the Switch but disabled
              <Switch size="small" checked={!!values[tool.key]} disabled />
            )}
          </div>
          <div className={styles[`${PREFIX}-tool-description`]}>{tool.description}</div>
        </div>
      ))}
    </>
  )
}
