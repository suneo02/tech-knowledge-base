import { Form, Select, Input } from 'antd'

// 筛选项中的纯文本输入控件
const NormalInput = (props) => {
  const { itemKey, rules, placeholder, logicOption, isModal } = props
  // console.log(props);
  const inputwidth = isModal ? 555 : document.body.scrollWidth - 745

  return (
    <Form.Item className="filter-item" name={[itemKey, 'value']} rules={rules}>
      <Select placeholder={placeholder} mode="tags" style={{ width: '100%', maxWidth: inputwidth }} open={false} />
    </Form.Item>
  )
}

export default NormalInput
