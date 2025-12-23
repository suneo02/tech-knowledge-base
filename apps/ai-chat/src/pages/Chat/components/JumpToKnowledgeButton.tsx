import { FOLDER_IDS, navigateToFolder } from '@/pages/MyFile/utils/navigation'
import { Button } from '@wind/wind-ui'
import React from 'react'
import { useNavigateWithLangSource } from '@/hooks/useLangSource'

interface JumpToKnowledgeButtonProps {
  className?: string
}

/**
 * TODO
 * 跳转至知识库按钮 现在没被引用，之后有用
 * @param param0
 * @returns
 */
export const JumpToKnowledgeButton: React.FC<JumpToKnowledgeButtonProps> = ({ className }) => {
  const navigate = useNavigateWithLangSource()

  const handleClick = () => {
    // 使用工具方法导航到知识库文件夹
    // @ts-expect-error ttt
    navigateToFolder(navigate, FOLDER_IDS.KNOWLEDGE)
  }

  return (
    <Button onClick={handleClick} className={className}>
      前往我的知识库
    </Button>
  )
}

export default JumpToKnowledgeButton
