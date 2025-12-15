import React from 'react'
import Form from '@wind/wind-ui-form'
import { Checkbox } from '@wind/wind-ui'
import styles from '../style/searcherForm.module.less'
import intl from '@/utils/intl'

const declarations = [
  {
    value: 1,
    desc: intl(414530, '查册人是否正在就有关公司的任何作为，或相关事宜，与该公司或其董事或其他高级人员往来；'),
  },
  {
    value: 2,
    desc: intl(414531, '查册人是否正在就管理有关公司或其财产，或就相关事宜，与该公司的董事或其他高级人员往来；'),
  },
  { value: 3, desc: intl(414532, '查册人是否正在与被法院作出取消资格令的人往来；') },
  { value: 4, desc: intl(414553, '查册人是否正在与管有有关公司财产的承按人往来；') },
  { value: 5, desc: intl(414548, '查册人是否正在与有关公司的临时清盘人或清盘人往来；') },
  { value: 6, desc: intl(414549, '查册人是否正在与有关公司的财产接管人或经理人往来；') },
  {
    value: 7,
    desc: intl(
      414550,
      '该公司、其董事或其他高级人员、或其前董事(如有的话)的详情，或上述 (1) 至 (6) 项所述人士的详情；'
    ),
  },
  { value: 8, desc: intl(414551, '根据《有限责任合伙条例》注册的有限责任合伙的资料；') },
  { value: 9, desc: intl(414552, '根据《注册受托人法团条例》注册的注册受托人法团的资料；') },
  {
    value: 10,
    desc: intl(
      414573,
      '查册人是否正在就有关的有限合伙基金或其财产的管理，与该基金的普通合伙人、该基金的获授权代表(如有的话)、或该基金的投资经理往来；'
    ),
  },
  {
    value: 11,
    desc: intl(
      414574,
      '有关的有限合伙基金、该基金的普通合伙人、获授权代表(如有的话)、投资经理、前普通合伙人(如有的话)、前获授权代表(如有的话)、或前投资经理(如有的话)的详情；'
    ),
  },
  {
    value: 12,
    desc: intl(
      414575,
      '根据《放债人条例》备存于放债人登记册内关于放债人牌照、申请发给牌照或申请续牌、或其他事项的详情。'
    ),
  },
]

export const DeclarationOptionsField: React.FC = () => (
  // TODO: 翻译
  <Form.Item
    name="declarationOptions"
    label={intl(414529, '查册人声明')}
    rules={[{ required: true, message: intl(414515, '请至少选择一项声明') }]}
  >
    <Checkbox.Group data-uc-id="kBOF_xpvKB" data-uc-ct="checkbox">
      <div className={styles.checkboxGroup}>
        {declarations.map((declaration, index) => (
          <Checkbox
            key={index}
            value={declaration.value}
            data-uc-id="y_37ymUwvL"
            data-uc-ct="checkbox"
            data-uc-x={index}
          >
            {`(${declaration.value}) ${declaration.desc}`}
          </Checkbox>
        ))}
      </div>
    </Checkbox.Group>
  </Form.Item>
)
