import { useState, useRef, useEffect, useCallback } from 'react'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { chatWithLLM } from '../../services/llm'
import type { ChatMessage as ChatMessageType, ChatStatus } from '../../types/chat'

interface Props {
  onClose: () => void
  agentReady: boolean
  agent: any
}

const STORAGE_KEY = 'ai_assistant_history'

function loadMessages(): ChatMessageType[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {}
  return [
    {
      id: '0',
      role: 'assistant',
      content: `你好！我是 **HHXX 智能助手**。我可以帮你：

- 💬 **对话模式** — 查询知识库、回答问题
- 🤖 **自动化模式** — 页面导航、点击、填写

点击上方切换模式开始使用！`,
      timestamp: Date.now(),
    },
  ]
}

function saveMessages(messages: ChatMessageType[]) {
  try {
    // Keep last 100 messages to stay under localStorage size limit
    const toSave = messages.slice(-100)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  } catch {}
}

type Mode = 'chat' | 'agent'

export function ChatPanel({ onClose, agentReady, agent }: Props) {
  const [messages, setMessages] = useState<ChatMessageType[]>(loadMessages)
  const [status, setStatus] = useState<ChatStatus>('idle')
  const [mode, setMode] = useState<Mode>('chat')
  const scrollRef = useRef<HTMLDivElement>(null)
  const agentListenersRef = useRef<(() => void)[]>([])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  // Cleanup agent listeners on unmount
  useEffect(() => {
    return () => {
      agentListenersRef.current.forEach((fn) => fn())
      agentListenersRef.current = []
    }
  }, [])

  // Persist messages to localStorage
  useEffect(() => {
    const timer = setTimeout(() => saveMessages(messages), 500)
    return () => clearTimeout(timer)
  }, [messages])

  const addAgentMessage = useCallback((content: string, sources?: ChatMessageType['sources']) => {
    const msg: ChatMessageType = {
      id: Date.now().toString(),
      role: 'assistant',
      content,
      sources,
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, msg])
  }, [])

  const handleAgentTask = useCallback(async (text: string) => {
    if (!agent) return

    // Add user message
    const userMsg: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: `🤖 ${text}`,
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, userMsg])
    setStatus('thinking')

    // Setup event listeners
    const onActivity = (e: CustomEvent) => {
      const activity = e.detail
      switch (activity.type) {
        case 'thinking':
          addAgentMessage(`🤔 正在分析页面...`)
          break
        case 'executing':
          addAgentMessage(`🔧 执行操作: ${activity.tool}\n\`\`\`\n${JSON.stringify(activity.input, null, 2)}\n\`\`\``)
          break
        case 'executed':
          addAgentMessage(`✅ 操作完成 (${activity.duration}ms)\n\`\`\`\n${activity.output.slice(0, 200)}\n\`\`\``)
          break
        case 'error':
          addAgentMessage(`❌ 错误: ${activity.message}`)
          break
      }
    }

    const onStatusChange = () => {
      if (agent.status === 'completed') {
        addAgentMessage(`✅ 任务完成！`)
        setStatus('idle')
      } else if (agent.status === 'error') {
        addAgentMessage(`❌ 任务执行出错`)
        setStatus('idle')
      } else if (agent.status === 'stopped') {
        addAgentMessage(`⏹ 任务已停止`)
        setStatus('idle')
      }
    }

    agent.addEventListener('activity', onActivity)
    agent.addEventListener('statuschange', onStatusChange)
    agentListenersRef.current.push(
      () => agent.removeEventListener('activity', onActivity),
      () => agent.removeEventListener('statuschange', onStatusChange),
    )

    try {
      await agent.execute(text)
    } catch (err: any) {
      addAgentMessage(`❌ 执行失败: ${err.message}`)
      setStatus('idle')
    }
  }, [agent, addAgentMessage])

  const handleChat = async (text: string) => {
    const userMsg: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    }

    const assistantMsg: ChatMessageType = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMsg, assistantMsg])
    setStatus('thinking')

    try {
      let fullContent = ''
      await chatWithLLM(
        [...messages, userMsg],
        {},
        (chunk) => {
          setStatus('streaming')
          fullContent += chunk
          setMessages((prev) => {
            const updated = [...prev]
            const last = updated[updated.length - 1]
            if (last.role === 'assistant') {
              updated[updated.length - 1] = { ...last, content: fullContent }
            }
            return updated
          })
        },
      )
      setStatus('idle')
    } catch (err: any) {
      console.error('[ChatPanel] LLM error:', err)
      setMessages((prev) => {
        const updated = [...prev]
        const last = updated[updated.length - 1]
        if (last.role === 'assistant') {
          updated[updated.length - 1] = {
            ...last,
            content: `抱歉，出错了：${err.message || '请求失败，请重试'}`,
          }
        }
        return updated
      })
      setStatus('idle')
    }
  }

  const handleSend = (text: string) => {
    if (mode === 'agent' && agent) {
      handleAgentTask(text)
    } else {
      handleChat(text)
    }
  }

  const isBusy = status === 'thinking' || status === 'streaming'

  return (
    <div className="fixed top-0 right-0 bottom-0 z-50 flex flex-col w-[420px] max-w-[90vw] bg-gradient-to-b from-gray-50 via-white to-white dark:from-gray-950 dark:via-gray-950 dark:to-gray-950 border-l border-gray-200/70 dark:border-gray-800/70 shadow-2xl shadow-black/10 animate-slide-in-right">
      {/* Header */}
      <div className="shrink-0 border-b border-gray-100/80 dark:border-gray-800/60 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl px-4 py-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs shadow-sm shadow-emerald-500/20">
              H
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-tight">
                HHXX 智能助手
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                <span className="text-[11px] text-gray-400 dark:text-gray-500">
                  {status === 'thinking' ? '思考中...' : status === 'streaming' ? '回答中...' : '在线'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Mode toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-[10px] p-0.5 gap-0.5">
              <button
                onClick={() => setMode('chat')}
                className={`px-2.5 py-1.5 rounded-[8px] text-[11px] font-medium transition-all duration-200 ${
                  mode === 'chat'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                💬 对话
              </button>
              <button
                onClick={() => {
                  if (agentReady) setMode('agent')
                }}
                disabled={!agentReady}
                className={`px-2.5 py-1.5 rounded-[8px] text-[11px] font-medium transition-all duration-200 ${
                  mode === 'agent'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : !agentReady
                      ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                🤖 自动化
              </button>
            </div>

            {/* Clear */}
            <button
              onClick={() => {
                localStorage.removeItem(STORAGE_KEY)
                setMessages(loadMessages())
              }}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200"
              title="清空对话"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200"
            >
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mode indicator */}
        {mode === 'agent' && (
          <div className="mt-2">
            <div className="flex items-center gap-2 text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 rounded-lg px-3 py-1.5 border border-amber-200/50 dark:border-amber-800/50">
              <span>⚡</span>
              <span>自动化模式</span>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-5 scroll-smooth"
      >
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {/* Thinking indicator */}
        {isBusy && messages[messages.length - 1]?.content === '' && (
          <div className="flex items-start gap-3 mb-5">
            <div className="shrink-0 w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-[10px] font-bold shadow-sm shadow-emerald-500/20">
              A
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-2xl rounded-tl-sm shadow-sm px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="ml-1 text-[11px] text-gray-400">
                  {mode === 'agent' ? '执行中' : '思考中'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput
        onSend={handleSend}
        disabled={isBusy}
        placeholder={mode === 'agent' ? '输入操作指令...' : undefined}
      />
    </div>
  )
}
