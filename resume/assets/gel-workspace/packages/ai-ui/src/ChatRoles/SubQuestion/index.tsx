export * from './LoadingElement/index.ts'

import { AntRoleType, SubQuestionMessage } from 'gel-ui'
import { RoleAvatarHidden } from '../components/misc.tsx'
import TextLoading from './LoadingElement/TextLoading.tsx'

export const SubQuestionRole: AntRoleType<SubQuestionMessage['content']> = {
  placement: 'start',
  avatar: RoleAvatarHidden,
  styles: {
    content: {
      transform: 'translateY(-12px)',
      backgroundColor: 'transparent',
      fontSize: 14,
    },
  },
  messageRender: (content) => {
    const steps = content?.length > 0 ? content?.map((item) => ({ text: item })) : []
    return (
      <>
        <TextLoading steps={steps} />
      </>
    )
  },
}
