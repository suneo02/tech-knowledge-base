import { useCallback, useState } from 'react'

export const regexDictionary = {
  /** 不允许出现任何html字符 */
  search: /^(?!.*<\/?[a-z][\s\S]*?>).*$/i,
}

/**
 * 正则大全
 */
export const regexUtils = (initialValue, reg) => {
  const validate = () => {
    const regex = typeof reg === 'string' || typeof reg === 'number' ? regexDictionary[reg] : reg
    return regex.test(initialValue)
  }
  return {
    validate,
  }
}

/**
 * 正则大全hooks
 */
export const useRegex = (initialValue, reg) => {
  const [value, setValue] = useState(initialValue)
  const [isValid, setValid] = useState(true)
  const validate = useCallback(
    (newValue) => {
      const { validate: inputValidate } = regexUtils(newValue, reg)
      /** 这个输入可以为空，为合法字符 */
      const isValid = inputValidate() || newValue === ''
      setValid(isValid)
      return isValid
    },
    [reg]
  )
  const onChange = useCallback(
    (event) => {
      const newValue = event.target.value
      const isValid = validate(newValue)
      if (isValid) setValue(newValue)
    },
    [validate]
  )

  return [value, onChange, isValid]
}
