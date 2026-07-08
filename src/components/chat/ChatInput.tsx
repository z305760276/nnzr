import { useState, useRef, useEffect } from 'react'

interface Props {
  onSend: (text: string) => void
  disabled: boolean
  placeholder?: string
}

export function ChatInput({ onSend, disabled, placeholder = '输入消息...' }: Props) {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!disabled && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [disabled])

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setText('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-gray-100 dark:border-gray-800/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl px-4 py-3">
      <div className="max-w-3xl mx-auto flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            disabled={disabled}
            className="w-full resize-none rounded-2xl border border-gray-200 dark:border-gray-700
              bg-gray-50/80 dark:bg-gray-800/80 px-4 py-3 pr-12 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400
              disabled:opacity-50 disabled:cursor-not-allowed
              text-gray-900 dark:text-gray-100 placeholder-gray-400
              transition-all duration-200"
            style={{ minHeight: 44, maxHeight: 120 }}
          />
          <kbd className="absolute right-3 bottom-3 hidden sm:inline text-[10px] text-gray-400 dark:text-gray-500 bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded font-mono">
            ↵
          </kbd>
        </div>

        <button
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          className="shrink-0 h-11 w-11 rounded-2xl flex items-center justify-center
            bg-gradient-to-br from-blue-500 to-indigo-600
            hover:from-blue-600 hover:to-indigo-700
            disabled:from-gray-300 disabled:to-gray-300 dark:disabled:from-gray-700 dark:disabled:to-gray-700
            text-white shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/30
            transition-all duration-200 disabled:cursor-not-allowed
            active:scale-95"
        >
          {disabled ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
