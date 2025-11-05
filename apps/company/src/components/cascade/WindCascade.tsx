import { Cascader } from '@wind/wind-ui'
import { useControllableValue } from 'ahooks'
import { default as classNames } from 'classnames'
import React, { useRef, useState } from 'react'
import { convertCascadeOptions } from './handle/convertCascadeOptions'
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
  open: propOpen,
  onOpenChange,
  defaultOpen,
  placeholder,
  ...props
}: WindCascadeProps<OptionType, ValueField>) => {
  const ref = useRef<HTMLDivElement>(null)
  const cascaderRef = useRef<any>(null)
  const [selectedOptions, setSelectedOptions] = useState<any[]>([])

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
    onChange: (val) => {
      // When updating the value through the hook, also pass the selectedOptions
      if (onChange) {
        onChange(val, selectedOptions)
      }
    },
    defaultValue: [],
  })

  const optionsConverted = convertCascadeOptions(options, mergedFieldNames)

  // Handle both values and options in the onChange
  const handleChange = (values: any, newSelectedOptions: any) => {
    // Update the selected options state
    setSelectedOptions(newSelectedOptions)
    // Update the value
    setCascadeValue(values)
    // Direct call to onChange has already been handled by useControllableValue
  }

  return (
    <div
      className={classNames(styles['custom-cascade'], className, {
        [styles['dropdownMatchSelectWidth']]: props.dropdownMatchSelectWidth,
      })}
      style={style}
      ref={ref}
    >
      <Cascader
        className={styles['custom-cascade-inner']}
        ref={cascaderRef}
        popupClassName={styles['custom-cascade--popup']}
        options={optionsConverted}
        placeholder={placeholder || (window.en_access_config ? 'Please select' : '请选择')}
        onChange={handleChange}
        maxTagCount={'responsive'}
        value={cascadeValue}
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
