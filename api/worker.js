// Cloudflare Worker — AI 助手后端代理
// 部署方式：Cloudflare Dashboard → Workers & Pages → 创建 Worker → 粘贴本文件
// 环境变量：DEEPSEEK_API_KEY（必填）

// 允许的来源域名
const ALLOWED_ORIGINS = [
  'https://z305760276.github.io',
  'http://localhost:3000',
  'http://localhost:5173',
];

// CORS 头
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function validateOrigin(request) {
  const origin = request.headers.get('Origin') || '';
  if (!origin) return true; // 允许无 origin 的请求（curl 等）
  return ALLOWED_ORIGINS.some((allowed) => origin.startsWith(allowed));
}

function buildSystemPrompt(knowledgeContext) {
  const base = `你是一个专业的燃气行业智能助手，名叫"燃气管家"。你为南宁中燃客户服务部提供支持。

回答要求：
1. 优先参考下方提供的"相关知识库内容"来回答
2. 如果知识库中没有相关内容，请基于自身知识回答，但需注明"仅供参考"
3. 回答要简洁专业，控制在 300 字以内
4. 使用 Markdown 格式组织回答，善用列表、表格、加粗等格式
5. 当涉及具体数据或标准时，务必引用来源`;

  if (knowledgeContext) {
    return `${base}\n\n## 相关知识库内容\n\n${knowledgeContext}\n\n请优先参考以上知识库内容。`;
  }
  return base;
}

export default {
  async fetch(request, env) {
    // CORS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
      });
    }

    // 仅接受 POST
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: '仅支持 POST 请求' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    // 来源验证
    if (!validateOrigin(request)) {
      return new Response(JSON.stringify({ error: '拒绝来源' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    // 解析请求体
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: '无效的 JSON' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    const { message, history, systemPrompt } = body;
    if (!message || !message.trim()) {
      return new Response(JSON.stringify({ error: '消息不能为空' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    const apiKey = env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: 'AI 服务未配置',
          reply: '抱歉，AI 服务尚未配置，请联系管理员。',
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        }
      );
    }

    // 构建 messages 数组
    const messages = [
      { role: 'system', content: systemPrompt || buildSystemPrompt() },
    ];
    if (history && Array.isArray(history)) {
      messages.push(...history);
    }
    messages.push({ role: 'user', content: message });

    try {
      const result = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages,
          temperature: 0.7,
          max_tokens: 800,
        }),
      });

      if (!result.ok) {
        const errText = await result.text();
        console.error('DeepSeek API 错误:', result.status, errText);
        throw new Error(`DeepSeek API 返回 ${result.status}`);
      }

      const data = await result.json();
      const reply = data.choices?.[0]?.message?.content || '';

      return new Response(JSON.stringify({ reply }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    } catch (err) {
      console.error('AI 调用失败:', err.message);
      return new Response(
        JSON.stringify({
          error: 'AI 服务暂时不可用',
          reply: `抱歉，AI 服务暂时不可用，请稍后再试。`,
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        }
      );
    }
  },
};
