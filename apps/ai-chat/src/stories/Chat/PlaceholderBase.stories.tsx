import { PlaceholderBase } from '@/components/ChatMessage/PlaceholderPrompts'
import { ChatRoomSuperProvider } from '@/contexts/ChatRoom/super'
import { PresetQuestionBaseProvider } from '@/contexts/PresetQuestion/ChatBase'
import { Meta, StoryObj } from '@storybook/react'
import { ChatQuestion } from 'gel-api'
import { BrowserRouter } from 'react-router-dom'

const mockQuestions: ChatQuestion[] = [
  {
    isDynamic: false,
    questionsType: 0,
    questions: '初创AR公司奇点面临哪些经营风险，股东结构发生了什么变化？',
    questionsIcon:
      '<?xml version="1.0" encoding="UTF-8"?>\n<svg width="36px" height="36px" viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n    <title>Icon/问句类型=表格</title>\n    <g id="Icon/问句类型=表格" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n        <rect id="矩形" x="0" y="0" width="36" height="36"></rect>\n        <path d="M31.5,2 C32.6045695,2 33.5,2.8954305 33.5,4 L33.5,32 C33.5,33.1045695 32.6045695,34 31.5,34 L4.5,34 C3.3954305,34 2.5,33.1045695 2.5,32 L2.5,4 C2.5,2.8954305 3.3954305,2 4.5,2 L31.5,2 Z M5.49998871,24.9952145 L5.5,31 L16.5,31 L16.5,25 L5.675,25 C5.61608648,25 5.55772003,24.9983846 5.49998871,24.9952145 Z M30.5,24.994 L30.325,25 L19.5,25 L19.5,31 L30.5,31 L30.5,24.994 Z M5.49998871,14.9952145 L5.5,22.005 L5.675,22 L16.5,22 L16.5,15 L5.675,15 C5.61608648,15 5.55772003,14.9983846 5.49998871,14.9952145 Z M30.5,14.994 L30.325,15 L19.5,15 L19.5,22 L30.325,22 C30.384256,22 30.4429586,22.0016342 30.5010182,22.0048409 L30.5,14.994 Z M16.5,5 L5.5,5 L5.5,12.005 L5.675,12 L16.5,12 L16.5,5 Z M30.5,5 L19.5,5 L19.5,12 L30.325,12 C30.384256,12 30.4429586,12.0016342 30.5010182,12.0048409 L30.5,5 Z" id="形状结合" fill="#666666" fill-rule="nonzero"></path>\n    </g>\n</svg>',
  },
  {
    isDynamic: false,
    questionsType: 0,
    questions: '张颂文名下关联企业有哪些，经营状态如何？',
    questionsIcon:
      '<?xml version="1.0" encoding="UTF-8"?>\n<svg width="36px" height="36px" viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n    <title>Icon/问句类型=表格</title>\n    <g id="Icon/问句类型=表格" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n        <rect id="矩形" x="0" y="0" width="36" height="36"></rect>\n        <path d="M31.5,2 C32.6045695,2 33.5,2.8954305 33.5,4 L33.5,32 C33.5,33.1045695 32.6045695,34 31.5,34 L4.5,34 C3.3954305,34 2.5,33.1045695 2.5,32 L2.5,4 C2.5,2.8954305 3.3954305,2 4.5,2 L31.5,2 Z M5.49998871,24.9952145 L5.5,31 L16.5,31 L16.5,25 L5.675,25 C5.61608648,25 5.55772003,24.9983846 5.49998871,24.9952145 Z M30.5,24.994 L30.325,25 L19.5,25 L19.5,31 L30.5,31 L30.5,24.994 Z M5.49998871,14.9952145 L5.5,22.005 L5.675,22 L16.5,22 L16.5,15 L5.675,15 C5.61608648,15 5.55772003,14.9983846 5.49998871,14.9952145 Z M30.5,14.994 L30.325,15 L19.5,15 L19.5,22 L30.325,22 C30.384256,22 30.4429586,22.0016342 30.5010182,22.0048409 L30.5,14.994 Z M16.5,5 L5.5,5 L5.5,12.005 L5.675,12 L16.5,12 L16.5,5 Z M30.5,5 L19.5,5 L19.5,12 L30.325,12 C30.384256,12 30.4429586,12.0016342 30.5010182,12.0048409 L30.5,5 Z" id="形状结合" fill="#666666" fill-rule="nonzero"></path>\n    </g>\n</svg>',
  },
  {
    isDynamic: false,
    questionsType: 0,
    questions: '国内有哪些公司在做无人驾驶的业务，这些公司分别具备什么优势？',
    questionsIcon:
      '<?xml version="1.0" encoding="UTF-8"?>\n<svg width="36px" height="36px" viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n    <title>Icon/问句类型=数据搜索</title>\n    <g id="Icon/问句类型=数据搜索" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n        <rect id="矩形" x="0" y="0" width="36" height="36"></rect>\n        <rect id="矩形" fill="#666666" x="1" y="3" width="34" height="3" rx="0.400000006"></rect>\n        <rect id="矩形" fill="#666666" x="1" y="12" width="7" height="3" rx="0.400000006"></rect>\n        <rect id="矩形" fill="#666666" x="1" y="30" width="11" height="3" rx="0.400000006"></rect>\n        <rect id="矩形" fill="#666666" x="1" y="21" width="7" height="3" rx="0.400000006"></rect>\n        <path d="M21,8 C27.0751322,8 32,12.9248678 32,19 C32,21.7029089 31.0251317,24.1781252 29.4078238,26.0932202 L34.5820703,31.4509349 C35.1575441,32.0468555 35.1409687,32.9964584 34.5450481,33.5719322 C33.9491275,34.147406 32.9995247,34.1308307 32.4240509,33.5349101 L27.1777917,28.1026745 C25.4167839,29.3001585 23.2901203,30 21,30 C14.9248678,30 10,25.0751322 10,19 C10,12.9248678 14.9248678,8 21,8 Z M21,11 C16.581722,11 13,14.581722 13,19 C13,23.418278 16.581722,27 21,27 C25.418278,27 29,23.418278 29,19 C29,14.581722 25.418278,11 21,11 Z" id="形状结合" fill="#666666" fill-rule="nonzero"></path>\n    </g>\n</svg>',
  },
  {
    isDynamic: false,
    questionsType: 0,
    questions: '阿里巴巴近期有哪些招聘计划？人才需求类型是什么样的？',
    questionsIcon:
      '<?xml version="1.0" encoding="UTF-8"?>\n<svg width="36px" height="36px" viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n    <title>Icon/问句类型=表格</title>\n    <g id="Icon/问句类型=表格" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n        <rect id="矩形" x="0" y="0" width="36" height="36"></rect>\n        <path d="M31.5,2 C32.6045695,2 33.5,2.8954305 33.5,4 L33.5,32 C33.5,33.1045695 32.6045695,34 31.5,34 L4.5,34 C3.3954305,34 2.5,33.1045695 2.5,32 L2.5,4 C2.5,2.8954305 3.3954305,2 4.5,2 L31.5,2 Z M5.49998871,24.9952145 L5.5,31 L16.5,31 L16.5,25 L5.675,25 C5.61608648,25 5.55772003,24.9983846 5.49998871,24.9952145 Z M30.5,24.994 L30.325,25 L19.5,25 L19.5,31 L30.5,31 L30.5,24.994 Z M5.49998871,14.9952145 L5.5,22.005 L5.675,22 L16.5,22 L16.5,15 L5.675,15 C5.61608648,15 5.55772003,14.9983846 5.49998871,14.9952145 Z M30.5,14.994 L30.325,15 L19.5,15 L19.5,22 L30.325,22 C30.384256,22 30.4429586,22.0016342 30.5010182,22.0048409 L30.5,14.994 Z M16.5,5 L5.5,5 L5.5,12.005 L5.675,12 L16.5,12 L16.5,5 Z M30.5,5 L19.5,5 L19.5,12 L30.325,12 C30.384256,12 30.4429586,12.0016342 30.5010182,12.0048409 L30.5,5 Z" id="形状结合" fill="#666666" fill-rule="nonzero"></path>\n    </g>\n</svg>',
  },
  {
    isDynamic: false,
    questionsType: 0,
    questions: 'ELU.AI近期融资动态情况？',
    questionsIcon:
      '<?xml version="1.0" encoding="UTF-8"?>\n<svg width="36px" height="36px" viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n    <title>Icon/问句类型=数据搜索</title>\n    <g id="Icon/问句类型=数据搜索" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n        <rect id="矩形" x="0" y="0" width="36" height="36"></rect>\n        <rect id="矩形" fill="#666666" x="1" y="3" width="34" height="3" rx="0.400000006"></rect>\n        <rect id="矩形" fill="#666666" x="1" y="12" width="7" height="3" rx="0.400000006"></rect>\n        <rect id="矩形" fill="#666666" x="1" y="30" width="11" height="3" rx="0.400000006"></rect>\n        <rect id="矩形" fill="#666666" x="1" y="21" width="7" height="3" rx="0.400000006"></rect>\n        <path d="M21,8 C27.0751322,8 32,12.9248678 32,19 C32,21.7029089 31.0251317,24.1781252 29.4078238,26.0932202 L34.5820703,31.4509349 C35.1575441,32.0468555 35.1409687,32.9964584 34.5450481,33.5719322 C33.9491275,34.147406 32.9995247,34.1308307 32.4240509,33.5349101 L27.1777917,28.1026745 C25.4167839,29.3001585 23.2901203,30 21,30 C14.9248678,30 10,25.0751322 10,19 C10,12.9248678 14.9248678,8 21,8 Z M21,11 C16.581722,11 13,14.581722 13,19 C13,23.418278 16.581722,27 21,27 C25.418278,27 29,23.418278 29,19 C29,14.581722 25.418278,11 21,11 Z" id="形状结合" fill="#666666" fill-rule="nonzero"></path>\n    </g>\n</svg>',
  },
]

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      <ChatRoomSuperProvider>
        <PresetQuestionBaseProvider initialQuestions={mockQuestions}>{children}</PresetQuestionBaseProvider>
      </ChatRoomSuperProvider>
    </BrowserRouter>
  )
}

const meta = {
  title: 'chat/PlaceholderBase',
  component: PlaceholderBase,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <Wrapper>
        <Story />
      </Wrapper>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof PlaceholderBase>

export default meta
type Story = StoryObj<typeof PlaceholderBase>

export const Default: Story = {
  args: {
    handleSendPresetMsg: (message) => {
      console.log('send message', message)
    },
  },
}
