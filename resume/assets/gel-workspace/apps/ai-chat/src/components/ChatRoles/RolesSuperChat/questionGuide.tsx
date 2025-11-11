import { AntRoleType, QuestionGuideMessage } from 'gel-ui'

export const QuestionGuideRole: AntRoleType<QuestionGuideMessage['content']> = {
  placement: 'end',
  style: {
    marginBlockStart: 24,
    marginBlockEnd: 24,
  },
  styles: {
    content: {
      marginBlockStart: 12,
      marginBlockEnd: 12,
      paddingBlock: 8,
      paddingInline: 12,
      minHeight: 32,
      borderRadius: 8,
      borderBottomRightRadius: 0,
    },
  },
}
