import { CorpBasicNumFront } from '@/types/corpDetail'
import { CorpMenuCfg } from '@/types/corpDetail/menu'
import { Tree } from '@wind/wind-ui'
import { FC, useMemo, useState } from 'react'
import { buildCorpAllMenu, buildSimplifiedCorpMenu, CorpMenuData } from '../../menu'
import { shouldUseCompleteMenu } from '../../menu/useCorpMenuData'
import { ToggleCorpDetailMenu } from './ExpandAll'
import menuStyles from './index.module.less'
import './menu.less'
import { MenuSearch } from './MenuSearch'
import { renderMenuTreeNodes } from './MenuTreeNodes'

type CorpDetailMenuProps = {
  menuConfig: CorpMenuCfg | null
  basicNum: CorpBasicNumFront
  expandedKeys: string[]
  setExpandedKeys: (keys: string[]) => void
  treeMenuClick: (menu: string[], e: any) => void
  onExpand: (expandedKeys: string[]) => void
  autoExpandParent: boolean
  selectedKeys: string[]
}
export const CorpDetailMenu: FC<CorpDetailMenuProps> = ({
  menuConfig,
  basicNum,
  selectedKeys,
  expandedKeys,
  setExpandedKeys,
  treeMenuClick,
  onExpand,
  autoExpandParent,
}) => {
  const [searchValue, setSearchValue] = useState<string | null>(null)
  const [showDisabled, setShowDisabled] = useState(false)
  const defaultExpandedKeys = useMemo(() => {
    if (!menuConfig) return ['overview']
    return menuConfig.overview ? ['overview'] : []
  }, [menuConfig])
  const treeDatas = useMemo(() => {
    if (!menuConfig || Object.keys(menuConfig).length === 0) {
      return []
    }
    if (shouldUseCompleteMenu(basicNum, menuConfig)) {
      return buildCorpAllMenu(menuConfig, basicNum)
    }
    return buildSimplifiedCorpMenu(menuConfig)
  }, [menuConfig, basicNum])

  const dataOnlyTreeDatas = useMemo(() => {
    const filterByHasData = (nodes: CorpMenuData[]): CorpMenuData[] => {
      return nodes
        .filter((n) => n.hasData)
        .map((n) => ({ ...n, children: n.children ? filterByHasData(n.children) : [] }))
    }
    return filterByHasData(treeDatas)
  }, [treeDatas])

  if (!treeDatas || treeDatas.length === 0) {
    return null
  }

  return (
    <>
      <div
        className={menuStyles['corp-detail-menu--search-row']}
        onClick={() => {}}
        data-uc-id="6lmwfheVWj"
        data-uc-ct="div"
      >
        <MenuSearch
          menuConfig={menuConfig}
          basicNum={basicNum}
          treeMenuClick={treeMenuClick}
          setExpandedKeys={setExpandedKeys}
          value={searchValue}
          onChange={setSearchValue}
          data-uc-id="1xGa_eblUT"
          data-uc-ct="menusearch"
        />
        <ToggleCorpDetailMenu
          expandedKeys={expandedKeys}
          setExpandedKeys={setExpandedKeys}
          treeDataAll={treeDatas}
          treeDataDataOnly={dataOnlyTreeDatas}
          setShowDisabled={setShowDisabled}
        />
      </div>
      <Tree
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        defaultExpandedKeys={defaultExpandedKeys}
        onSelect={treeMenuClick}
        selectedKeys={selectedKeys}
        data-uc-id="41JYJH2yGE"
        data-uc-ct="tree"
      >
        {renderMenuTreeNodes(showDisabled ? treeDatas : dataOnlyTreeDatas, searchValue)}
      </Tree>
    </>
  )
}
