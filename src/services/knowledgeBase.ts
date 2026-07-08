import { AI_CONFIG } from '../config/ai'
import type { KnowledgeChunk } from '../types/chat'

interface RetrieveResponse {
  code: number
  msg: string
  data?: {
    chunks: KnowledgeChunk[]
  }
}

export async function searchKnowledgeBase(query: string): Promise<KnowledgeChunk[]> {
  const url = `${AI_CONFIG.cozeBaseUrl}/v1/datasets/${AI_CONFIG.cozeDatasetId}/retrieve`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${AI_CONFIG.cozeApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      search_strategy: 0,
      max_chunk_count: 5,
      max_chunk_content_length: 2000,
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    console.error('[KnowledgeBase] API error:', response.status, text)
    return []
  }

  const result: RetrieveResponse = await response.json()

  if (result.code !== 0) {
    console.error('[KnowledgeBase] API error:', result.code, result.msg)
    return []
  }

  return result.data?.chunks ?? []
}
