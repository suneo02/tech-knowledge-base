import { LegendO } from '@wind/icons'
import { Button, Dropdown, Menu } from '@wind/wind-ui'
import { useSuperChatRoomContext } from '@/contexts/SuperChat'

const Group = () => {
  const { activeSheetId, sheetRefs } = useSuperChatRoomContext()
  const currentSheetRef = sheetRefs[activeSheetId]
  const columns = currentSheetRef?.columns
  // console.log('🚀 ~ Group ~ columns:', columns)
  const menu = (
    // @ts-expect-error wind-ui
    <Menu>
      {columns?.map((column) => (
        // @ts-expect-error wind-ui
        <Menu.Item
          onClick={() => {
            const _option = {
              ...currentSheetRef?.options,
              groupBy: [column.field as string],
              groupTitleFieldFormat: (record) => {
                return record.vtableMergeName + '(' + record.children.length + ')'
              },
              enableTreeStickCell: true,
            }
            // console.log('🚀 ~ onClick ~ _option:', _option)

            currentSheetRef?.updateOption(_option)
          }}
          key={column.field}
        >
          {column.title}
        </Menu.Item>
      ))}
    </Menu>
  )

  return (
    <div>
      <Dropdown overlay={menu}>
        {/*  @ts-expect-error wind-icon */}
        <Button icon={<LegendO />}>分组</Button>
      </Dropdown>
    </div>
  )
}
export default Group
