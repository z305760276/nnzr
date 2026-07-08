import { AI_CONFIG } from '../config/ai'
import type { ChatMessage, LLMOption } from '../types/chat'
import { searchKnowledgeBase } from './knowledgeBase'

const SYSTEM_PROMPT = `你是 HHXX 智能助手，具备以下能力：

1. **知识库查询**：当用户问题涉及制度、标准、法规、公司流程时，
   你会自动检索知识库获取准确信息后回答，并在回答末尾注明引用来源。
2. **页面操作**：可以协助用户执行页面导航、点击、填写等操作。
3. **普通对话**：直接回答用户问题。

回答要求：
- 知识库有相关内容时，基于知识库回答并标注来源
- 知识库没有相关内容时，基于自身知识回答
- 保持专业、简洁、准确`

export async function chatWithLLM(
  messages: ChatMessage[],
  options: LLMOption = {},
  onChunk?: (chunk: string) => void,
): Promise<string> {
  const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')
  let knowledgeContext = ''

  if (lastUserMsg) {
    const chunks = await searchKnowledgeBase(lastUserMsg.content)
    if (chunks.length > 0) {
      knowledgeContext =
        '\n\n知识库检索结果（供参考）：\n' +
        chunks
          .map((c, i) => `[来源${i + 1}] ${c.title || '知识库'}:\n${c.content}`)
          .join('\n\n')
    }
  }

  const apiMessages: { role: string; content: string }[] = [
    { role: 'system', content: SYSTEM_PROMPT + knowledgeContext },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ]

  const url = `${AI_CONFIG.deepseekBaseUrl}/chat/completions`

  const body = {
    model: options.model || AI_CONFIG.llmModel,
    messages: apiMessages,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.max_tokens ?? 4096,
    stream: !!onChunk,
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${AI_CONFIG.deepseekApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`LLM API error (${response.status}): ${text}`)
  }

  if (onChunk && body.stream) {
    return handleStreamResponse(response, onChunk)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content ?? ''
}

async function handleStreamResponse(
  response: Response,
  onChunk: (chunk: string) => void,
): Promise<string> {
  const reader = response.body?.getReader()
  if (!reader) throw new Error('No response body')

  const decoder = new TextDecoder()
  let fullContent = ''
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || !trimmed.startsWith('data: ')) continue

      const data = trimmed.slice(6)
      if (data === '[DONE]') continue

      try {
        const parsed = JSON.parse(data)
        const delta = parsed.choices?.[0]?.delta?.content
        if (delta) {
          fullContent += delta
          onChunk(delta)
        }
      } catch {
        // skip malformed chunks
      }
    }
  }

  return fullContent
}
