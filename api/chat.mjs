import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '仅支持 POST 请求' });
  }

  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: '消息不能为空' });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'AI 服务未配置',
      reply: '抱歉，AI 服务尚未配置 API Key，请联系管理员。',
    });
  }

  try {
    const result = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `你是一个专业的燃气行业智能助手，名叫"燃气管家"。你为南宁中燃客户服务部提供支持。
你的知识库包含以下内容：
1. 组织架构：客户服务部下设多个科室，包括综合管理室、客户服务室、安检管理室、隐患管理室等
2. 安全隐患分类：分为三级——一级隐患（立即危险）、二级隐患（需限期整改）、三级隐患（需关注）
3. 服务指标：包括服务满意度、安检完成率、隐患整改率、工单处理时效等
4. 业务流程：CRM工单流转、安检流程、隐患整改流程、客户服务流程等

请基于以上知识回答用户问题。如果不清楚具体细节，请诚实说明，并建议用户查阅相关制度文档。回答要简洁专业，控制在200字以内。`,
          },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 500,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        timeout: 30000,
      }
    );

    const reply = result.data.choices?.[0]?.message?.content || '';
    res.json({ reply });
  } catch (err) {
    const detail = err.response?.data || err.message;
    console.error('DeepSeek API 调用失败:', detail);
    res.status(503).json({
      error: 'AI 服务暂时不可用',
      reply: '抱歉，AI 服务暂时不可用，请稍后再试。',
    });
  }
}
