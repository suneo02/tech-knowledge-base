import { DownloadOutlined, InfoCircleOutlined } from '@ant-design/icons'
import React, { Button, Flex, Tooltip, Typography, theme } from 'antd'
import './index.scss'
import { HeaderProps } from '../container/type'
import WFilter from '../wind/form/WFilter'

const Header = (props: HeaderProps) => {
  const { token } = theme.useToken()

  return (
    <Flex className="configurable-title" align="center" justify={'space-between'}>
      <Flex className="title-left-container">
        {props.title ? (
          <Flex align="center" style={{ marginBlockEnd: token.paddingXS }}>
            {!props.integrationParent ? (
              <p className={`title h${props.level}`}>{props.title}</p>
            ) : (
              <Typography.Text style={{ margin: 0 }}> {props.title}</Typography.Text>
            )}

            {props.tooltip ? (
              <Tooltip title={props.tooltip}>
                <InfoCircleOutlined style={{ marginInlineStart: 4, color: '#333' }} />
              </Tooltip>
            ) : null}

            {props.titleRemark ? (
              <Typography.Text style={{ marginInlineStart: 4 }} type="secondary">
                ({props.titleRemark})
              </Typography.Text>
            ) : null}
            {props.total ? (
              <Typography.Text style={{ marginInlineStart: 4 }} type="secondary">
                ({Number(props.total)})
              </Typography.Text>
            ) : null}
            {props.vip ? (
              <Typography.Text type="warning" style={{ marginInlineStart: 4 }}>
                {props.vip}
              </Typography.Text>
            ) : null}
          </Flex>
        ) : (
          <span></span>
        )}
      </Flex>
      <Flex>
        {/* {props.total && props.total > 10 ? ( */}
        <WFilter
          search={props?.search}
          onSearch={props?.onSearch}
          filterList={props.filterList}
          style={props.filterList?.length ? { marginBlockEnd: token.paddingXS } : {}}
          data-uc-id="Fl6dSnp3k"
          data-uc-ct="wfilter"
        />
        {/* ) : null} */}
        {props.downDocType ? (
          <Button
            style={{ marginInlineStart: 12 }}
            size="small"
            icon={<DownloadOutlined />}
            data-uc-id="w5eJvb2DEa"
            data-uc-ct="button"
          >
            导出
          </Button>
        ) : null}
      </Flex>
    </Flex>
  )
}

export default Header
