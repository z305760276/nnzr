import { useState, useRef } from 'react'
import { ChatPanel } from './chat/ChatPanel'
import { PageAgentCore } from '@page-agent/core'

const BOT_ID = '7640388142570684451'
const TOKEN = 'sat_xZH8yL274NDmvAMsVXh5nEmhqFI5Ztcqeyk5AFfSK0oXeTvHhXLpspSa7L6BZnoi'

const STORAGE_KEY = 'ai_assistant_conv'

const QUICK_QUESTION_POOL = [
  '请解释安检隐患分级标准的具体内容',
  'CRM工单的流转流程是怎样的？',
  'HSE和客服质量记分标准在哪里查询',
  '什么是暗厨房？',
  '组织架构和岗位职责有哪些？',
  '财年指标如何查询？',
  '安全管理制度有哪些？',
  '客户投诉处理流程是什么？',
  '燃气管道巡检频次要求？',
  '内部管理制度如何检索？',
]

const pickRandomQuestions = (pool: string[], count: number) => {
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

interface Props {
  agentReady: boolean
  agent: PageAgentCore | null
}

function AiAssistantDrawer({ agentReady, agent }: Props) {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[1px] animate-in fade-in duration-200"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Floating button */}
      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 group cursor-pointer"
      >
        {/* Ripple background */}
        <span className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" style={{ animationDuration: '3s' }} />

        {/* Button body */}
        <span className="relative flex items-center justify-center w-14 h-14 rounded-full
          bg-gradient-to-br from-blue-500 to-indigo-600
          hover:from-blue-600 hover:to-indigo-700
          text-white shadow-xl shadow-blue-500/30 hover:shadow-blue-500/40
          transition-all duration-300
          hover:scale-105 active:scale-95"
        >
          {open ? (
            <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
              />
            </svg>
          )}
        </span>
      </button>

      {/* Chat panel */}
      {open && (
        <ChatPanel
          onClose={() => setOpen(false)}
          agentReady={agentReady}
          agent={agent}
        />
      )}
    </>
  )
}

export default AiAssistantDrawer
