import React from 'react'

export const ProgressBar: React.FC<{ visible: boolean }> = ({ visible }) => {
  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #4F46E5, #EC4899)',
        animation: 'progressAnimation 2s linear infinite',
        width: '100%',
        zIndex: 9999,
      }}
    >
      <style>{`
        @keyframes progressAnimation {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100vw); }
        }
      `}</style>
    </div>
  )
}
