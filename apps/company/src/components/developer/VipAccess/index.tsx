// @ts-nocheck
import { Checkbox } from 'antd'
import { isDeveloper } from '@/utils/common.ts'
import React, { FC } from 'react'

const VipAccess: FC<{
  value: any
  setValue: any
}> = ({ value, setValue }) => {
  return isDeveloper ? (
    <div style={{ position: 'absolute', right: 0, top: 0, height: 80, width: 'fit-content' }}>
      <Checkbox.Group
        value={value}
        style={{ width: 100 }}
        onChange={setValue}
        options={[
          { label: 'vip', value: 'vip', key: 'vip' },
          { label: 'svip', value: 'svip', key: 'svip' },
        ]}
      ></Checkbox.Group>
    </div>
  ) : null
}

export default VipAccess
