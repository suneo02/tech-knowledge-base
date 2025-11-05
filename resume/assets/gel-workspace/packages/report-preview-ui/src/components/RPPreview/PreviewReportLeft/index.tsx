import { MenuFoldO, MenuUnfoldO } from '@wind/icons'
import { Button, Divider, Layout, Select, ThemeProvider, Tree } from '@wind/wind-ui'
import classNames from 'classnames'
import { useEffect, useMemo, useState } from 'react'
import { RPPreviewLeftProps } from './type'
import { flattenTreeNodesForSelect } from './util'

import { t } from 'gel-util/intl'
import React from 'react'
import { useRPPreviewCtx } from '../../../context/RPPreview'
import { useReportTreeExpand, useReportTreeNodeRender } from '../../../hooks'
import { convertReportConfigToTreeNodes } from '../../../utils/convertReportConfigToTreeNodes'
import styles from './index.module.less'
const { Header, Sider } = Layout

export const PreviewReportLeft: React.FC<RPPreviewLeftProps> = ({ onNodeSelected }) => {
  const { reportConfig, hiddenNodeIds, handleToggleNodeVisibility } = useRPPreviewCtx()
  const [selectedKey, setSelectedKey] = useState<string | undefined>()

  useEffect(() => {
    if (selectedKey) {
      onNodeSelected?.(selectedKey)
    }
  }, [selectedKey])

  const originalTreeNodes = useMemo(() => {
    return convertReportConfigToTreeNodes(reportConfig)
  }, [reportConfig])

  const { treeNodes } = useReportTreeNodeRender({
    originalTreeNodes,
    hiddenNodeIds,
    handleToggleNodeVisibility,
  })

  const { expandedKeys, setExpandedKeys, ifAllExpanded, toggleAll } = useReportTreeExpand(originalTreeNodes)

  const selectOptions = useMemo(
    () => flattenTreeNodesForSelect(originalTreeNodes, hiddenNodeIds),
    [originalTreeNodes, hiddenNodeIds]
  )

  return (
    <ThemeProvider pattern="gray">
      {/* @ts-expect-error wind-ui 的类型定义有问题 */}
      <Sider
        className={styles['rp-preview-left-container']}
        collapsible
        collapsedContent={
          // @ts-expect-error wind-ui 的类型定义有问题
          <Header size="small" className="f-wm-vr f-bg-none">
            {t('305352', '选择模块')}
          </Header>
        }
        width={336}
      >
        {/* @ts-expect-error wind-ui 的类型定义有问题 */}
        <Header size="small" className={classNames('f-tac', 'f-bg-none', styles['rp-preview-header-bar'])}>
          <span className={styles['rp-preview-header-title']}>{t('305352', '选择模块')}</span>
          <Button
            type="text"
            icon={
              ifAllExpanded ? (
                <MenuUnfoldO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
              ) : (
                <MenuFoldO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
              )
            }
            onClick={toggleAll}
          />
        </Header>
        <Divider className="f-m0" />
        <Select
          className={styles['select']}
          showSearch
          placeholder="内容搜索"
          options={selectOptions}
          onSelect={(value) => {
            setSelectedKey(String(value))
          }}
        />
        <Tree
          className="f-oya"
          treeData={treeNodes}
          selectedKeys={selectedKey ? [selectedKey] : []}
          onSelect={(keys) => {
            const key = Array.isArray(keys) ? keys[0] : keys
            setSelectedKey(String(key))
            onNodeSelected?.(String(key))
          }}
          showIcon
          expandedKeys={expandedKeys}
          onExpand={(keys) => {
            setExpandedKeys(keys.map(String))
          }}
        />
      </Sider>
    </ThemeProvider>
  )
}
