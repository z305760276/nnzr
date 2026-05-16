import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

async function callDeepSeek(message) {
  const res = await axios.post(
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
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      timeout: 30000,
    }
  );
  return res.data.choices?.[0]?.message?.content || '';
}

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: '消息不能为空' });
  }
  try {
    const reply = await callDeepSeek(message);
    res.json({ reply });
  } catch (err) {
    const detail = err.response?.data || err.message;
    console.error('DeepSeek API 调用失败:', detail);
    res.status(503).json({
      error: 'AI 服务暂时不可用',
      reply: `抱歉，我暂时无法连接 AI 引擎。关于"${message}"，请稍后再试或查阅左侧导航栏的相关模块文档。`,
    });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`AI 助手代理服务器运行在 http://localhost:${PORT}`);
  console.log(`AI 模型: DeepSeek Chat`);
});
