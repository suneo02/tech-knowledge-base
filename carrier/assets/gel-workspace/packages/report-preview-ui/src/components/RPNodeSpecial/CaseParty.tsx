import { getTForRPPreview } from '@/utils'
import { useIntl } from 'gel-ui'
import React from 'react'
import { DEFAULT_EMPTY_TEXT, safeToStringRender } from 'report-util/table'

interface PartyItem {
  roleType: string
  [key: string]: any
}

interface GroupedParty {
  roleType: string
  childs: PartyItem[]
}

interface CasePartyProps {
  data: PartyItem[]
  nameKey?: string
  idKey?: string
}

export const CaseParty: React.FC<CasePartyProps> = ({ data: arrDataArr, nameKey = 'name', idKey = 'id' }) => {
  const t = useIntl()

  if (!arrDataArr || !Array.isArray(arrDataArr) || arrDataArr.length === 0) {
    return <>{DEFAULT_EMPTY_TEXT}</>
  }

  try {
    // Sort data to put plaintiffs first
    const arrData = [...arrDataArr].sort((a, b) => {
      if (a.roleType === '原告') return -1
      if (b.roleType === '原告') return 1
      return 0
    })

    // Group by roleType
    const newArr: GroupedParty[] = []
    arrData.forEach((item) => {
      const parent = newArr.find((c) => c.roleType === item.roleType)
      if (parent) {
        parent.childs.push(item)
      } else {
        newArr.push({
          roleType: item.roleType,
          childs: [item],
        })
      }
    })

    return (
      <div>
        {newArr.map((group, groupIndex) => (
          <React.Fragment key={group.roleType}>
            <span>
              {group.roleType}:{' '}
              {group.childs.map((child, childIndex) => (
                <React.Fragment key={child[idKey] || childIndex}>
                  {childIndex > 0 && '、'}
                  <span>{safeToStringRender(getTForRPPreview(t), child[nameKey], undefined)}</span>
                </React.Fragment>
              ))}
            </span>
            {groupIndex < newArr.length - 1 && <br />}
          </React.Fragment>
        ))}
      </div>
    )
  } catch (e) {
    console.error('CaseParty error:', e)
    return <>{DEFAULT_EMPTY_TEXT}</>
  }
}
