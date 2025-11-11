import { Form, Select } from 'antd'
import PrefixLogic from './PrefixLogic'
import './filter.less'

// 筛选项中的带前缀选择框的文本输入控件
const LogicInput = (props) => {
  const { itemKey, rules, placeholder, logicOption, isModal } = props
  // console.log(props);
  const inputwidth = isModal ? 455 : document.body.scrollWidth - 845
  return (
    <div className="filter-item">
      <PrefixLogic name={itemKey} logicOption={logicOption} data-uc-id="nVlUWKPTbfz" data-uc-ct="prefixlogic" />
      <Form.Item className="item" name={[itemKey, 'value']} rules={rules} noStyle>
        <Select placeholder={placeholder} mode="tags" style={{ maxWidth: inputwidth }} open={false} />
      </Form.Item>
    </div>
  )
}

export default LogicInput
