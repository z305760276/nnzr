export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  sources?: KnowledgeSource[]
  timestamp: number
}

export interface KnowledgeSource {
  title: string
  content: string
  score: number
}

export interface KnowledgeChunk {
  chunk_id: string
  content: string
  score: number
  title?: string
}

export interface LLMOption {
  model?: string
  temperature?: number
  max_tokens?: number
  stream?: boolean
}

export type ChatStatus = 'idle' | 'loading' | 'thinking' | 'streaming' | 'error'
