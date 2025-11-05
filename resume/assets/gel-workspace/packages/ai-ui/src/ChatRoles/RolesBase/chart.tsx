import { AxiosInstance } from 'axios'
import { ChartCard, getGelDataArrar } from '../components/chart'
import { RoleAvatarHidden } from '../components/misc'
import { RoleTypeBase } from './type'

export const createChartRole: (isDev: boolean, wsid: string, entWebAxiosInstance: AxiosInstance) => RoleTypeBase = (
  isDev,
  wsid,
  entWebAxiosInstance
) => ({
  placement: 'start',
  avatar: RoleAvatarHidden,
  variant: 'borderless',
  messageRender:()=><></>
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
