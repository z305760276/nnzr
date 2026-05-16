import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

async function callDeepSeek(message, history, systemPrompt) {
  const messages = [
    { role: 'system', content: systemPrompt },
  ];
  if (history && Array.isArray(history)) {
    messages.push(...history);
  }
  messages.push({ role: 'user', content: message });

  const res = await axios.post(
    'https://api.deepseek.com/v1/chat/completions',
    {
      model: 'deepseek-chat',
      messages,
      temperature: 0.7,
      max_tokens: 800,
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
  const { message, history, systemPrompt } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: '消息不能为空' });
  }
  try {
    const reply = await callDeepSeek(message, history, systemPrompt);
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
