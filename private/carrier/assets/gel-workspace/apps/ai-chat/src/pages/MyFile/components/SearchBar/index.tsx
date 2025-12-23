import { Button } from '@wind/wind-ui'
import React from 'react'
import './index.less'
import { Form } from 'antd'

const PREFIX = 'my-file-search'
export const SearchBar: React.FC = () => {
  const handleSearch = (e) => {
    // 执行搜索逻辑
    // console.log('搜索:', e)
  }

  return (
    <div className={`${PREFIX}-container`}>
      <Form onFinish={handleSearch} className={`${PREFIX}-form`}>
        <div className={`${PREFIX}-submit`}>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  )
}

export default SearchBar
