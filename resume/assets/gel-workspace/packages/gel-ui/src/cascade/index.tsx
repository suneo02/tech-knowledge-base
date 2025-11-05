export * from './convertCascadeOptions'
export * from './handle'
export * from './hooks'
export * from './type'

import { Cascader } from '@wind/wind-ui'
import { useControllableValue } from 'ahooks'
import classNames from 'classnames'
import { useRef } from 'react'
import { convertCascadeOptions } from './convertCascadeOptions'
import { useCascadeOpenState } from './hooks'
import styles from './style/cascade.module.less'
import { WindCascadeProps } from './type'

export const WindCascade = <OptionType extends Record<string, any>, ValueField extends keyof OptionType = 'value'>({
  value,
  options,
  onChange,
  fieldNames,
  className,
  style,
  defaultOpen,
  open: propOpen,
  onOpenChange,
  ...props
}: WindCascadeProps<OptionType, ValueField>) => {
  const ref = useRef<HTMLDivElement>(null)
  const cascaderRef = useRef<any>(null)

  // Use the custom hook to manage open state
  const { open, setOpen } = useCascadeOpenState({
    ref,
    defaultOpen,
    open: propOpen,
    onOpenChange,
  })

  // Provide default fieldNames within the component body to avoid type errors
  const defaultFieldNames: NonNullable<WindCascadeProps<OptionType, ValueField>['fieldNames']> = {
    label: 'label',
    value: 'value' as ValueField,
    children: 'children',
  }

  const mergedFieldNames = fieldNames || defaultFieldNames

  // Use ahooks to make the component controlled
  const [cascadeValue, setCascadeValue] = useControllableValue<OptionType[ValueField][][]>({
    value,
    onChange,
    defaultValue: [],
  })

  const optionsConverted = convertCascadeOptions(options, mergedFieldNames)

  return (
    <div
      className={classNames(styles['custom-cascade'], className, {
        [styles['dropdownMatchSelectWidth']]: props.dropdownMatchSelectWidth,
      })}
      style={style}
      ref={ref}
    >
      {/* @ts-expect-error wind ui type */}
      <Cascader
        className={styles['custom-cascade-inner']}
        ref={cascaderRef}
        popupClassName={styles['custom-cascade--popup']}
        options={optionsConverted}
        placeholder="请选择查询地区"
        onChange={setCascadeValue}
        value={cascadeValue}
        maxTagCount={'responsive'}
        showSearch
        popupVisible={open}
        onPopupVisibleChange={setOpen}
        getPopupContainer={() => {
          if (ref.current) {
            return ref.current
          } else {
            console.warn('cascade wrapper ref is null')
            return document.body
          }
        }}
        multiple={true}
        expandTrigger="hover"
        {...props}
      />
    </div>
  )
}
