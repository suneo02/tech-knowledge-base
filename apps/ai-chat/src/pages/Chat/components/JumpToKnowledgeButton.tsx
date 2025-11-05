import React from 'react'
import { Button } from '@wind/wind-ui'
import { useNavigate } from 'react-router-dom'
import { navigateToFolder, FOLDER_IDS } from '@/pages/MyFile/utils/navigation'

interface JumpToKnowledgeButtonProps {
  className?: string
}

export const JumpToKnowledgeButton: React.FC<JumpToKnowledgeButtonProps> = ({ className }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    // 使用工具方法导航到知识库文件夹
    navigateToFolder(navigate, FOLDER_IDS.KNOWLEDGE)
  }

  return (
    <Button onClick={handleClick} className={className}>
      前往我的知识库
    </Button>
  )
}

export default JumpToKnowledgeButton
