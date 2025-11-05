/**
 * JQuery转换小工具，开发完成即可删除
 * Created by Calvin
 *
 * @format
 */

import { Button } from '@wind/wind-ui'
import Form from '@wind/wind-ui-form'
import TextArea from '@wind/wind-ui/lib/input/TextArea'
import { useState } from 'react'

export const TransformTable = () => {
  const [content, setContent] = useState()
  const onFinish = (values) => {
    const list = []
    const nArr = values.content.split('\n')
    nArr.forEach((element) => {
      const splitData = element.split(':')
      let key = splitData[0].trim()
      if (key === 'thName') key = 'title'
      if (key === 'fields') key = 'dataIndex'
      console.log(splitData[1])
      const valueStr = splitData[1].replace(/\[|\]/g, '')
      // valueStr = valueStr.replace(/"/g, '')
      const values = valueStr.split(',')
      values.forEach((value, index) => {
        value = value.trim()
        if (key === 'title') {
          value = value.split("'")[1]
        }
        if (key === 'align') {
          value = value === '0' ? 'left' : value === '1' ? 'center' : 'right'
        }
        list[index]
          ? (list[index] = Object.assign(list[index], {
              [key]: value,
            }))
          : list.push({ [key]: value })
      })
    })
    setContent(JSON.stringify(list))
  }
  return (
    <Form onFinish={onFinish}>
      <Form.Item label="content" name="content">
        <TextArea rows={4} />
      </Form.Item>
      <Button htmlType="submit">Submit</Button>
      <TextArea rows={4} value={content} />
    </Form>
  )
}
