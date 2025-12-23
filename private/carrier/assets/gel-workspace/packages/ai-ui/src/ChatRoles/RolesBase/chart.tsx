import { AxiosInstance } from 'axios'
import { AntRoleType, ChartMessage, RoleAvatarHidden } from 'gel-ui'

export const createChartRole: (
  isDev: boolean,
  wsid: string,
  entWebAxiosInstance: AxiosInstance
) => AntRoleType<ChartMessage['content']> = (_isDev, _wsid, _entWebAxiosInstance) => ({
  placement: 'start',
  avatar: RoleAvatarHidden,
  variant: 'borderless',
  messageRender: () => <></>,
  // messageRender: (content) => {
  //   console.log('🚀 ChartRole ~ content:', content)
  //   const gelDataArray = getGelDataArrar(content)
  //   return gelDataArray.map((item) => (
  //     <ChartCard key={item.type} item={item} isDev={isDev} wsid={wsid} entWebAxiosInstance={entWebAxiosInstance} />
  //   ))
  // },
  // styles: {
  //   content: {
  //     width: '100%',
  //     marginInlineEnd: 44,
  //   },
  // },
})
