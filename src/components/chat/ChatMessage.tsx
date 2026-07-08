import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ChatMessage as ChatMessageType } from '../../types/chat'

interface Props {
  message: ChatMessageType
}

export function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user'
  const [expandedSource, setExpandedSource] = useState<number | null>(null)

  return (
    <div className={`flex items-start gap-3 mb-5 group ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold
          ${isUser
            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm shadow-blue-500/20'
            : 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-sm shadow-emerald-500/20'
          }`}
      >
        {isUser ? '我' : 'A'}
      </div>

      {/* Bubble */}
      <div className={`flex flex-col max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`w-fit rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isUser
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-sm shadow-sm shadow-blue-500/10'
              : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm border border-gray-100 dark:border-gray-700/50 shadow-sm'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:bg-gray-100 dark:prose-code:bg-gray-700 prose-code:text-xs prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:rounded-xl">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content || '...'}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Sources */}
        {message.sources && message.sources.length > 0 && (
          <div className={`mt-2 flex flex-wrap gap-1.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {message.sources.slice(0, 3).map((s, i) => (
              <button
                key={i}
                onClick={() => setExpandedSource(expandedSource === i ? null : i)}
                className="text-[11px] px-2 py-1 rounded-lg bg-gray-50 dark:bg-gray-800/80 
                  border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400
                  hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                📎 {s.title || `来源 ${i + 1}`}
              </button>
            ))}
            {message.sources.length > 3 && (
              <span className="text-[11px] px-2 py-1 text-gray-400">
                +{message.sources.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Expanded source content */}
        {expandedSource !== null && message.sources?.[expandedSource] && (
          <div className="mt-2 text-xs bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-200 dark:border-gray-700 max-w-md">
            <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
              {message.sources[expandedSource].title || `来源 ${expandedSource + 1}`}
            </p>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              {message.sources[expandedSource].content.slice(0, 300)}
              {message.sources[expandedSource].content.length > 300 ? '...' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
