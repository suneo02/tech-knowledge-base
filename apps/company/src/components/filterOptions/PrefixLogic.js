import { Form, Select } from 'antd'

const Option = Select.Option

// 筛选项中的前缀选择控件
const PrefixLogic = (props) => {
  const { name, logicOption } = props
  //   const { t } = useTranslation();
  const t = window.intl
  const options = {
    any: t(257770),
    notAny: t(257771),
    all: t(257777),
  }
  // console.log(props);

  return (
    <Form.Item name={[name, 'logic']} noStyle rules={[{ required: true, message: '请选择包含关系' }]}>
      <Select className="prefixLogic" style={{ width: 90 }}>
        {logicOption.split(',').map((item, index) => {
          return (
            <Option key={index} value={item}>
              {options[item]}
            </Option>
          )
        })}
      </Select>
    </Form.Item>
  )
}

export default PrefixLogic
