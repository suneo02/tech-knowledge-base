import { RoleAvatarHidden } from '../components/misc.tsx'
import TextLoading from '../components/SubQuestion/LoadingElement/TextLoading.tsx'
import { RoleTypeBase } from './type.ts'

export const SubQuestionRole: RoleTypeBase = {
  placement: 'start',
  avatar: RoleAvatarHidden,
  styles: {
    content: {
      transform: 'translateY(-12px)',
      backgroundColor: 'transparent',
      fontSize: 14,
    },
  },
  messageRender: (content: any): JSX.Element => {
    console.log('🚀 ~ SubQuestionRole content:', content)

    const steps = content?.length > 0 ? content?.map((item) => ({ text: item })) : []
    return (
      <>
        <TextLoading steps={steps} />
      </>
    )
  },
}
