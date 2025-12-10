import { Input } from '@wind/wind-ui'
import classNames from 'classnames'
import { intl } from 'gel-util/intl'
import { FC, KeyboardEvent, useState } from 'react'
import styles from './style/inputKeyWords.module.less'
import { CloseCircleF } from '@wind/icons'

/**
 * InputKeyWords 组件 - 关键词输入标签组件
 *
 * 该组件允许用户输入多个关键词，每个关键词以标签(Tag)形式展示。
 * 支持通过回车键或失焦时添加关键词，支持删除已添加的关键词。
 * 具有输入重复检查，空值过滤等功能。
 * 支持中文输入法组合输入。
 */

/**
 * InputKeyWords组件的属性接口
 */
export interface InputKeyWordsProps {
  /** 默认的关键词数组 */
  defaultValue?: string[]
  value?: string[]
  onChange?: (value: string[]) => void
  /** 自定义组件类名 */
  className?: string
}

export const InputKeyWords: FC<InputKeyWordsProps> = ({
  defaultValue = [],
  value: valueProp,
  onChange = () => null,
  className,
}) => {
  // 存储所有已添加的关键词 - 只在非受控模式下使用
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue)
  // 当前输入框中的关键词
  const [keyword, setKeyword] = useState('')

  // 使用受控值或内部状态
  const tags = valueProp !== undefined ? valueProp : internalValue
  /**
   * 处理输入框值变化
   * @param e 输入事件对象
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
  }

  /**
   * 处理键盘事件
   * 当按下回车键且不在输入法组合输入状态时，提交当前输入的关键词
   * @param e 键盘事件对象
   */
  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
    if (e.key === 'Backspace') {
      if (keyword.length === 0 && tags.length > 0) {
        handleDelete(tags[tags.length - 1])
      }
    }
  }

  /**
   * 提交关键词
   * 1. 检查关键词是否已存在
   * 2. 检查关键词是否为空
   * 3. 添加新关键词并触发onChange回调
   */
  const handleSubmit = () => {
    if (tags.includes(keyword) || !keyword.trim()) {
      setKeyword('')
      return
    }
    const newValue = [...tags, keyword.trim()]
    if (valueProp === undefined) {
      setInternalValue(newValue)
    }
    setKeyword('')
    onChange(newValue)
  }

  /**
   * 删除指定的关键词标签
   * @param removedTag 要删除的关键词
   */
  const handleDelete = (removedTag: string) => {
    const newValue = tags.filter((tag: string) => tag !== removedTag)
    if (valueProp === undefined) {
      setInternalValue(newValue)
    }
    onChange(newValue)
  }

  /**
   * 处理输入框失焦事件
   * 当输入框中有内容时，自动提交当前输入的关键词
   */
  const handleBlur = () => {
    if (keyword.trim()) {
      handleSubmit()
    }
  }

  return (
    <div
      className={classNames(
        styles.inputBox,
        {
          [styles.active]: tags.length > 0,
        },
        className
      )}
    >
      {tags.map((tag: string) => (
        <div key={tag} className={styles.customTag}>
          {/* @ts-expect-error wind icon */}
          {tag} <CloseCircleF className={styles.customTagIcon} onClick={() => handleDelete(tag)} />
        </div>
      ))}
      <Input
        size="large"
        className={styles.input}
        value={keyword}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        onBlur={handleBlur}
        placeholder={tags.length === 0 ? intl('272180', '请输入关键词，按确认键隔开') : ''}
      />
    </div>
  )
}
