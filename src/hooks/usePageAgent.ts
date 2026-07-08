import { useEffect, useRef, useState, useCallback } from 'react'

const PAGE_AGENT_CDN =
  'https://registry.npmmirror.com/page-agent/1.11.0/files/dist/iife/page-agent.js'

export function usePageAgent() {
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const agentRef = useRef<any>(null)

  useEffect(() => {
    if ((window as any).PageAgent) {
      setReady(true)
      return
    }

    const script = document.createElement('script')
    script.src = PAGE_AGENT_CDN
    script.async = true
    script.onload = () => {
      setReady(true)
    }
    script.onerror = () => {
      setError('PageAgent 加载失败')
    }
    document.body.appendChild(script)

    return () => {
      script.remove()
    }
  }, [])

  const execute = useCallback(
    async (command: string): Promise<string> => {
      if (!(window as any).PageAgent) {
        return 'PageAgent 未就绪'
      }

      try {
        if (!agentRef.current) {
          agentRef.current = new (window as any).PageAgent({
            model: 'doubao-pro-32k',
            baseURL: 'https://api.coze.cn/v3',
            apiKey: '', // will be set on first use
            language: 'zh-CN',
          })
        }
        const result = await agentRef.current.execute(command)
        return result
      } catch (err: any) {
        return `操作失败: ${err.message || String(err)}`
      }
    },
    [],
  )

  return { ready, error, execute }
}
