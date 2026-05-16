import { useState, useRef, useEffect, useCallback } from 'react'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { Send, Loader2, Trash2, Mic, Plus } from 'lucide-react'
import { CozeAPI, RoleType } from '@coze/api'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const BOT_ID = '7640388142570684451'
const TOKEN = 'pat_EA8ohczLvGSuWzoKT8Z1sFIzUGc1nq1czYbYeyn6VagbHjMJAUNKWbnEjh8tIyqM'

const STORAGE_KEY = 'ai_assistant_conv'

const QUICK_QUESTIONS = [
  '请解释安检隐患分级标准的具体内容',
  'CRM工单的流转流程是怎样的？',
  'HSE和客服质量记分标准在哪里查询',
]

const WELCOME_TEXT =
  '您好，我是南宁中燃客户服务部的 AI 助手，能为您解答组织架构、岗位职责等相关问题，确保回答规范且引用来源。'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const api = new CozeAPI({
  token: TOKEN,
  baseURL: 'https://api.coze.cn',
  allowPersonalAccessTokenInBrowser: true,
})

function loadConversationId(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || ''
  } catch {
    return ''
  }
}

function saveConversationId(id: string) {
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {}
}

function AiAssistantDrawer() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [convId, setConvId] = useState(loadConversationId)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(
    async (text?: string) => {
      const question = (text || input).trim()
      if (!question || loading) return

      if (!text) setInput('')
      setLoading(true)

      const userMsg: Message = { role: 'user', content: question }
      setMessages((prev) => [...prev, userMsg])

      try {
        const res = await api.chat.createAndPoll({
          bot_id: BOT_ID,
          user_id: 'web-user',
          additional_messages: [
            { role: RoleType.User, content: question, content_type: 'text' },
          ],
          auto_save_history: true,
          conversation_id: convId || undefined,
        })

        if (res.chat.conversation_id && !convId) {
          setConvId(res.chat.conversation_id)
          saveConversationId(res.chat.conversation_id)
        }

        const answerMessages = (res.messages || []).filter(
          (m) => m.role === 'assistant' && m.type === 'answer'
        )
        const assistantContent = answerMessages.map((m) => m.content).join('\n\n')

        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: assistantContent || '抱歉，未能获取有效回复。' },
        ])
      } catch (err: any) {
        console.error('Coze API error:', err)
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `请求失败：${err?.message || '未知错误'}。请检查网络或 Coze 配置。`,
          },
        ])
      } finally {
        setLoading(false)
      }
    },
    [input, loading, convId]
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearHistory = () => {
    setMessages([])
    setConvId('')
    saveConversationId('')
  }

  const hasStarted = messages.length > 0

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex size-[50px] cursor-pointer items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
        style={{
          background: 'transparent',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        }}
        title="AI 查询助手"
      >
        <img
          src="./ai-assistant-icon.png"
          alt="AI 助手"
          className="size-[50px] rounded-full object-cover"
        />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="flex w-[440px] flex-col p-0 sm:max-w-[440px]"
        >
          <SheetTitle className="sr-only">AI 查询助手</SheetTitle>

          <div className="flex items-center border-b border-border px-5 py-3 shrink-0">
            <img
              src="./ai-assistant-icon.png"
              alt="AI"
              className="size-8 rounded-full object-cover shrink-0"
            />
            <div className="ml-3">
              <h2 className="text-sm font-semibold text-foreground">AI 查询助手</h2>
              <p className="text-xs text-muted-foreground">南宁中燃客服部</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            {!hasStarted && (
              <div className="flex flex-col items-center px-4 pt-8 pb-4">
                <img
                  src="./ai-assistant-icon.png"
                  alt="AI"
                  className="size-16 rounded-full object-cover mb-4"
                />
                <p className="text-base font-semibold text-foreground mb-4">
                  南宁中燃客服AI助手
                </p>

                <div className="w-full rounded-xl bg-muted px-4 py-3 text-sm leading-relaxed text-foreground mb-5">
                  {WELCOME_TEXT}
                </div>

                <div className="flex flex-wrap gap-2 w-full">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="rounded-full border border-border bg-background px-4 py-2 text-xs text-foreground hover:bg-accent transition-colors text-left"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="px-4 py-4 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="prose prose-sm dark:prose-invert max-w-none break-words [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-xl bg-muted px-4 py-2.5">
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">思考中...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-border p-3 shrink-0">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs text-muted-foreground">AI 查询助手</span>
              {hasStarted && (
                <button
                  onClick={clearHistory}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <Trash2 className="size-3" />
                  清除历史
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button className="flex size-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors" title="上传文件">
                <Plus className="size-5" />
              </button>
              <div className="flex-1 flex items-center rounded-full border border-border bg-background px-4 py-2 focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="发送消息..."
                  disabled={loading}
                  className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
                />
                <div className="flex items-center gap-1">
                  <button className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors" title="语音输入">
                    <Mic className="size-4" />
                  </button>
                  <button
                    onClick={() => sendMessage()}
                    disabled={loading || !input.trim()}
                    className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                    title="发送"
                  >
                    <Send className="size-4" />
                  </button>
                </div>
              </div>
            </div>
            <p className="text-center text-[10px] text-muted-foreground mt-2">
              内容由AI生成，无法确保真实准确，仅供参考。
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default AiAssistantDrawer
