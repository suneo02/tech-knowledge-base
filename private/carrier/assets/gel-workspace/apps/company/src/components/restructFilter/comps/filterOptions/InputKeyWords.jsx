import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import Input from '../../../../components/custom/Input'
import closeImg from '../../../../assets/imgs/closeIcon.png'
import intl from '../../../../utils/intl'

const InputKeyWords = ({ defalutValue = [], onChangeCallback = () => null }) => {
  const formRef = useRef()
  let [value, setValue] = useState(defalutValue)
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    setValue(defalutValue)
  }, [defalutValue])
  const onChange = (e) => {
    const val = e.target.value
    setKeyword(val)
  }

  // 确认
  const onSubmit = (e) => {
    e.preventDefault()
    if (value.includes(keyword) || !keyword) {
      // msg('关键词已存在')
      setKeyword('')
      return
    } else {
      value.push(keyword)
    }
    setValue([...value])
    setKeyword('')
    onChangeCallback(value)
  }

  const delValue = (val) => {
    value = value.filter((item) => item !== val)
    setValue([...value])
    onChangeCallback(value)
  }
  return (
    <Box ref={formRef} value={value} onSubmit={onSubmit} data-uc-id="luBj-kGO-qH" data-uc-ct="box">
      {value.map((item, i) => (
        <span key={i}>
          {item}
          <img onClick={() => delValue(item)} src={closeImg} data-uc-id="au5Jy6SsCnK" data-uc-ct="img" />
        </span>
      ))}
      <Input
        type="text"
        placeholder={`${value.length === 0 ? intl('272180', '请输入关键词，按确认键隔开') : ''}`}
        value={keyword}
        onChange={onChange}
        onBlur={onSubmit}
        data-uc-id="BBManVbJmSt"
        data-uc-ct="input"
      />
    </Box>
  )
}

const Box = styled.form`
  display: flex;
  flex-wrap: wrap;
  padding: 4px;
  border-radius: 2px;
  border: 1px solid ${(props) => (props.value.length > 0 ? '#00aec7' : '#D9D9D9')};
  border-color: @g-primary-color;
  background-color: #fff;
  min-height: 32px;
  flex: 1;

  input {
    /* margin: 2px 4px; */
    margin: 0 4px;
    flex: 1;
  }
  span {
    /* padding: 4px 8px; */
    padding: 0 4px;
    line-height: 20px;
    font-size: 12px;
    color: #333;
    background-color: #f8f8f8;
    border-radius: 2px;
    border: 1px solid #e3e3e3;
    margin-right: 12px;
    position: relative;
    display: flex;

    &:hover {
      background-color: #e3f2fd;
    }
    img {
      width: 8px;
      height: 8px;
      margin-top: 6px;
      margin-left: 8px;
      cursor: pointer;
    }
  }
`

export default InputKeyWords
