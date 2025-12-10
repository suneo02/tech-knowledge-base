import React from 'react'
import classNames from 'classnames'
import { Button, Input, Popconfirm } from '@wind/wind-ui'
import { CheckO, CloseO, EditO } from '@wind/icons'
import { DeleteOBtn } from '@/components/common/btn/DeleteOBtn/index.tsx'
import intl from '@/utils/intl'
import { pointBuriedByModule } from '@/api/pointBuried/bury.ts'

type GroupItem = {
  groupId: string
  name: string
  num?: number
}

type Props = {
  groups: GroupItem[]
  currentGroup: GroupItem
  value: string
  setValue: (v: string) => void
  isAdd: boolean
  setIsAdd: (v: boolean) => void
  isEdit: boolean
  setIsEdit: (v: boolean) => void
  editingGroupId: string | null
  setEditingGroupId: (id: string | null) => void
  onSelect: (g: GroupItem) => void
  onAddGroup: () => void
  onUpdateGroup: (groupId: string) => void
  onDeleteGroup: (groupId: string) => void
}

const GroupList: React.FC<Props> = ({
  groups,
  currentGroup,
  value,
  setValue,
  isAdd,
  setIsAdd,
  isEdit,
  setIsEdit,
  editingGroupId,
  setEditingGroupId,
  onSelect,
  onAddGroup,
  onUpdateGroup,
  onDeleteGroup,
}) => {
  const dupNameText = intl('371234', '与现有分组重名')

  return (
    <div className="tree">
      {groups.map((i) => {
        const isCurrent = i.groupId === currentGroup.groupId
        const isEditingThis = isEdit && editingGroupId === i.groupId
        const hasDupName = groups.some((j) => j.name === value && j.name !== i.name)
        return (
          <div
            key={i.groupId}
            className={classNames('group', {
              current_group: isCurrent,
              'is-editing': isEditingThis,
            })}
            onClick={() => {
              onSelect(i)
            }}
          >
            {isEditingThis ? (
              <>
                <div className="group-row EditBox">
                  <Input
                    size="mini"
                    placeholder=""
                    autoFocus
                    value={value}
                    onChange={(e) => {
                      setValue((e as any).target.value)
                    }}
                    style={{ width: '130px', marginRight: '12px ' }}
                  />
                  <Button
                    type="text"
                    onClick={(e) => {
                      e.stopPropagation()
                      onUpdateGroup(i.groupId)
                    }}
                    disabled={groups.some((g) => g.name === value)}
                    // @ts-expect-error ttt
                    icon={<CheckO />}
                  />
                  &nbsp;&nbsp;
                  <Button
                    type="text"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsEdit(false)
                      setEditingGroupId(null)
                    }}
                    // @ts-expect-error ttt
                    icon={<CloseO />}
                  />
                </div>
                {hasDupName ? (
                  <div className="dupName">
                    <p style={{ lineHeight: '16px', fontSize: '12px', color: '#D9001B' }}>{dupNameText}</p>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="group-row">
                <span className="groupName">
                  &nbsp;{i.name}（{i.num}）
                </span>
                {i.groupId !== 'all' ? (
                  <span className="group-actions">
                    <Button
                      type="text"
                      className={classNames({ 'icon-in-active-menu': isCurrent })}
                      onClick={(e) => {
                        e.stopPropagation()
                        pointBuriedByModule(922602101051)
                        setIsAdd(false)
                        setIsEdit(true)
                        setEditingGroupId(i.groupId)
                        setValue(i.name)
                      }}
                      // @ts-expect-error ttt
                      icon={<EditO />}
                    />
                    &nbsp;&nbsp;
                    <Popconfirm
                      title={intl('370837', `删除操作不可撤销，确定删除分组“%”么？`).replace('%', i.name)}
                      onConfirm={(e?: any) => {
                        e && e.stopPropagation && e.stopPropagation()
                        pointBuriedByModule(922602101050)
                        onDeleteGroup(i.groupId)
                      }}
                      okText={intl('19482', '确认')}
                      cancelText={intl('19405', '取消')}
                    >
                      <DeleteOBtn
                        className={classNames({ 'icon-in-active-menu': isCurrent })}
                        onClick={(e: any) => e.stopPropagation()}
                      />
                    </Popconfirm>
                  </span>
                ) : null}
              </div>
            )}
          </div>
        )
      })}

      {isAdd ? (
        <div className="add-group-box">
          <div className="group-row">
            <Input
              size="mini"
              placeholder=""
              value={value}
              onChange={(e) => {
                setValue((e as any).target.value)
              }}
              style={{ width: '130px', marginRight: '12px ' }}
            />
            <Button
              type="text"
              onClick={onAddGroup}
              // @ts-expect-error ttt
              icon={<CheckO />}
              disabled={groups.some((g) => g.name === value)}
            />
            &nbsp;&nbsp;
            <Button
              type="text"
              onClick={() => {
                setIsAdd(false)
              }}
              // @ts-expect-error ttt
              icon={<CloseO />}
            />
          </div>
          {groups.some((g) => g.name === value) ? (
            <div className="dupName">
              <p style={{ lineHeight: '16px', fontSize: '12px', color: '#D9001B' }}>{dupNameText}</p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export default GroupList

